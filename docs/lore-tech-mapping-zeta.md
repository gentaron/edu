# Lore-Tech Mapping — Phase ζ (Zeta)

## Lean 4 = The Truth Layer

In the EDU cosmology, Lean 4 formal proofs represent the **absolute truth layer** —
mathematical guarantees that transcend dimensional boundaries. Where Kani (Phase α)
provides the **defense layer** (bounded model checking for concrete values), Lean 4
provides the **truth layer** (universal quantification over all possible inputs).

### L1–L3 Light Layers

| Layer | Tech | Lore | Phase |
|-------|------|------|-------|
| L1 (Data) | `BoundedHp<MAX>` type, TLV format | **Life Force Axiom** — the invariant that no resonance can reduce life below zero or amplify it beyond its container | ζ |
| L2 (Logic) | Lean 4 `omega` tactic, `hp_invariant_preserved` | **Causal Consistency Law** — every effect application preserves the fundamental life constraint | ζ |
| L3 (Proof) | Lean 4 kernel, `lake build`, axiom audit | **Dimensional Witness Authority** — the Lean 4 kernel is the ultimate arbiter of truth, its kernel is trusted but minimized | ζ |

### D1–D5 Dark Layers

| Layer | Tech | Lore | Phase |
|-------|------|------|-------|
| D1 (Kani) | Kani model checker, bounded verification | **Boundary Sentinel** — guards against specific concrete violations within bounded search spaces | α |
| D2 (Creusot) | Creusot/Prusti contracts, `#[requires]`/`#[ensures]` | **Contract Weaver** — weaves proof obligations into Rust code as specification comments | α |
| D3 (PBT) | Fast-check / proptest, 20+ properties | **Chaos Probe** — generates adversarial inputs from the void to stress-test invariants | ζ |
| D4 (ZK) | RISC Zero zkVM, Merkle commitments | **Dimensional Witness** — provable causality across the Dimension Horizon | ε |
| D5 (Lean) | Lean 4 formal proofs, `sorry`-free theorems | **Truth Anchor** — the point where mathematics itself becomes load-bearing code | ζ |

### Integration Surface Mapping

| Surface | Lean Dependency | Lore |
|---------|----------------|------|
| Battle engine (`/play/battle/*`) | `BoundedHp<MAX>` from `hp_invariant_preserved` | Life Force Axiom guards every HP calculation |
| Apolon typechecker (all cards) | `Progress.lean` progress theorem | The type system enforces the **No Stuck State** law |
| Balance gate (CI) | `NoInfiniteCombo.lean` termination theorem | The **Temporal Horizon Guarantee** ensures every battle converges |
| Save migration | `TlvInjective.lean` injectivity | **Timeline Fingerprint Uniqueness** — no two saves share the same causal signature |
| Tournament settings | `computeMaxTurns` extracted bound | **Mathematical Certainty** — max turns are derived from proof, not heuristic |
| UGC editor (`/forge/editor`) | Same typechecker as canonical cards | The Forge applies the **Truth Layer** uniformly — no second-class citizens |

### Theorem Canon Names

| Theorem | Canon Name | Description |
|---------|-----------|-------------|
| `hp_invariant_preserved` | Life Force Axiom | HP stays in [0, max_hp] after any effect |
| `no_stuck_states` | Progress Guarantee | Well-typed programs never get stuck |
| `encodeEntry_injective` | Timeline Fingerprint Uniqueness | Distinct states encode to distinct bytes |
| `no_infinite_combo` | Temporal Horizon Guarantee | All battles terminate within MAX_TURNS |
| `computeMaxTurns_bounded` | Horizon Bound | The extracted bound never exceeds 200 |

### Extraction Strategy — "Proof as Constitution"

The Lean 4 theorems serve as a **constitution** for the engine:
- The Rust code is the **law** — it implements what the constitution requires
- The PBT tests are the **courts** — they verify compliance in practice
- The CI workflows are the **enforcement** — they prevent unconstitutional changes

Removing the constitution (Lean proofs) doesn't immediately crash the system,
but it removes the **mathematical guarantee** that the laws are correct.
The `HP_INVARIANT_PROVEN` and `TLV_INJECTIVITY_PROVEN` compile-time assertions
make this coupling explicit: the engine admits it depends on the proof.
