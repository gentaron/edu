# PQC Threat Model — Save-State Encryption

## Document Purpose

This document defines the threat model for post-quantum cryptographic protection of game save states in the EDU engine. It identifies the assets under protection, the adversary classes we defend against, the mitigations deployed in Phase β, and the known gaps that remain open.

---

## Assets Under Protection

### Primary Asset: Serialized Save State

The save state is a JSON-encoded `BattleState` containing:

- **Party composition**: 5 `FieldChar` structs with HP, ability charges, status effects, and position
- **RNG seed**: The current xoshiro256++ seed (128 bits), which determines all future random rolls
- **Battle history**: A log of all actions taken in the current battle session, used for replay verification
- **Quantum PMF selection**: The index into `quantum-distributions.json` used for critical-strike resolution

### Secondary Asset: Replay Integrity

Battle replays are signed with Dilithium (ML-DSA-65) to ensure that a replay file has not been tampered with. The signature covers the entire action sequence, preventing insertion, deletion, or mutation of turns.

### Asset Value

This is a **game save system**, not a financial or identity system. The threat model reflects this: we defend against casual cheating and long-term cryptographic obsolescence, not against nation-state adversaries with unlimited resources.

---

## Adversary Model

### Adversary Class A: Classical Attacker (Present-Day)

**Capabilities:**

- Can read encrypted save files from disk or intercept them over the network (TLS-protected transport, but files may be stored on untrusted client devices)
- Can modify save files and attempt to load them back into the engine
- Has access to commodity hardware (consumer CPUs, GPUs)
- Cannot break AES-256 or Kyber-768 with classical computation

**Goals:**

- Tamper with save state (modify HP, unlock abilities, alter RNG seed)
- Forge replay signatures to submit fabricated battle logs
- Decrypt other players' save states in a multiplayer scenario

**Assessment:** Fully mitigated. Kyber-768 provides IND-CCA2 security against classical adversaries. Dilithium-65 provides EUF-CMA signature security. Without the server-side private key, the attacker cannot encrypt a valid save state or forge a valid signature.

### Adversary Class B: Quantum Attacker (Harvest-Now-Decrypt-Later)

**Capabilities:**

- Everything in Class A, plus:
- May be recording encrypted save states today for future decryption using a cryptographically relevant quantum computer (CRQC)
- A CRQC running Shor's algorithm would break RSA-2048 and ECC-256 in polynomial time
- A CRQC running Grover's algorithm reduces symmetric key security by half (AES-256 → AES-128 equivalent)

**Goals:**

- Capture encrypted saves today, decrypt them years later when CRQC becomes available
- Forge signatures on replays after quantum cryptanalysis of the signature scheme

**Assessment:** Mitigated by PQC migration. ML-KEM-768 is believed to be secure against quantum adversaries — there are no known polynomial-time quantum algorithms for solving the Module Learning With Errors (MLWE) problem. ML-DSA-65 is similarly believed to resist quantum forgery attacks on the Module Learning With Errors over Rings (MLWER) problem.

**Time Horizon:** NIST estimates that cryptographically relevant quantum computers are at least 10–15 years away (as of 2026). Save-state encryption must remain secure through ~2040. ML-KEM and ML-DSA are designed with conservative security margins targeting this horizon.

### Adversary Class C: Privileged Insider (Server Operator)

**Capabilities:**

- Has access to server-side private keys (in process memory)
- Can modify the save-state encryption/decryption pipeline
- Can tamper with the quantum PMF distribution source

**Goals:**

- Cheat in multiplayer by generating favorable save states
- Manipulate critical-hit probabilities by replacing `quantum-distributions.json`

**Assessment:** Partially mitigated. The deterministic PMF and MD5 verification in CI protect against accidental mutations, but a server operator with write access to the deployment can replace the distribution file and re-sign it. This is an inherent limitation of any software-based integrity system — full protection requires hardware roots of trust (TPM/TEE), which are out of scope for Phase β.

---

## Mitigations

