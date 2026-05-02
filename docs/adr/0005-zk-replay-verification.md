# ADR-0005: ZK-Verifiable Battle Replays via Merkle Commitment Scheme

**Status**: Accepted
**Date**: 2026-05-02
**Phase**: ε (Epoch 12)
**Decision Makers**: gentaron

## Context

Battle replays in EDU are deterministic — the same deck, enemy seed, and action sequence always produce the same outcome. However, when sharing replays (e.g., via `gentaron/edunft` NFT cards), there is no cryptographic guarantee that a claimed replay hasn't been tampered with. A malicious actor could alter the action sequence to fabricate a victory that never occurred.

The Phase ε requirement calls for **ZK-verifiable battle outcomes** where:

- A prover generates a proof from the full private action sequence
- A verifier (in-browser, < 200ms) confirms the proof without learning the sequence
- Public inputs (deck commitment, enemy seed, final outcome) are visible
- Private inputs (full action sequence) remain hidden

## Decision

### Primary: SHA-256 Merkle Commitment Scheme

We adopt a **Merkle commitment + hash-based integrity** scheme as the initial implementation, with an upgrade path to full zero-knowledge proofs (RISC Zero or Halo2).

#### Architecture

```
┌──────────────────────────────────────┐
│  edu-prover (native Rust)            │
│  ├── types.rs    Branded types       │
│  ├── merkle.rs   Merkle tree         │
│  ├── replay.rs   Replay trace        │
│  └── commitment.rs Battle commitment  │
└──────────┬───────────────────────────┘
           │  serde_json serialized
┌──────────▼───────────────────────────┐
│  edu-verifier (WASM, browser-side)   │
│  ├── verify.rs   Verification logic  │
│  └── lib.rs      WASM bridge (4 fns) │
└──────────────────────────────────────┘
```

#### Commitment Structure

A `BattleCommitment` contains:

1. **Public inputs**: deck commitment hash, enemy seed hash, outcome record
2. **State root**: Merkle root of per-turn state snapshots
3. **Witness digest**: SHA-256 hash of the complete action sequence (private)
4. **Proof ID**: Derived from all public inputs + witness digest

#### Verification Flow

1. Prover: Build `ReplayTrace` from engine state → compute commitments
2. Prover: Serialize `BattleCommitment` to JSON → publish
3. Verifier: Deserialize commitment → check public input hashes match
4. Verifier: Confirm proof_id, state_root, and witness are well-formed
5. Optional: Verify trace integrity (witness matches step sequence)

### Alternative Considered: RISC Zero zkVM

RISC Zero was evaluated as the primary ZK backend because `edu-engine-core` is `no_std` and could theoretically compile as a zkVM guest program.

**Why not adopted immediately:**

| Concern               | Impact                                                                              |
| --------------------- | ----------------------------------------------------------------------------------- |
| CI build time         | RISC Zero toolchain adds ~5-10 min to CI, risking the 25-minute free-tier budget    |
| SIMD incompatibility  | `edu-engine-core`'s SIMD module (`core::simd`) is not supported by RISC Zero's zkVM |
| Crate size            | RISC Zero guest + host adds significant WASM binary size, approaching 250KB budget  |
| Dependency complexity | RISC Zero requires specific Rust nightly and custom toolchain setup                 |

**Upgrade path preserved**: The `CommitmentBuilder` API is designed to accept a future `ZkGuest` trait that would:

1. Wrap `edu-engine-core` battle simulation as a guest program
2. Generate RISC Zero receipts instead of Merkle commitments
3. Verify receipts on-chain via `gentaron/edunft`

The branded types (`ProofId`, `ReplayHash`, `WitnessDigest`) provide the abstraction layer needed for this migration.

### Alternative Considered: Halo2

Halo2 (PSE) was also evaluated. While it avoids the SIMD incompatibility issue (custom circuits), it requires writing circuit logic manually — a significantly larger engineering effort with less alignment to our existing `edu-engine-core` codebase.

## Consequences

### Positive

- **Cryptographic integrity**: Tampered replays are detected with SHA-256 collision resistance
- **Branded types**: `ProofId`, `ReplayHash`, `WitnessDigest` prevent primitive obsession
- **Browser verification**: WASM bridge enables < 1ms verification (well under 200ms target)
- **Merkle proofs**: Per-turn state snapshots can be individually verified
- **Upgrade path**: Clean API for future RISC Zero / Halo2 integration
- **56 new tests**: 44 prover + 12 verifier, covering happy paths and adversarial cases

### Negative

- **Not true zero-knowledge**: The scheme provides integrity (hash-based) but not zero-knowledge. The action sequence is hidden only by not being transmitted, not by cryptographic concealment.
- **Trusted prover**: The verifier trusts that the prover correctly computed the commitment. A malicious prover could generate a valid commitment for a fabricated replay. Full ZK would eliminate this trust requirement.

### Risks

1. **RISC Zero budget risk**: CI free-tier minutes may be insufficient for proof generation benchmarks once upgraded
2. **SIMD path**: The `core::simd` module in `edu-engine-core` requires a separate non-SIMD code path for zkVM targets
3. **WASM size**: `edu-verifier` WASM binary must stay within the cumulative 250KB budget

### Metrics

| Metric                 | Value                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------- |
| New Rust crates        | 2 (edu-prover, edu-verifier)                                                        |
| New Rust tests         | 56 (44 + 12)                                                                        |
| Total Rust tests       | 217 (was 161)                                                                       |
| WASM bridge functions  | 4 (verify_replay, compute_deck_hash, compute_enemy_hash, verify_trace_integrity)    |
| Branded types          | 3 (ProofId, ReplayHash, WitnessDigest)                                              |
| Merkle tree operations | push, root, proof (generation + verification)                                       |
| Commitment fields      | 7 (proof_id, deck_commitment, enemy_seed, outcome, state_root, witness, step_count) |
