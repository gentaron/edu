# ADR-0007: Hermeticity as ZK-Proof Prerequisite

**Status:** Accepted
**Phase:** η (Eta)
**Date:** 2026-05-02
**Tags:** nix, slsa, hermeticity, reproducibility, build-hash

## Context

Phase ε established ZK-verifiable battle replays via a Merkle commitment scheme
(ADR-0005). The `BattleCommitment` structure binds every proof to the binary that
produced it — the proof is only valid if the engine binary is bit-identical to
the one used during proof generation.

Without hermetic builds, this guarantee collapses. A different compiler version,
system library, or Nix store path produces a different binary, which produces a
different `BUILD_HASH`, which causes V2 proof verification to fail. The entire
competitive integrity layer — leaderboard rankings, tournament results, NFT
minting — becomes non-deterministic across machines.

Phase η makes hermeticity a **hard dependency**: reproducible builds are not a
nice-to-have but a prerequisite for the proof system to function at all.

### Current State (Pre-η)

- CI builds are "mostly deterministic" but not guaranteed
- `BUILD_HASH` exists as a build-time constant but is not derived from the Nix
  store path
- No provenance chain exists — artifacts cannot be traced to source commits
- Balance gate (referenced in ζ) is documented but not implemented
- `cards/wasm-hashes.lock` exists but is not enforced in CI

## Decision

### 1. Nix Flake for Hermetic Dev/Build Environment

Adopt `flake.nix` as the single source of truth for all build inputs:

- Pins Rust toolchain, Lean 4, Node.js, Qiskit, and all system dependencies
- Derives `BUILD_HASH` from the Nix store path of the engine binary
- Provides `nix develop` for local development and `nix build` for CI
- Cross-platform: x86-64, aarch64 (native), RISC-V (QEMU smoke test)

### 2. BuildHash as a Proof Public Input

The `BuildHash` branded type threads through every proof surface:

- **Prover**: `BUILD_HASH` injected at compile time from Nix store path
- **Commitment**: `BattleCommitment` includes `build_hash` as a public input
- **Verification (V2)**: Rejects proofs where `build_hash` doesn't match
- **Backward compatibility (V1)**: Pre-η proofs accepted without hash check
- **NFT minting**: `edunft` integration requires matching `build_hash`
- **Leaderboard**: Score submission requires valid `build_hash` attestation
- **Replay**: Shared replays include `build_hash` for cross-machine verification

### 3. ProofVersion (V1/V2) Migration

| Version | Hash Check                        | Scope                          |
| ------- | --------------------------------- | ------------------------------ |
| V1      | No `build_hash` field             | Pre-η proofs (backward compat) |
| V2      | Exact `build_hash` match required | Post-η proofs (load-bearing)   |

V1 proofs are accepted indefinitely for backward compatibility. V2 proofs are
rejected if the `build_hash` does not match the verifying binary. This allows
a clean migration without invalidating existing replays.

### 4. SLSA L3 Provenance

Implement SLSA (Supply-chain Levels for Software Artifacts) Level 3:

- **Provenance generation**: `slsa-framework` GitHub Action generates SLSA
  attestations for every release build
- **Verification**: `cosign verify` in CI and downstream consumers
- **SBOM**: CycloneDX + SPDX manifests attached to every release
- **Keyless signing**: Sigstore OIDC-based attestation (no secret key management)

### 5. Balance Gate CI

A CI job that blocks PRs which modify card stats without corresponding Lean 4
proof updates:

- Diff `cards/*.json` against `main`
- If card stats changed, require `lake build` to succeed
- Termination tests must pass (from ADR-0006's `NoInfiniteCombo.lean`)
- Merge is blocked until proofs are updated

### 6. WASM Hash Lock

The `cards/wasm-hashes.lock` file records SHA-256 hashes of all compiled WASM
modules. CI enforces that a recompilation produces bit-identical output:

- Recompile all WASM targets in a clean Nix environment
- Compare against `cards/wasm-hashes.lock`
- Any mismatch blocks the build (non-deterministic compilation detected)

### 7. Cross-Platform Determinism

CI runs on three architectures:

| Architecture | Method             | Check                          |
| ------------ | ------------------ | ------------------------------ |
| x86-64       | Native             | Bit-identical output           |
| aarch64      | Native (macOS ARM) | Bit-identical output           |
| RISC-V       | QEMU emulation     | Smoke test + output comparison |

The RISC-V check is a CI gate (not a user-facing demo). The `/forge/metal`
showcase page is explicitly **out of scope**.

### 8. Explicitly Out of Scope

The following surfaces are **not created** in Phase η:

- `/about/build` — Showcase surface, contradicts η's "infra, not demo" principle
- `/forge/metal` — Interactive demo, Phase η excludes user-facing build visualization

## Consequences

### Positive

- **Reproducible builds**: `nix build` produces bit-identical outputs across any
  machine with Nix installed
- **Cross-machine proof consistency**: V2 proofs verify on any machine running the
  same Nix store path
- **Regulatory compliance**: SLSA L3 provenance + SBOM meet supply-chain
  security requirements
- **Balance integrity**: Balance gate prevents unverified card changes from
  reaching production
- **Deterministic WASM**: Hash lock catches non-deterministic Apolon compilation

### Negative

- **CI time increase**: Full hermetic build adds ~8-12 min to CI pipeline
  (mitigated by Nix caching and incremental evaluation)
- **Nix learning curve**: Contributors must learn Nix flake basics
- **Qiskit pinning complexity**: Qiskit has heavy Python dependencies that are
  difficult to pin in Nix (mitigated by container fallback)
- **Balance gate friction**: Card balance PRs now require Lean proof updates,
  increasing review burden

### Risk Mitigation

| Risk                                          | Mitigation                                                          |
| --------------------------------------------- | ------------------------------------------------------------------- |
| Qiskit Nix pin too heavy                      | Run Qiskit in a separate container, import results into Nix         |
| Lean 4 cache bloat in Nix                     | Store Lake package cache outside Nix store, mount at build time     |
| CI time budget exceeded                       | Full hermetic build on release branches only; PRs use cached checks |
| `BUILD_HASH` mismatch on contributor machines | `nix develop` provides the exact same environment as CI             |
| Proof migration breakage                      | V1 proofs accepted indefinitely; V2 migration is opt-in per replay  |

## Alternatives Considered

1. **Docker-only reproducibility**: Rejected — Docker layers are not bit-identical
   across rebuilds; Nix store paths provide stronger guarantees
2. **Guix instead of Nix**: Rejected — smaller ecosystem, harder CI integration
3. **No build hash (trust compiler)**: Rejected — undermines the entire proof
   system; a compiler change would silently invalidate all proofs
4. **Post-hoc hash (hash the binary after build)**: Rejected — doesn't prevent
   non-deterministic builds; Nix store path provides hermeticity at the input
   level

## Related

- ADR-0005: ZK-Verifiable Battle Replays (Phase ε)
- ADR-0006: Lean 4 as Load-Bearing Engine Code (Phase ζ)
- `flake.nix`
- `crates/edu-prover/src/types.rs` (BuildHash branded type)
- `crates/edu-prover/src/commitment.rs` (BattleCommitment)
- `cards/wasm-hashes.lock`
- `proofs/lean/Apolon/NoInfiniteCombo.lean` (termination proof for balance gate)