### 1. Key Encapsulation: ML-KEM-768 (Kyber-768)

**Role:** Encrypts the save-state payload. Each save operation generates a fresh Kyber encapsulation: the server holds the long-term Kyber private key, and a per-save ephemeral key pair is used for encapsulation. The shared secret derived from ML-KEM is used as a key for AES-256-GCM, which provides both confidentiality and integrity.

**Security Level:** NIST Security Level 3 — resistant to attacks requiring ~2^192 classical operations or ~2^128 quantum operations. This exceeds the security level of AES-128 (NIST Level 1) and matches AES-192 (NIST Level 3).

**Performance:** Key generation ~3ms, encapsulation ~1ms, decapsulation ~1ms on commodity x86_64 hardware. These costs are incurred server-side during save/load operations, which are infrequent (user-initiated, not per-frame).

### 2. Digital Signatures: ML-DSA-65 (Dilithium-65)

**Role:** Signs battle replay files. The server signs each replay after a battle concludes, producing a 3,309-byte signature. Clients can verify replays by checking the signature against the server's public key, which is embedded in the WASM binary.

**Security Level:** NIST Security Level 3 — resistant to existential forgeries under adaptive chosen-message attacks, both classical and quantum. The 65 parameter set provides a conservative security margin over the minimum-required ML-DSA-44 (Level 2).

**Verification:** 15 tests in `edu-pqc` cover:

- Correct signature generation and verification roundtrip
- Signature rejection on payload mutation (single-byte tamper)
- Signature rejection on truncated payloads
- Performance regression (signing < 5ms, verification < 2ms)

### 3. Deterministic PMF with Integrity Check

**Role:** Prevents manipulation of critical-hit probability distributions. `quantum-distributions.json` is generated with a pinned Qiskit/Aer version and seed, checked into version control, and verified by MD5 digest in CI.

**Limitation:** MD5 is used here as a _mutation detector_, not as a cryptographic hash. The threat is accidental corruption or CI drift, not adversarial collision. An MD5 collision would require the attacker to already have write access to the repository, at which point the game's integrity is already compromised.

---

## Known Gaps

### Gap 1: pqcrypto FFI Boundary Not Kani-Verifiable

**Description:** The `pqcrypto-mlkem` and `pqcrypto-mldsa` crates link to C reference implementations via FFI. The Kani model checker operates on Rust MIR and cannot reason about memory safety, correctness, or side-channel resistance inside the C code.

**Impact:** We cannot formally prove that the C implementations are free of undefined behavior, buffer overflows, or timing side channels. This is a verification gap, not necessarily a vulnerability — the NIST reference implementations are audited and widely deployed.

**Mitigation:**

- Property-based testing with adversarial inputs (random keys, malformed ciphertexts, oversized payloads)
- Static analysis of the C source via `cargo audit` and dependency pinning
- Future migration to pure-Rust implementations (see Gap 5)

**Risk Level:** Low (for a game save system). The C reference implementations have undergone multiple rounds of NIST analysis and third-party review.

### Gap 2: No Hardware Security Module (HSM) Integration

**Description:** Server-side private keys for ML-KEM and ML-DSA are held in process memory. There is no HSM, TPM, or enclave protecting the keys at rest or during cryptographic operations.

**Impact:** A server compromise (remote code execution or memory dump) would expose the private keys, allowing the attacker to decrypt any save state and forge any replay signature.

**Mitigation:**

- Private keys are not persisted to disk — they are generated at server startup and held only in memory
- Server process runs with minimal privileges and is containerized
- Key rotation is manual but straightforward (restart with a new key; existing saves become unreadable, which is acceptable during development)

**Risk Level:** Medium for production, Low for development. In a multiplayer production scenario, key exposure would be critical. For the current single-player educational context, the impact is limited to local cheating.

### Gap 3: No Forward Secrecy for Save States

**Description:** ML-KEM does not provide forward secrecy. If the server's private key is compromised at time T, all save states encrypted with that key (including those created before T) can be decrypted.

