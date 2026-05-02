# Lore-Tech Mapping

This document maps every technical artifact in the EDU repository to its in-universe canon counterpart.

## Core Mappings

| Tech Artifact                                | Canon Mapping                                                              | Layer              |
| -------------------------------------------- | -------------------------------------------------------------------------- | ------------------ |
| `edu-engine-core` (no_std)                   | Apolon Execution Shrine — bare-metal battle runtime                        | L0 Metal           |
| `xoshiro256++` RNG                           | Apolonium Seeded Cascade — deterministic probability field                 | L0 Metal           |
| RISC-V binary (`riscv64gc-unknown-none-elf`) | Bare-metal Apolon execution — no OS, no allocator                          | L0 Metal           |
| Kani bounded model checker                   | D1–D5 Adversarial Verification — mechanized defenses against unsafe states | L0 Metal           |
| Property-based proof tests                   | L0 Mathematical Layer — formal invariants verified by exhaustive fuzzing   | L1–L3 Light Layers |
| `EffectType` exhaustive enum (10 variants)   | The 10 Thought Layer resonance patterns                                    | L5 Session         |
| Battle FSM (deterministic transitions)       | The 8 Thought Layers progression — discrete cognitive strata shifts        | L5 Session         |
| Fixed-point arithmetic (u16 multiplier)      | The Dimension Horizon — unitary boundary of discrete computation           | L5 Session         |
| `BattleState` with `[FieldChar; 5]`          | The Field Convergence — 5 souls bound to a single spatial instance         | L6 Presentation    |
| `clamp_hp` invariant (0 <= hp <= max_hp)     | The Liminal Threshold — no soul may exceed its vessel                      | L5 Session         |

## Phase α Specific

| Component             | Lore                                                                    | Verification                         |
| --------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `edu-engine-core`     | The Apolon Execution Shrine — where calculations happen without runtime | Compiles to RISC-V, WASM, and native |
| `edu-engine-wasm`     | The Browser Conduit — thin bridge between shrine and the web            | Preserves 4 WASM bridge functions    |
| `edu-engine-native`   | The Research Observatory — where performance is measured                | criterion benchmarks                 |
| `edu-engine-embedded` | The Bare-Metal Vessel — proof the shrine needs nothing                  | 5768 bytes, runs on QEMU             |

## Phase β — Quantum Substrate

| Tech Artifact                | Canon Mapping                                                     | Verification                               |
| ---------------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `quantum/apolonium_field.py` | Apolonium quantum probability layer — 8-qubit entanglement chain  | Deterministic seed → byte-identical JSON   |
| `quantum-distributions.json` | The Apolonium PMF — canonical source for critical-hit probability | md5 verified across runs                   |
| `crates/edu-quasi` (no_std)  | Apolonium runtime kernel — QASM-2 interpreter without OS          | 74 tests, matches Qiskit within shot noise |
| CRYSTALS-Kyber-768 (ML-KEM)  | Dimensional key encapsulation — encrypts timeline state           | 15 PQC tests, roundtrip verified           |
| CRYSTALS-Dilithium (ML-DSA)  | Dimensional witness signature — signs battle replay               | 15 PQC tests, forgery detection verified   |
| All critical-strike rolls    | Drawn from the Qiskit-generated Apolonium PMF                     | 32 unique 8-bit outcomes                   |
| Dimension Horizon            | The unitary boundary of the simulated state vector                | 2^8 = 256-outcome probability space        |

## Phase γ — Apolon DSL

| Tech Artifact                                      | Canon Mapping                                                              | Verification                                 |
| -------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------- |
| Apolon DSL (`.apo`) → WASM                         | The Liminal Forge compilation pipeline — divine language of card abilities | Golden tests: TS↔WASM byte-identical results |
| SSA IR                                             | The 8 Thought Layers crystallized into computational form                  | Named basic blocks mirror cognitive strata   |
| Effect system (`pure` / `view` / `mut`)            | Three-tier invocation purity — celestial hierarchy of Forge operations     | Compile-time E0005 on violations             |
| Tree-sitter grammar (`tree-sitter-apolon`)         | The Lexicon of the Forge — formal structure of all Forged utterances       | ≥ 4 corpus test files                        |
| Lean 4 progress theorem skeleton                   | The L1–L3 Light Layers of mechanized truth (partial — ζ completes)         | `lake build` in CI                           |
| Branded types (`ModuleId`, `AbilityId`, `BlockId`) | True Names — unforgeable identities for every Forge artifact               | Opaque newtypes, compiler-generated only     |
| 250KB gzip WASM size budget                        | The Forge's output constraint — no Forged artifact exceeds its vessel      | Compiler error E0010 on budget exceeded      |

