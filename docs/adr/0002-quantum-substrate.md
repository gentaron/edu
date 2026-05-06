# ADR-0002: Quantum Substrate — Qiskit + Post-Quantum Cryptography

## Status

Accepted

## Context

Phase β of the EDU project introduces two fundamentally new capability domains to the engine: quantum simulation for probability generation, and post-quantum cryptographic protection for save-state integrity. These additions are driven by the game's in-universe Apolonium lore, which demands a quantum probability layer to model entanglement-driven critical-hit mechanics, and by the practical need to protect serialized game state against future quantum cryptanalysis.

The core requirements are:

- **Quantum Probability Model Function (PMF)**: Generate deterministic probability distributions using an 8-qubit entanglement circuit, producing 32 unique 8-bit outcomes for critical-strike resolution. These distributions must be reproducible byte-for-byte across runs to ensure deterministic replay.
- **Post-Quantum Cryptography (PQC)**: Encrypt save-state files using NIST-standardized lattice-based primitives (Kyber-768 / ML-KEM for key encapsulation, Dilithium / ML-DSA for digital signatures on replay payloads). This addresses the harvest-now-decrypt-later threat where an adversary captures encrypted saves today and decrypts them once quantum computers become capable.
- **Embedded QASM Interpreter**: Provide a lightweight, `no_std`-compatible QASM-2 interpreter (`edu-quasi`) that can reproduce quantum circuit results on constrained targets without requiring Qiskit or a Python runtime.

The Phase α architecture established a `no_std` core (`edu-engine-core`) with Kani verification. Phase β must extend this foundation without breaking the existing guarantees: the quantum substrate must coexist with the deterministic xoshiro256++ RNG, the PQC layer must run server-side only (preserving the WASM binary budget), and the new `edu-quasi` crate must remain formally tractable.

## Decision

We adopt a three-component quantum substrate architecture:

```
quantum/                         # Python layer (offline tooling)
├── apolonium_field.py           # Qiskit 8-qubit entanglement circuit
├── generate_distributions.py    # 8192-shot sampler → JSON
└── quantum-distributions.json   # Canonical PMF (32 outcomes, deterministic)

crates/
├── edu-quasi/                   # no_std QASM-2 interpreter
│   ├── src/lib.rs               # QASM parser + state-vector simulator
│   ├── src/state.rs             # 12-qubit complex state vector (stack)
│   └── tests/                   # 74 tests (matches Qiskit within shot noise)
└── edu-pqc/                     # Post-quantum cryptography wrapper
    ├── src/lib.rs               # Kyber-768 encapsulation + Dilithium signing
    ├── src/save.rs              # Save-state encrypt/decrypt pipeline
    └── tests/                   # 15 tests (roundtrip + forgery detection)
```

### Component Decisions

1. **Qiskit Aer (free-tier, local only)** for the quantum PMF generation. We use the `aer_simulator` backend with 8192 shots per circuit. The circuit is an 8-qubit Hadamard chain with controlled-phase entanglement, producing a probability distribution over 2^8 = 256 outcomes that is then discretized into 32 unique 8-bit critical-strike values. A fixed random seed ensures byte-identical output across runs. Qiskit is never linked into the Rust runtime — it is an offline tool invoked during build-time data generation.

2. **`pqcrypto-mlkem` / `pqcrypto-mldsa`** for post-quantum cryptography. These crates wrap the reference C implementations of ML-KEM-768 (key encapsulation) and ML-DSA-65 (digital signatures) as standardized by NIST FIPS 203 and FIPS 204. We chose `pqcrypto` over `liboqs-rust` because it compiles from the reference submissions directly, avoiding the OpenQuantumSafe abstraction layer. PQC runs server-side only — the WASM client never touches cryptographic primitives, preserving the existing binary budget.

3. **`edu-quasi`** as a `no_std` QASM-2 interpreter. This crate parses a subset of OpenQASM 2.0 (supporting `qreg`, `h`, `cx`, `rx`, `ry`, `rz`, `measure`, and `barrier`) and simulates circuits using a dense complex state vector allocated on the stack. For 12 qubits the state vector requires exactly 64KB (2^12 × 8 bytes for complex64), fitting within the default stack frame. `edu-quasi` is not linked into embedded targets — it compiles for `x86_64-unknown-none` and native, providing a verification oracle that confirms the Qiskit-generated distributions are reproducible without Python.

### Key Design Constraints

- **Determinism**: The quantum PMF is seed-based. `quantum-distributions.json` is generated once with a pinned Qiskit version and Aer seed, then checked into version control. An MD5 digest is computed and asserted in CI to detect accidental mutations.
- **Verification Gap**: `pqcrypto` uses FFI to C implementations. The Kani model checker cannot verify across this boundary (Kani operates on Rust MIR only). We compensate with property-based testing: roundtrip encrypt/decrypt, forgery injection, and ciphertext malleability checks. See the [PQC Threat Model](../security/pqc-threat-model.md) for the full analysis.
- **WASM Budget**: PQC key generation (~3ms) and encapsulation (~1ms) run on the server. The client receives only the encrypted blob and the public key, neither of which exceeds 1.5KB. The WASM binary itself grows by zero bytes.