**Impact:** Unlike Diffie-Hellman-based key exchange, KEM-based encryption does not offer forward secrecy by default. A key rotation event renders old saves unreadable (which is our current behavior) but does not protect past saves if the old key was exfiltrated before rotation.

**Mitigation:** Per-save ephemeral key encapsulation provides limited forward secrecy — compromising the long-term server key does not reveal the per-save shared secret if the ephemeral ciphertext is also discarded. However, the ephemeral private key is ephemeral in memory only; if a memory dump occurs during save generation, the ephemeral secret could be recovered.

**Risk Level:** Low. Forward secrecy is not a meaningful guarantee for a game save system where saves are loaded immediately after creation and the user holds both the encrypted blob and the context.

### Gap 4: No Quantum Random Number Generation (QRNG)

**Description:** The quantum PMF is generated by a classical simulator (Qiskit Aer) seeded with a classical PRNG. A true quantum random number generator (QRNG) would provide physical entropy from quantum measurement outcomes, but Aer uses pseudorandom sampling internally.

**Impact:** The "quantum-ness" of the PMF is simulated, not physical. The probability distributions are mathematically correct (matching the unitary evolution of the circuit), but the shot noise is deterministic given the seed.

**Mitigation:** This is by design. Determinism is a project requirement — the PMF must be reproducible across runs. A physical QRNG would violate this requirement unless the measurement outcomes were also recorded and replayed, which would produce a functionally identical system.

**Risk Level:** None. This is a design choice, not a vulnerability.

### Gap 5: No Pure-Rust PQC Implementation

**Description:** The Rust ecosystem lacks stable, audited, pure-Rust implementations of ML-KEM and ML-DSA. The `pqcrypto` crate family uses FFI to C, and the emerging `ml-kem` and `ml-dsa` crates are still in early development.

**Impact:** As long as FFI is required, we cannot apply Kani verification to the cryptographic pipeline end-to-end. Additionally, cross-compilation for exotic targets (e.g., `wasm32-unknown-unknown` without WASI) may be complicated by C build dependencies.

**Mitigation:** Monitor the `ml-kem` and `ml-dsa` pure-Rust crate ecosystem. Once they reach stability and pass the NIST Known Answer Test (KAT) vectors, migrate `edu-pqc` to use them. This would close Gap 1 entirely.

**Risk Level:** Low (short-term), Medium (long-term if pure-Rust implementations never stabilize).

---

## Assumptions

1. **NIST PQC standards are correct (as of 2026):** This threat model assumes that ML-KEM-768 and ML-DSA-65 provide their claimed security levels against both classical and quantum adversaries. NIST's analysis and the third-party cryptanalysis community have not found polynomial-time quantum attacks on these schemes as of the writing of this document. If a breakthrough attack is discovered, this threat model must be revised.

2. **The reference C implementations are bug-free in their core logic:** We assume the NIST-submitted reference implementations of ML-KEM and ML-DSA do not contain critical bugs in their mathematical core (key generation, encapsulation, signing, verification). Side-channel concerns in the reference code are mitigated by the server-only deployment model.

3. **TLS provides adequate transport security:** Save states are transmitted over HTTPS/TLS. We assume TLS 1.3 (or TLS 1.2 with AEAD ciphersuites) provides confidentiality and integrity on the wire. PQC encryption is applied on top of TLS as defense-in-depth, not as a replacement.

4. **The adversary cannot obtain the server's private key through side channels:** We assume the server's process memory is not accessible to the attacker. Container isolation, minimal privileges, and no disk persistence of keys are our current defenses. A determined attacker with kernel-level access (or a hypervisor escape) could extract keys from memory.

5. **Save states do not contain sensitive personal information:** The save state contains game data (character stats, RNG seeds, battle logs) but no personally identifiable information, financial data, or credentials. This limits the impact of a successful decryption attack.

---

## Version History

| Version | Date | Author   | Changes                          |
| ------- | ---- | -------- | -------------------------------- |
| 1.0     | 2026 | EDU Team | Initial threat model for Phase β |
