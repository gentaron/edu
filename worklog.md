---

Task ID: 1
Agent: Main Agent
Task: Phase ε — ZK-Verifiable Battle Replays (Merkle commitment + WASM verifier)

Work Log:

- git pull confirmed Phase δ already committed (4ac6c73)
- Created crates/edu-prover with 4 modules: types (branded types), merkle (SHA-256 Merkle tree), replay (action sequence), commitment (builder + verifier)
- Created crates/edu-verifier with WASM bridge (4 functions) and pure verification logic
- Added sha2 dependency for cryptographic hashing
- Fixed multiple compilation issues: pub(crate) visibility, bool.to_le_bytes, usize::BITS, Merkle proof direction logic
- All 56 new tests pass (44 prover + 12 verifier), 0 warnings
- Full workspace test: 645 tests pass (no regressions)
- Created ADR-0005 with RISC Zero vs Halo2 comparison and upgrade path
- Updated docs/lore-tech-mapping.md with Phase ε entries
- Updated BENCHMARKS.md with Phase ε benchmark delta
- Updated README.md with ZK-Verified Replays badge and updated metrics
- Created .github/workflows/zk-prove-verify.yml (pending PAT workflow scope)
- Pushed to main: bcdbc4a

Stage Summary:

- 2 new Rust crates: edu-prover, edu-verifier
- 3 branded types: ProofId, ReplayHash, WitnessDigest
- SHA-256 Merkle tree with proof generation and verification
- 56 new Rust tests (217 total, was 161)
- 4 WASM bridge functions for browser-side verification
- ADR-0005 documents RISC Zero upgrade path
- CI workflow pending PAT with workflow scope
