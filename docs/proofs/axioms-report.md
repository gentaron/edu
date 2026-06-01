# Lean 4 Axiom Audit Report

Generated: 2026-05-02 (initial)

## Proof Modules

### HpInvariant.lean
- **Status**: Proof skeleton with `omega`-discharged branches
- **sorry count**: 0 (main theorem uses `omega`)
- **Axioms**: `Classical.choice` not used; proof is constructive
- **Key theorem**: `hp_invariant_preserved` — HP validity preserved by `applyEffect`

### TlvInjective.lean
- **Status**: Partial proofs with sorry in injectivity and segment roundtrip
- **sorry count**: 2 (encodeEntry_injective, encode_decode_segment_roundtrip)
- **Axioms**: None beyond Lean 4 core
- **Fallback**: PBT roundtrip tests in Rust cover the injectivity property

### NoInfiniteCombo.lean
- **Status**: Structural theorem with trivial proofs (bounded by MAX_TURNS)
- **sorry count**: 0
- **Axioms**: None
- **Key theorem**: `computeMaxTurns_bounded` — extracted function always <= 200

### Progress.lean (Phase γ)
- **Status**: Proof skeleton with 31 `sorry` placeholders
- **sorry count**: 31
- **Axioms**: None beyond Lean 4 core
- **Fallback**: PBT equivalence tests in Rust (20+ properties)

### Effects.lean (Phase γ)
- **Status**: 2 `sorry` placeholders (effect_order_total, effect_compat_trans)
- **sorry count**: 2
- **Axioms**: None beyond Lean 4 core

## Summary

| Module | sorry | Lean-proven | PBT fallback |
|--------|-------|-------------|-------------|
| HpInvariant | 0 | Yes | N/A |
| TlvInjective | 2 | Partial | Yes |
| NoInfiniteCombo | 0 | Yes | N/A |
| Progress | 31 | No | Yes |
| Effects | 2 | Partial | Yes |

**Total sorry count**: 35
**Goal**: Reduce to 0 (track in CI)

## Remediation Plan

1. **TlvInjective.lean**: Close encodeEntry_injective and encode_decode_segment_roundtrip
2. **Progress.lean**: Incrementally close sorrys — prioritize progress', value_no_step, canonical_TInt
3. **Effects.lean**: Close effect_order_total and effect_compat_trans (trivial decidable cases)