## Consequences

### Quantum PMF

- All critical-strike rolls are drawn from the Qiskit-generated Apolonium PMF stored in `quantum-distributions.json`.
- The distribution is deterministic: given the same seed and circuit, `aer_simulator` produces byte-identical JSON across machines. This is verified by the `md5-verify-quantum-dist` CI job.
- The PMF represents a 256-outcome probability space (Dimension Horizon) collapsed into 32 unique 8-bit values, providing richer critical-hit variation than the flat uniform distribution used in Phase α.
- Runtime cost is limited to a single JSON parse at engine initialization (~0.1ms for the 32-entry table).

### edu-quasi (no_std QASM Interpreter)

- 74 tests pass, covering all supported QASM-2 gates and measurement operators.
- Output matches Qiskit Aer within shot noise (chi-squared test, p > 0.01) for identical circuits and seeds.
- 12-qubit maximum is a hard limit: 13 qubits would require 128KB stack, exceeding the default RISC-V stack frame.
- The interpreter is not used in hot paths — it serves as a build-time verification tool and an educational artifact demonstrating quantum simulation in constrained Rust.

### PQC (edu-pqc)

- 15 tests cover key generation, encapsulation/decapsulation roundtrips, signature generation/verification, forgery detection, and ciphertext tampering.
- Kyber-768 public keys are 1,184 bytes; ciphertexts are 1,088 bytes. Dilithium-65 signatures are 3,309 bytes. These sizes are acceptable for server-side save-state files but would be prohibitive for per-frame WASM messages — hence the server-only deployment.
- The FFI boundary to C is the primary verification gap. Kani cannot reason about memory safety inside the C implementations. We mitigate this with: (a) property-based tests that inject adversarial inputs, (b) assertion that the `pqcrypto` crate's C code is the NIST reference implementation (unchanged), and (c) a future plan to migrate to pure-Rust implementations once available (see Planned section).
- No hardware security module (HSM) integration exists. Server-side private keys are held in process memory. This is acceptable for a game save system but would need hardening for production deployment.

### Cross-Phase Impact

- Phase α's xoshiro256++ RNG remains the primary RNG for all non-quantum rolls (movement, AI decisions, non-critical damage). The quantum PMF is only consulted for critical-strike resolution, preserving backward compatibility.
- The `no_std` boundary is maintained: `edu-quasi` compiles without `std` but is not linked to embedded targets. `edu-pqc` requires `std` (for FFI allocation) and is server-only.
- Total Rust test count rises to 161 (61 from Phase α + 74 edu-quasi + 15 edu-pqc + 11 integration), all passing.

## Lore-Tech Mapping

- `quantum/apolonium_field.py` = **Apolonium Quantum Probability Layer** — 8-qubit entanglement chain
- `quantum-distributions.json` = **The Apolonium PMF** — canonical source for critical-hit probability
- `edu-quasi` = **Apolonium Runtime Kernel** — QASM-2 interpreter without OS
- CRYSTALS-Kyber-768 = **Dimensional Key Encapsulation** — encrypts timeline state
- CRYSTALS-Dilithium = **Dimensional Witness Signature** — signs battle replay
- Dimension Horizon = **The unitary boundary of the simulated state vector** — 2^8 = 256-outcome space

## Metrics

| Metric                 | Phase α     | Phase β                            |
| ---------------------- | ----------- | ---------------------------------- |
| Rust crates            | 5           | 7 (+edu-quasi, edu-pqc)            |
| Rust tests             | 61          | 161 (+100)                         |
| no_std crates          | 2           | 3 (+edu-quasi)                     |
| Quantum PMF outcomes   | 0 (uniform) | 32 unique 8-bit values             |
| Qiskit simulation time | N/A         | ~27ms (8192 shots, 8 qubits)       |
| edu-quasi tests        | N/A         | 74                                 |
| edu-pqc tests          | N/A         | 15                                 |
| PQC cipher suite       | None        | ML-KEM-768 + ML-DSA-65             |
| Kani-verifiable crates | 2           | 2 (pqcrypto FFI boundary excluded) |

## Open Questions

- **Pure-Rust PQC**: Once `ml-kem` and `ml-dsa` pure-Rust crates stabilize (tracking the `pqc_kyber` and `pqc_dilithium` ecosystem), we should migrate `edu-pqc` to eliminate the FFI boundary and enable Kani verification of the entire cryptographic pipeline.
- **Quantum Volume Scaling**: The 8-qubit circuit is sufficient for 32 critical-strike outcomes. If future phases require more outcomes (e.g., per-element critical tables), we would need to evaluate 10–12 qubit circuits, which remain tractable on Aer but increase the JSON payload size proportionally.
- **HSM Integration**: For production deployments, server-side private keys should be stored in an HSM or at minimum a sealed Vault transit backend. This is a deployment concern, not an engine concern, and is deferred.
