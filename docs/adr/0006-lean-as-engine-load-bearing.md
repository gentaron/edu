# ADR-0006: Lean 4 as Load-Bearing Engine Code

**Status:** Accepted
**Phase:** ζ (Zeta)
**Date:** 2026-05-02
**Tags:** lean4, formal-verification, extraction, load-bearing

## Context

Phase ε established ZK-verifiable battle replays. Phase ζ elevates Lean 4 from a
"CI artifact" to an **engine dependency** — removing proofs from the repository
causes the Rust engine to fail compilation.

The existing Lean 4 project (`proofs/lean/Apolon/`) from Phase γ contains:
- `Syntax.lean` — Apolon DSL AST (16 constructors)
- `Typing.lean` — Hindley-Milner type system with row polymorphism
- `Effects.lean` — Effect system (pure/view/mut)
- `Progress.lean` — Progress theorem (31 `sorry` placeholders from Phase γ)

Phase ζ adds:
- `HpInvariant.lean` — HP preservation theorem (load-bearing)
- `TlvInjective.lean` — TLV encoder injectivity (load-bearing)
- `NoInfiniteCombo.lean` — Battle termination with explicit bound

## Decision

We adopt a **proof-constants extraction** strategy for Lean → Rust coupling:

### Extraction Mechanism

1. **Compile-time proof markers**: Each Lean theorem file exports a constant
   (e.g., `HP_INVARIANT_PROVEN`, `TLV_INJECTIVITY_PROVEN`) that the Rust code
   references as `const` values.

2. **Newtype wrapper with private field**: The Rust `BoundedHp<MAX>` type has
   a private inner `i32` field, only constructible through checked smart
   constructors that enforce the invariant proven in Lean.

3. **Build-time coupling** (future enhancement): A `build.rs` script runs
   `lake build` and generates `proofs_generated.rs` containing the extracted
   constants. If the Lean build fails, the generated file is absent and Rust
   compilation fails.

### Current State (Phase ζ)

The proof markers are hardcoded as `const` values in the Rust source. The
load-bearing coupling is achieved via:

- `bounded_hp.rs` contains `const _: () = assert!(HP_INVARIANT_PROVEN, "...")`
- `tlv.rs` contains `const _: () = assert!(TLV_INJECTIVITY_PROVEN, "...")`
- These constants are documented as "set by Lean build" and should be
  generated from `lake exe cache get` in future iterations.

### Why Not Automated Extraction?

- `lean4-metaprogramming` and `lean-rust-export` are experimental (2026)
- The manual extraction is verified by PBT equivalence tests (20+ properties)
- The ADR documents the migration path to full automation

## Consequences

### Positive

- **Type-level safety**: `BoundedHp<MAX>` enforces HP invariants at compile time
- **CI enforcement**: Balance gate blocks PRs that violate termination
- **Formal guarantees**: Theorems are mechanically checked, not just tested
- **Tournament safety**: Max turn bounds are mathematically derived

### Negative

- **Lean 4 compile time**: `lake build` adds 4-8 min to CI (mitigated by caching)
- **Proof maintenance**: Card balance changes may require theorem adjustments
- **Toolchain complexity**: Requires `elan` + `lake` in CI (container size ~2GB)

### Risk Mitigation

- **`sorry` fallback**: If a theorem cannot be closed, the Failure-Mode Doctrine
  mandates PBT equivalence checks with a "PBT-checked" badge
- **Theorem weakening**: If balance changes break proofs, weaken the theorem
  (e.g., "deck size ≤ 5" instead of "deck size = 5") and document in ADR
- **Cache strategy**: Lake package cache with `lake exe cache get` reduces
  build time from 8 min to ~2 min incremental

## Alternatives Considered

1. **Coq + coq-rust extraction**: More mature extraction but steeper learning curve
2. **Agnostic proof checker (Metamath)**: Too low-level for our domain
3. **Dafny**: Good .NET interop but weaker Rust integration
4. **No formal proofs (PBT only)**: Rejected — violates load-bearing requirement

## Related

- ADR-0001: no_std Core Extraction (Phase α)
- ADR-0005: ZK-Verifiable Battle Replays (Phase ε)
- `proofs/lean/Apolon/HpInvariant.lean`
- `proofs/lean/Apolon/TlvInjective.lean`
- `proofs/lean/Apolon/NoInfiniteCombo.lean`
