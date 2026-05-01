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

## Planned (Future Phases)

| Tech Artifact             | Canon Mapping                                      | Phase |
| ------------------------- | -------------------------------------------------- | ----- |
| Apolon DSL → WASM         | Liminal Forge compilation pipeline                 | γ     |
| WebGPU compute shaders    | The Visual Resonance Layer                         | δ     |
| RISC Zero ZK proofs       | Dimensional witness — provable causality           | ε     |
| Lean 4 proofs             | The L1–L3 Light Layers of mechanized truth         | ζ     |
| Nix flake hermetic builds | The Temporal Anchor — reproducible universe states | η     |
| Automerge CRDT            | AURALIS Collective consensus protocol              | θ     |
