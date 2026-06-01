# Lore-Tech Mapping — Phase η (Eta): Hermeticity as ZK-Proof Prerequisite

This document extends the [core lore-tech mapping](./lore-tech-mapping.md) with
Phase η's technical artifacts and their in-universe canon counterparts.

## Phase η — Hermeticity & SLSA L3

| Tech Artifact                       | Canon Mapping                                                                            | Verification                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `flake.nix`                         | The Temporal Anchor — pins the universe-state of every build to a single Nix store path  | `nix build` produces identical outputs across machines |
| `BuildHash` branded type            | The Dimensional Anchor Seal — cryptographically binds every proof to its origin universe | 10+ unit tests, domain isolation from other hash types |
| `ProofVersion` (V1/V2)              | The Epoch Boundary Marker — distinguishes pre-anchor from post-anchor proofs             | Backward compat tests, V2 rejection on mismatch        |
| SLSA L3 provenance                  | The Provenance Chain — attests the lineage of every build artifact to its source         | `slsa-framework` generator, cosign verification        |
| `cards/wasm-hashes.lock`            | The Forge Fingerprint — ensures Apolon compilation is deterministic                      | CI recompilation + SHA-256 comparison                  |
| Balance gate CI                     | The Balance Seals of the Forge — Lean 4 proofs must hold when cards change               | `lake build`, termination tests, merge block           |
| Cross-platform determinism (RISC-V) | The RISC-V Execution Shrine — restored as CI gate (not user-facing demo)                 | QEMU smoke tests, bit-identical output across 3 archs  |
| Cosign / Sigstore                   | The Dimensional Signature — keyless attestation via OIDC identity                        | `cosign verify` in CI                                  |
| SBOM (CycloneDX + SPDX)             | The Material Ledger — complete inventory of every component in the build                 | Release-attached JSON manifests                        |
| Tournament season migration         | The Seasonal Rift — build hash change triggers new competitive era                       | Season display in UI, ζ migration table                |

## Non-Surfaces (Explicitly Out of Scope)

| Non-Surface    | Reason                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| `/about/build` | Showcase surface — contradicts η's "infra, not demo" principle            |
| `/forge/metal` | Interactive demo — Phase η scope excludes user-facing build visualization |
