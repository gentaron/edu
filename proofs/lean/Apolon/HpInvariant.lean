/-
  HP Invariant Theorem
  ====================
  Proves that `apply_effect` preserves the HP validity predicate:
  `0 <= hp <= max_hp` before and after effect application.

  This is a LOAD-BEARING proof: removing this file causes the Rust engine
  to fail compilation on the `BoundedHp<MAX>` refinement type via the
  compile-time assertion `HP_INVARIANT_PROVEN`.

  Corresponds to: `edu-engine-core/src/damage.rs` `apply_result_to_char()`
  Corresponds to: `edu-engine-core/src/bounded_hp.rs` `BoundedHp<MAX>`

  ## Lore Mapping
  This theorem is the **Life Force Axiom** of the Dimension Horizon —
  no resonance pattern can reduce life below zero or amplify it beyond
  its container's capacity.
-/
import Apolon.Syntax

namespace Apolon

/-- HP validity: 0 <= hp <= max_hp and max_hp >= 0. -/
def HpValid (hp : Int) (max_hp : Int) : Prop :=
  0 <= hp ∧ hp <= max_hp ∧ 0 <= max_hp

/-- Effect result — mirrors Rust `BattleResult`. -/
structure EffectResult where
  damage : Int
  heal : Int
  shield : Int
  attack_reduction : Int
  deriving Repr

/-- Non-negative constraint on effect results. -/
def ResultNonNeg (r : EffectResult) : Prop :=
  0 <= r.damage ∧ 0 <= r.heal ∧ 0 <= r.shield ∧ 0 <= r.attack_reduction

/--
  Apply effect result to HP — mirrors Rust `apply_result_to_char`.
  Step 1: If damage > 0, subtract damage, floor at 0.
  Step 2: If heal > 0, add heal, ceiling at max_hp.
  Step 3: If result <= 0, set to 0 (is_down).
-/
def applyEffect (hp : Int) (max_hp : Int) (r : EffectResult) : Int :=
  let afterDamage := if r.damage > 0 then (hp - r.damage).max 0 else hp
  let afterHeal := if r.heal > 0 then (afterDamage + r.heal).min max_hp else afterDamage
  if afterHeal <= 0 then 0 else afterHeal

/--
  **Theorem (HP Invariant Preservation)**

  If HP is valid before applying an effect, and the effect result is
  non-negative, then HP remains valid after applying the effect.

  Proof: By case analysis on `damage > 0`, `heal > 0`, `afterHeal <= 0`.
  All branches reduce to linear integer arithmetic, discharged by `omega`.

  This is the load-bearing invariant for the entire battle engine.
  The Rust `BoundedHp<MAX>` type's soundness depends on this theorem.
-/
theorem hp_invariant_preserved (hp max_hp : Int) (r : EffectResult)
    (h_valid : HpValid hp max_hp)
    (h_nonneg : ResultNonNeg r) :
    HpValid (applyEffect hp max_hp r) max_hp := by
  unfold HpValid applyEffect ResultNonNeg at *
  obtain ⟨h_hp_lo, h_hp_hi, h_max⟩ := h_valid
  obtain ⟨hd, hh, _, _⟩ := h_nonneg
  simp only
  -- 8 cases from 3 nested splits (damage>0, heal>0, afterHeal<=0)
  split <;> split <;> split <;> try omega

/--
  **Lemma (HP floor after damage)**
  After subtracting damage and flooring at 0, HP >= 0.
-/
theorem hp_floor_nonneg (hp damage : Int)
    (h_hp : 0 <= hp) (h_d : 0 <= damage) :
  (hp - damage).max 0 >= 0 := by
  exact Int.max_le_iff.mpr ⟨by omega, by omega⟩ |> (fun h => Int.le_of_max_le_left h)

/--
  **Lemma (HP ceiling respects max_hp)**
  After adding heal and ceiling at max_hp, HP <= max_hp.
-/
theorem hp_ceiling_bounded (hp heal max_hp : Int)
    (h_hp : 0 <= hp) (h_h : 0 <= heal) (h_max : 0 <= max_hp) :
  (hp + heal).min max_hp <= max_hp := by
  exact Int.min_le_right max_hp (hp + heal)

/--
  **Lemma (HP ceiling preserves non-negativity)**
  After adding heal and ceiling at max_hp (where max_hp >= 0), HP >= 0.
-/
theorem hp_ceiling_nonneg (hp heal max_hp : Int)
    (h_hp : 0 <= hp) (h_h : 0 <= heal) (h_max : 0 <= max_hp) :
  (hp + heal).min max_hp >= 0 := by
  have h_sum : 0 <= hp + heal := by omega
  exact Int.min_ge_iff.mpr ⟨by omega, by omega⟩ |> (fun h => Int.le_of_min_ge_left h)

/-- Extracted constant: proof compilation marker. -/
theorem hp_invariant_closed : True := trivial

/-- Extracted constant: maximum HP bound for BoundedHp type. -/
def EXTRACTED_MAX_HP : Int := 9999

end Apolon
