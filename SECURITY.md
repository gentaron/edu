# Security Policy — EDU

## Supported versions

Only the latest commit on `main` is supported. There are no backported releases.

## Reporting a vulnerability

**Do not open a public issue.**

Report privately through
[GitHub Security Advisories](https://github.com/gentaron/edu/security/advisories/new).
You will get a first response within 72 hours.

Please include:

- Reproduction steps, or the affected module and line
- Expected impact (data exposure, RCE, supply-chain, integrity of proofs/provenance)
- Affected commit SHA, if known

## Attack surface

EDU is a monorepo with an unusually wide surface for a content site, because the
determinism and provenance layers are part of the product rather than the build:

| Surface                               | Notes                                                                                                                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js app**                       | User-facing routes, Prisma-backed API. Standard web surface — XSS, SSRF, injection                                                                                                              |
| **Rust → WASM**                       | `edu-engine-wasm` and friends run untrusted-adjacent input in the browser. Memory-safety escapes and panics that leak state are in scope                                                        |
| **BuildHash / SLSA provenance**       | `wasm-hash-lock.yml` and `slsa-provenance.yml` exist so a tampered binary is detectable. **Anything that lets a binary pass the lock without matching source is a vulnerability**, not a CI bug |
| **PQC (`edu-pqc`)**                   | ML-KEM / ML-DSA usage. Misuse (nonce reuse, unvalidated public keys, downgrade paths) is in scope                                                                                               |
| **ZK (`edu-prover`, `edu-verifier`)** | A soundness break — a proof accepted for a false statement — is the highest-severity class here                                                                                                 |
| **CRDT (`edu-crdt-bridge`)**          | Convergence failures that let one replica force divergent state on others                                                                                                                       |
| **External content sync**             | `sync-external.yml` pulls from `gentaron/edutext` and `gentaron/image`. Treat upstream content as untrusted input                                                                               |
| **Dependencies**                      | npm + 13 Rust crates. Dependabot covers both; `security.yml` runs Trivy and Semgrep weekly (report-only, non-blocking by design)                                                                |

### Notes on the scanners

`security.yml` is deliberately **non-blocking**. Upstream advisories with no available fix
must not be able to stop the app from shipping. This means a clean CI run is _not_ evidence
of a clean dependency tree — read the scan output. If you find a genuinely exploitable path
that the report-only scanners surfaced and nobody acted on, report it as a vulnerability.

## Out of scope

- Findings from `security.yml` that are informational only, with no exploitable path in
  this codebase
- Missing security headers on preview deployments
- Content accuracy in the wiki, stories, or cards — that is an editorial issue, not a
  security one
- Denial of service through the public dev server (`bun run dev` is not a production target)
