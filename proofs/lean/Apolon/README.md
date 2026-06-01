# Apolon DSL — Lean 4 Formal Proof of the Progress Theorem

## Overview

This directory contains a Lean 4 formalization of the **Progress theorem** for the
Apolon DSL type system, as part of Phase γ of the `gentaron/edu` project.

The Progress theorem is a fundamental result in type safety: it states that
well-typed programs never get "stuck" — every well-typed expression is either
already a value or can take at least one reduction step.

> **Theorem (Progress)**: If ⊢ e : τ, then either e is a value, or ∃ e', e → e'.

## Project Structure

| File | Description |
|------|-------------|
| `lakefile.lean` | Lake build configuration |
| `lean-toolchain` | Lean 4 version (v4.14.0) |
| `Syntax.lean` | Abstract syntax: expressions, types, effects, statements, cards, modules |
| `Typing.lean` | Hindley-Milner type system with row polymorphism (`HasType` judgment) |
| `Effects.lean` | Effect system: pure/view/mut levels, effect safety, compatibility |
| `Progress.lean` | **Progress theorem** and supporting lemmas (canonical forms, determinism) |
| `README.md` | This file |

## Key Definitions

### Syntax (`Syntax.lean`)
- **`Expr`**: 16 constructors — literals, variables, application, binary/unary ops, if-then-else, lambda, let, record, field access, list literal, cons, pipe
- **`Type`**: TInt, TBool, TString, TUnit, TVar, TArrow, TRecord (row polymorphism), TList, TTuple
- **`Effect`**: `pure < view < mut` (ordered enum with LE, LT, Max, Min instances)
- **`Module`**: module path + list of top-level declarations (fn, card, type, import)

### Type System (`Typing.lean`)
- **`TyCtx`**: typing context as association list (VarName × Type)
- **`TypeScheme`**: universally quantified types for let-polymorphism
- **`HasType`**: typing judgment Γ ⊢ e : τ with 18 constructors covering all expression forms
- **`WellTypedModule`**: module well-formedness predicate
- **`Expr.subst`**: capture-avoiding substitution

### Effect System (`Effects.lean`)
- **`EffectCtx`**: maps function names to declared effect levels
- **`HasEffect`**: effect judgment Δ ⊢ e : τ [eff]
- **`EffectCompat`**: declared ≥ called (pure can't call view/mut, view can't call mut)
- **`EffectSafe`**: expression is effect-safe at a given declared level
- **`EffectWellFormed`**: module-level effect well-formedness
- **`ModuleWellFormed`**: combined type + effect well-formedness

### Progress Theorem (`Progress.lean`)
- **`Value`**: 8 constructors for fully evaluated expressions
- **`Step`**: small-step reduction relation with 22 constructors (eager, call-by-value)
- **`MultiStep`**: reflexive-transitive closure of Step
- **Canonical forms**: 5 lemmas (TInt→intLit, TBool→boolLit, TArrow→lam, TString→strLit, TUnit→unitLit)
- **`progress`**: main Progress theorem
- **`progress_multi`**: every non-value well-typed expression reaches a value
- **`step_deterministic`**: step relation is deterministic
- **`no_stuck_states`**: corollary — no stuck states in well-typed programs

## Theorems Stated

| # | Theorem | File | Proved? |
|---|---------|------|---------|
| 1 | `effect_order_total` | Effects.lean | sorry |
| 2 | `max_pure_left` | Effects.lean | ✓ (rfl) |
| 3 | `max_pure_right` | Effects.lean | ✓ (rfl) |
| 4 | `max_comm` | Effects.lean | ✓ (rfl) |
| 5 | `max_assoc` | Effects.lean | ✓ (rfl) |
| 6 | `effect_compat_refl` | Effects.lean | ✓ (decide) |
| 7 | `effect_compat_trans` | Effects.lean | sorry |
| 8 | `canonical_TInt` | Progress.lean | sorry |
| 9 | `canonical_TBool` | Progress.lean | sorry |
| 10 | `canonical_TArrow` | Progress.lean | sorry |
| 11 | `canonical_TString` | Progress.lean | sorry |
| 12 | `canonical_TUnit` | Progress.lean | sorry |
| 13 | `progress_value` | Progress.lean | ✓ (trivial) |
| 14 | `value_no_step` | Progress.lean | sorry |
| 15 | **`progress'`** (main lemma) | Progress.lean | sorry (skeleton) |
| 16 | **`progress`** (main theorem) | Progress.lean | sorry (via progress') |
| 17 | `progress_multi` | Progress.lean | sorry |
| 18 | `step_deterministic` | Progress.lean | sorry |
| 19 | `no_stuck_states` | Progress.lean | ✓ (derives from progress') |
| 20 | `progress_effect_aware` | Progress.lean | sorry |

## Sorry Count

**31 `sorry` placeholders** across all Lean files (29 in Progress.lean, 2 in Effects.lean),
representing proof obligations that would require substantial elaboration (case analysis
on inductive families, substitution lemmas, congruence properties, etc.).

## Building

```bash
cd proofs/lean/Apolon
lake build
```

Note: This is a proof skeleton — `lake build` will produce warnings for the `sorry`
placeholders but will succeed in checking the type correctness of all definitions
and theorem statements.

## References

- Types and Programming Languages (Benjamin Pierce, 2002) — Chapter 12: Progress
- Apolon Grammar: `docs/apolon/grammar.md`
- Lean 4 Documentation: https://lean-lang.org/