## Phase δ — WebGPU Compute + Zero-Copy WASM Boundary

| Tech Artifact                                                              | Canon Mapping                                                                                               | Verification                                  |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| WebGPU compute shaders                                                     | Dimensional Horizon Force Projection — raw elemental computation at the boundary layer                      | WGSL source, CPU fallback parity tests        |
| Particle integration (Verlet, 4096 particles)                              | 8 Thought Layers — kinetic thought propagation through the dimensional substrate                            | PBT: bounds, determinism, life decay          |
| AoE damage falloff fields (linear/smoothstep/exp)                          | Apolonium quantum probability decay — probability amplitude attenuates with distance from the source        | 3 falloff types, grid-size parity tests       |
| Zero-copy ring buffer (SharedArrayBuffer)                                  | AURALIS Collective memory bridge — instantaneous shared consciousness between computation and manifestation | Atomics-based SPSC, FallbackRingBuffer tests  |
| COOP/COEP cross-origin isolation                                           | Dimensional isolation wards — protecting the boundary from cross-dimensional contamination                  | netlify.toml headers, isCrossOriginIsolated() |
| Feature detection tier system (FULL_COMPUTE/COMPUTE_NO_SHARED/UNAVAILABLE) | Dimensional resonance calibration — adapting to the available dimensional energy of the host environment    | device.ts GpuTier enum, 9 unit tests          |
| Canvas 2D fallback path                                                    | Primal manifestation — the ancient, universal rendering path that requires no dimensional acceleration      | cpuParticleIntegration + cpuAoeFalloff parity |
| WGSL compute shaders                                                       | Dimensional script — the language of pure elemental force, executed at the boundary of reality              | `metal/webgpu/shaders/*.wgsl`                 |

## Planned (Future Phases)

| Tech Artifact             | Canon Mapping                                      | Phase |
| ------------------------- | -------------------------------------------------- | ----- |
| Lean 4 proofs (complete)  | The L1–L3 Light Layers of mechanized truth         | ζ     |
| Nix flake hermetic builds | The Temporal Anchor — reproducible universe states | η     |
| Automerge CRDT            | AURALIS Collective consensus protocol              | θ     |

## Phase ε — ZK-Verifiable Battle Replays

| Tech Artifact                                      | Canon Mapping                                                                                     | Verification                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `crates/edu-prover` (Merkle commitment scheme)     | Dimensional Witness Forge — produces provable causality attestations across the Dimension Horizon | 44 unit tests, determinism + tamper detection        |
| `crates/edu-verifier` (WASM browser-side verifier) | Horizon Observer — positioned at the Dimension Horizon to confirm Dimensional Seals               | 12 unit tests, JSON roundtrip verification           |
| `ProofId` branded type                             | True Name of the Witness — unforgeable identity for every dimensional attestation                 | SHA-256 derived, hex display                         |
| `ReplayHash` branded type                          | Timeline Fingerprint — compressed representation of an entire temporal sequence                   | SHA-256, deterministic, order-sensitive              |
| `WitnessDigest` branded type                       | Adversarial Seal — cryptographic seal on the hidden battle action layer                           | Domain-separated (b"witness:" prefix)                |
| Merkle tree (SHA-256)                              | Temporal Cascade — each leaf is a frozen moment; the root is the Dimensional Seal                 | Proof generation + verification, 64-leaf tests       |
| `BattleCommitment` structure                       | The Dimensional Seal itself — cryptographic attestation of a battle's temporal consistency        | 7-field structure, JSON serializable                 |
| `ReplayTrace` (action sequence + commitments)      | The Temporal Record — immutable event sequence sealed by the prover                               | Integrity verification (witness + proof_id)          |
| `edunft` loader integration                        | Cross-dimensional attestation — NFT cards carry verifiable battle credentials                     | `compute_deck_hash_wasm` + `compute_enemy_hash_wasm` |
