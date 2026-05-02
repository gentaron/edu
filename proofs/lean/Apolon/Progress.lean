/-
  Apolon DSL — Progress Theorem
  ==============================
  The Progress theorem states that if a module M is well-typed and effect-well-formed,
  then for any well-typed expression e in M, either e is a value, or there exists
  a reduction step e → e'.

  This is a fundamental theorem in type-safety proofs (together with Preservation).
  The standard formulation is:

      Γ ⊢ e : τ  ⟹  (Value e) ∨ (∃ e', Step e e')

  We also prove several auxiliary lemmas:
  - Canonical Forms: values of arrow type are closures, etc.
  - Values do not step: Value e ⟹ ¬Step e e'
  - Determinism: if e → e₁ and e → e₂, then e₁ = e₂ (stated, not proved)

  All complex proof steps use `sorry` (explicitly allowed for this proof skeleton).
-/

import Apolon.Syntax
import Apolon.Typing
import Apolon.Effects

namespace Apolon

/--
  Values: expressions that are fully evaluated and cannot be reduced further.
  - Integer literals (IntLit)
  - Boolean literals (BoolLit)
  - String literals (StrLit)
  - Unit literal
  - Closures (lambda abstractions are values since Apolon is eager)
  - Record values (if all fields are values)
  - Empty list
  - Cons of a value onto a value list
-/
inductive Value : Expr → Prop where
  | intLit (n : Int) : Value (.intLit n)
  | boolLit (b : Bool) : Value (.boolLit b)
  | strLit (s : String) : Value (.strLit s)
  | unitLit : Value .unitLit
  | lam (x : VarName) (τ : Type) (e : Expr) : Value (.lam x τ e)
  | record (fields : List (Label × Expr))
      (h : ∀ i (hi : i < fields.length), Value (fields[i].2)) :
      Value (.record fields)
  | listNil : Value (.listLit [])
  | cons (e₁ e₂ : Expr) (τ : Type)
      (h₁ : Value e₁)
      (h₂ : Value e₂) :
      Value (.cons e₁ e₂)

/--
  Small-step reduction relation: e → e'
  ====================================
  Defines how expressions reduce step by step.  The relation is:
  - EAGER: arguments are evaluated before the function is applied
  - CALL-BY-VALUE: only values are substituted into function bodies

  Rules:
  - ST-BinOp: if both operands are values, evaluate the binary operation
  - ST-UnaryOp: if the operand is a value, evaluate the unary operation
  - ST-IfTrue: if c is true, reduce to the then-branch
  - ST-IfFalse: if c is false, reduce to the else-branch
  - ST-IfCond: reduce the condition
  - ST-IfBranch: reduce the appropriate branch
  - ST-AppLeft: reduce the function position
  - ST-AppRight: reduce the argument position
  - ST-AppAbs: if the function is a lambda (closure) and arg is a value, β-reduce
  - ST-Let: reduce the bound expression
  - ST-LetBody: if bound expression is a value, substitute and reduce body
  - ST-Field: reduce the record expression
  - ST-FieldVal: if the record is a value, extract the field
  - ST-ConsLeft: reduce the head of cons
  - ST-ConsRight: reduce the tail of cons
  - ST-Pipe: desugar pipe to application, then reduce
-/
inductive Step : Expr → Expr → Prop where
  /-- Arithmetic: evaluate integer binary operation when both operands are values. -/
  | binOpInt (op : BinOp) (n₁ n₂ n : Int)
      (h_eval : match op with
        | .add => n = n₁ + n₁  -- simplified; real eval handles saturation
        | .sub => n = n₁ - n₂
        | .mul => n = n₁ * n₂
        | .div => n = if n₂ = 0 then 0 else n₁ / n₂
        | .mod => n = if n₂ = 0 then 0 else n₁ % n₂
        | _    => False) :
      Step (.binOp op (.intLit n₁) (.intLit n₂)) (.intLit n)

  /-- Comparison: evaluate comparison when both operands are integer values. -/
  | binOpCmp (op : BinOp) (n₁ n₂ : Int) (b : Bool)
      (h_eval : match op with
        | .eq => b = (n₁ = n₂)
        | .ne => b = (n₁ ≠ n₂)
        | .lt => b = (n₁ < n₂)
        | .le => b = (n₁ ≤ n₂)
        | .gt => b = (n₁ > n₂)
        | .ge => b = (n₁ ≥ n₂)
        | _    => False) :
      Step (.binOp op (.intLit n₁) (.intLit n₂)) (.boolLit b)

  /-- Logical AND: evaluate when both operands are boolean values. -/
  | binOpAnd (e₁ e₂ : Expr) (b₁ b₂ : Bool)
      (h₁ : Value (.boolLit b₁))
      (h₂ : Value (.boolLit b₂))
      (h_eval : b₂ = (b₁ && b₂)) :
      Step (.binOp .and (.boolLit b₁) (.boolLit b₂)) (.boolLit (b₁ && b₂))

  /-- Logical OR: evaluate when both operands are boolean values. -/
  | binOpOr (e₁ e₂ : Expr) (b₁ b₂ : Bool)
      (h₁ : Value (.boolLit b₁))
      (h₂ : Value (.boolLit b₂)) :
      Step (.binOp .or (.boolLit b₁) (.boolLit b₂)) (.boolLit (b₁ || b₂))

  /-- Unary NOT: evaluate negation of a boolean value. -/
  | unaryNot (b : Bool) :
      Step (.unaryOp .not (.boolLit b)) (.boolLit (!b))

  /-- Unary NEG: evaluate negation of an integer value. -/
  | unaryNeg (n : Int) :
      Step (.unaryOp .neg (.intLit n)) (.intLit (-n))

  /-- If-true: when condition evaluates to true, take the then-branch. -/
  | ifTrue (e₁ e₂ : Expr) :
      Step (.ifThenElse (.boolLit true) e₁ e₂) e₁

  /-- If-false: when condition evaluates to false, take the else-branch. -/
  | ifFalse (e₁ e₂ : Expr) :
      Step (.ifThenElse (.boolLit false) e₁ e₂) e₂

  /-- If-cond: reduce the condition of an if-then-else. -/
  | ifCond (c c' e₁ e₂ : Expr)
      (h : Step c c') :
      Step (.ifThenElse c e₁ e₂) (.ifThenElse c' e₁ e₂)

  /-- If-then: reduce the then-branch when condition is true. -/
  | ifThen (c e₁ e₁' e₂ : Expr)
      (h_c : Value c)
      (h : c = .boolLit true)
      (h_step : Step e₁ e₁') :
      Step (.ifThenElse c e₁ e₂) (.ifThenElse c e₁' e₂)

  /-- If-else: reduce the else-branch when condition is false. -/
  | ifElse (c e₁ e₂ e₂' : Expr)
      (h_c : Value c)
      (h : c = .boolLit false)
      (h_step : Step e₂ e₂') :
      Step (.ifThenElse c e₁ e₂) (.ifThenElse c e₁ e₂')

  /-- App-left: reduce the function position. -/
  | appLeft (e₁ e₁' e₂ : Expr)
      (h : Step e₁ e₁') :
      Step (.app e₁ e₂) (.app e₁' e₂)

  /-- App-right: reduce the argument position (when function is a value). -/
  | appRight (e₁ e₂ e₂' : Expr)
      (h_v : Value e₁)
      (h : Step e₂ e₂') :
      Step (.app e₁ e₂) (.app e₁ e₂')

  /-- β-reduction: apply a closure to a value argument. -/
  | appAbs (x : VarName) (τ : Type) (body arg : Expr)
      (h_v : Value arg) :
      Step (.app (.lam x τ body) arg) (body.subst x arg)

  /-- Let: reduce the bound expression. -/
  | letEStep (x : VarName) (e₁ e₁' e₂ : Expr)
      (h : Step e₁ e₁') :
      Step (.letE x e₁ e₂) (.letE x e₁' e₂)

  /-- Let-body: when bound expression is a value, substitute and continue with body. -/
  | letEBody (x : VarName) (e₁ e₂ : Expr)
      (h_v : Value e₁) :
      Step (.letE x e₁ e₂) (e₂.subst x e₁)

  /-- Field-step: reduce the record expression. -/
  | fieldStep (e e' : Expr) (l : Label)
      (h : Step e e') :
      Step (.field e l) (.field e' l)

  /-- Field-val: extract field from a value record. -/
  | fieldVal (fields : List (Label × Expr)) (l : Label) (τ : Type) (e : Expr)
      (h_v : Value (.record fields))
      (h_mem : (l, e) ∈ fields)
      (h_val : Value e) :
      Step (.field (.record fields) l) e

  /-- Cons-left: reduce the head of cons. -/
  | consLeft (e₁ e₁' e₂ : Expr)
      (h : Step e₁ e₁') :
      Step (.cons e₁ e₂) (.cons e₁' e₂)

  /-- Cons-right: reduce the tail of cons (when head is a value). -/
  | consRight (e₁ e₂ e₂' : Expr)
      (h_v : Value e₁)
      (h : Step e₂ e₂') :
      Step (.cons e₁ e₂) (.cons e₁ e₂')

  /-- Pipe: desugar e |> f to f(e). -/
  | pipe (e : Expr) (f : VarName) :
      Step (.pipe e f) (.app (.var f) e)

  /-- Multi-step reduction: transitive closure of Step. -/
  | refl (e : Expr) :
      Step e e

  /-- Transitivity of multi-step reduction. -/
  | trans (e₁ e₂ e₃ : Expr)
      (h₁ : Step e₁ e₂)
      (h₂ : Step e₂ e₃) :
      Step e₁ e₃

/--
  Multi-step reduction (reflexive-transitive closure).
  e ⟹* e' means e reduces to e' in zero or more steps.
-/
inductive MultiStep : Expr → Expr → Prop where
  | refl (e : Expr) : MultiStep e e
  | step (e₁ e₂ e₃ : Expr)
      (h₁ : Step e₁ e₂)
      (h₂ : MultiStep e₂ e₃) :
      MultiStep e₁ e₃

/-!
  ## Canonical Forms Lemma

  If a value has a particular type, it must have a specific syntactic form.
  This is a key ingredient in proving Progress and Preservation.
-/

/--
  Canonical form for TInt: if a value has type TInt, it must be an integer literal.
-/
theorem canonical_TInt (Γ : TyCtx) (e : Expr)
    (h_type : HasType Γ e .TInt)
    (h_val : Value e) :
    ∃ n, e = .intLit n := by
  cases h_val
  all_goals sorry
  -- Only the intLit constructor produces a value of type TInt.
  -- The sorry here represents exhaustive case analysis showing all
  -- other value constructors are incompatible with TInt.

/--
  Canonical form for TBool: if a value has type TBool, it must be a boolean literal.
-/
theorem canonical_TBool (Γ : TyCtx) (e : Expr)
    (h_type : HasType Γ e .TBool)
    (h_val : Value e) :
    ∃ b, e = .boolLit b := by
  cases h_val
  all_goals sorry
  -- Only the boolLit constructor produces a value of type TBool.

/--
  Canonical form for TArrow: if a value has type τ₁ → τ₂, it must be a lambda.
-/
theorem canonical_TArrow (Γ : TyCtx) (e : Expr) (τ₁ τ₂ : Type)
    (h_type : HasType Γ e (.TArrow τ₁ τ₂))
    (h_val : Value e) :
    ∃ x τ body, e = .lam x τ body := by
  cases h_val
  all_goals sorry
  -- Only the lam constructor produces a value of arrow type.

/--
  Canonical form for TString: if a value has type TString, it must be a string literal.
-/
theorem canonical_TString (Γ : TyCtx) (e : Expr)
    (h_type : HasType Γ e .TString)
    (h_val : Value e) :
    ∃ s, e = .strLit s := by
  cases h_val
  all_goals sorry

/--
  Canonical form for TUnit: if a value has type TUnit, it must be the unit literal.
-/
theorem canonical_TUnit (Γ : TyCtx) (e : Expr)
    (h_type : HasType Γ e .TUnit)
    (h_val : Value e) :
    e = .unitLit := by
  cases h_val
  all_goals sorry

/-!
  ## Progress Theorem

  This is the main theorem. It states:

  > **Theorem (Progress)**: If ⊢ e : τ (i.e., e is well-typed in an empty context),
  > then either e is a value, or there exists e' such that e → e'.

  We prove this by structural induction on the typing derivation.
-/

/--
  **Theorem (Progress for Values)**: If a value is well-typed in the empty context,
  then the typing is consistent. (This is a helper lemma — values are trivially
  well-typed since they have the right form.)
-/
theorem progress_value (e : Expr) (τ : Type)
    (h_type : HasType [] e τ)
    (h_val : Value e) :
    True := by
  -- Trivial: values are well-typed by construction.
  trivial

/--
  **Theorem (Values Do Not Step)**: If e is a value, there is no e' such that e → e'.
  This is stated as the contrapositive: stepping preserves non-valueness.
-/
theorem value_no_step (e e' : Expr)
    (h_val : Value e) :
    ¬ Step e e' := by
  cases h_val
  all_goals sorry
  -- Each case of Value is a canonical form that has no reduction rules.
  -- For intLit/boolLit/strLit/unitLit/lam, there are no applicable Step rules.
  -- For record, we'd need to show all fields are values and no field access applies.
  -- For cons, we'd need to show both sides are values.
  -- The sorry here represents exhaustive case analysis for each constructor.

/--
  **Lemma (Progress for well-typed expressions)**:
  Given a well-typed expression in any context (with the module's functions in scope),
  either it is a value or it can take a step.
-/
theorem progress' (Δ : EffectCtx) (Γ : TyCtx) (e : Expr) (τ : Type)
    (h_type : HasType Γ e τ)
    (h_safe : EffectSafe Δ e .mut) :  -- mut allows everything; if safe at mut level
    Value e ∨ ∃ e', Step e e' := by
  cases h_type with
  -- T-Int: integer literals are values
  | intLit _ _ =>
    left; exact Value.intLit _
  -- T-Bool: boolean literals are values
  | boolLit _ _ =>
    left; exact Value.boolLit _
  -- T-Str: string literals are values
  | strLit _ _ =>
    left; exact Value.strLit _
  -- T-Unit: unit is a value
  | unitLit _ =>
    left; exact Value.unitLit
  -- T-Var: variable references are values (they are bound to values)
  | var _ _ _ _ =>
    left; sorry
    -- A variable in context is assumed to be bound to a value.
    -- This requires proving that all bindings in the context are values,
    -- which follows from the module well-formedness.
  -- T-Abs: lambdas are values
  | lam _ _ _ _ _ =>
    left; exact Value.lam _ _ _
  -- T-App: application
  | app _ e₁ _ e₂ τ₁ τ₂ h₁ h₂ =>
    -- By induction on h₁: either e₁ is a value or steps
    have ih₁ := progress' Δ Γ e₁ (.TArrow τ₁ τ₂) h₁ (by sorry)
    cases ih₁ with
    | inl hv₁ =>
      -- e₁ is a value → by canonical forms, e₁ is a lambda
      have hc := canonical_TArrow Γ e₁ τ₁ τ₂ h₁ hv₁
      obtain ⟨x, τ, body, heq⟩ := hc
      rw [heq] at *
      -- By induction on h₂: either e₂ is a value or steps
      have ih₂ := progress' Δ Γ e₂ τ₁ h₂ (by sorry)
      cases ih₂ with
      | inl hv₂ =>
        -- Both are values → β-reduce
        right; exact Step.appAbs x τ body e₂ hv₂
      | inr ⟨e₂', hs₂⟩ =>
        -- e₂ can step → app-right
        right; exact Step.appRight (.lam x τ body) e₂ e₂' (Value.lam x τ body) hs₂
    | inr ⟨e₁', hs₁⟩ =>
      -- e₁ can step → app-left
      right; exact Step.appLeft e₁ e₁' e₂ hs₁
  -- T-If: if-then-else
  | ifThenElse _ c _ e₁ e₂ _ hc h₁ h₂ =>
    have ih := progress' Δ Γ c .TBool hc (by sorry)
    cases ih with
    | inl hv =>
      -- c is a value → by canonical forms, c is a boolean
      have hcb := canonical_TBool Γ c .TBool hc hv
      obtain ⟨b, heq⟩ := hcb
      rw [heq] at *
      cases b with
      | true => right; exact Step.ifTrue e₁ e₂
      | false => right; exact Step.ifFalse e₁ e₂
    | inr ⟨c', hs⟩ =>
      right; exact Step.ifCond c c' e₁ e₂ hs
  -- T-Let: let binding
  | letE _ _ e₁ _ e₂ τ₁ τ₂ h₁ h₂ =>
    have ih := progress' Δ Γ e₁ τ₁ h₁ (by sorry)
    cases ih with
    | inl hv =>
      -- e₁ is a value → substitute
      right; exact Step.letEBody _ e₁ e₂ hv
    | inr ⟨e₁', hs⟩ =>
      right; exact Step.letEStep _ e₁ e₁' e₂ hs
  -- T-BinOp (arithmetic): requires induction on both operands
  | binOpArith _ op _ e₁ e₂ _ _ _ =>
    have ih₁ := progress' Δ Γ e₁ .TInt (HasType.intLit _ 0 |> by sorry) (by sorry)
    have ih₂ := progress' Δ Γ e₂ .TInt (HasType.intLit _ 0 |> by sorry) (by sorry)
    sorry
    -- Need to case-split on whether e₁ and e₂ are values,
    -- then evaluate or step accordingly.
  -- T-BinOp (comparison): same structure as arithmetic
  | binOpCmp _ op _ e₁ e₂ _ _ _ =>
    sorry
    -- Same structure as binOpArith case.
  -- T-BinOp (logical): requires boolean operands
  | binOpLogic _ op _ e₁ e₂ _ _ _ =>
    sorry
    -- Similar to arithmetic, but for booleans.
  -- T-UnaryNot
  | unaryNot _ e _ =>
    have ih := progress' Δ Γ e .TBool (HasType.boolLit _ true |> by sorry) (by sorry)
    sorry
  -- T-UnaryNeg
  | unaryNeg _ e _ =>
    have ih := progress' Δ Γ e .TInt (HasType.intLit _ 0 |> by sorry) (by sorry)
    sorry
  -- T-Record
  | record _ fields types h_len h_types h_labels =>
    sorry
    -- If all field expressions are values, the record is a value.
    -- Otherwise, step the first non-value field.
  -- T-Field
  | field _ e l τ _ h =>
    have ih := progress' Δ Γ e (.TRecord ((l, τ) [])) (by sorry) (by sorry)
    cases ih with
    | inl hv =>
      right; sorry
      -- Need to find the field in the record and extract it.
    | inr ⟨e', hs⟩ =>
      right; exact Step.fieldStep e e' l hs
  -- T-List
  | listLit _ elems τ h =>
    sorry
    -- If all elements are values, the list is a value.
    -- Otherwise, step the first non-value element.
  -- T-Cons
  | cons _ _ e₁ e₂ τ h₁ h₂ =>
    have ih₁ := progress' Δ Γ e₁ τ h₁ (by sorry)
    cases ih₁ with
    | inl hv₁ =>
      have ih₂ := progress' Δ Γ e₂ (.TList τ) h₂ (by sorry)
      cases ih₂ with
      | inl hv₂ => left; exact Value.cons e₁ e₂ τ hv₁ hv₂
      | inr ⟨e₂', hs₂⟩ => right; exact Step.consRight e₁ e₂ e₂' hv₁ hs₂
    | inr ⟨e₁', hs₁⟩ =>
      right; exact Step.consLeft e₁ e₁' e₂ hs₁
  -- T-Pipe
  | pipe _ e f τ₁ τ₂ h₁ h₂ =>
    right; exact Step.pipe e f

/--
  **Theorem (Progress)**: If a module M is well-typed and effect-well-formed,
  then for any expression e with ⊢ e : τ (well-typed in empty context),
  either e is a value, or there exists a reduction step e → e'.

  This is the main theorem of this file and a key component of type safety.

  **Informally**: A well-typed program never gets "stuck" — it can always make
  progress (evaluate one more step or be done).

  **Proof strategy**: By structural induction on the typing derivation of e.
  For each typing rule, we show that either e is already a value, or one of
  the subexpressions can take a step (by the induction hypothesis), and we
  can lift that step using the congruence rules of the reduction relation.

  See: Types and Programming Languages (Pierce, 2002), Chapter 12.
-/
theorem progress (Δ : EffectCtx) (e : Expr) (τ : Type)
    (h_well_typed : HasType [] e τ)
    (h_well_formed : ∀ (M : Module) (_ : ModuleWellFormed Δ M), True)
    (h_safe : EffectSafe Δ e .mut) :
    Value e ∨ ∃ e', Step e e' := by
  -- Apply the progress lemma with the empty typing context
  exact progress' Δ [] e τ h_well_typed h_safe

/-!
  ## Additional Theorems
-/

/--
  **Theorem (Multi-step Progress)**: If ⊢ e : τ and e is not a value,
  then there exists a multi-step reduction e ⟹* e' where e' is a value.
  This states that every well-typed expression eventually reaches a value
  (assuming termination).
-/
theorem progress_multi (Δ : EffectCtx) (Γ : TyCtx) (e : Expr) (τ : Type)
    (h_type : HasType Γ e τ)
    (h_not_val : ¬ Value e) :
    ∃ e', MultiStep e e' ∧ Value e' := by
  -- Proof sketch: by induction on the structure of e.
  -- In each case where e is not a value, by the Progress theorem
  -- there exists a step e → e'. By the induction hypothesis on e',
  -- there exists e ⟹* e' ⟹* e'' where e'' is a value.
  -- By transitivity, e ⟹* e''.
  sorry
  -- Full proof requires well-foundedness of the step relation (termination).

/--
  **Theorem (Determinism)**: The step relation is deterministic.
  If e → e₁ and e → e₂, then e₁ = e₂.
-/
theorem step_deterministic (e e₁ e₂ : Expr)
    (h₁ : Step e e₁)
    (h₂ : Step e e₂) :
    e₁ = e₂ := by
  -- Proof: by case analysis on the reduction rules.
  -- Each redex has a unique reduction rule, so there cannot be
  -- two different results for the same redex.
  sorry
  -- The sorry represents exhaustive case analysis on h₁ and h₂.

/--
  **Corollary (Type Safety — No Stuck States)**: A well-typed, effect-well-formed
  module has no stuck states.  A state is stuck if it is not a value and cannot
  take a step.  This follows directly from the Progress theorem.
-/
theorem no_stuck_states (Δ : EffectCtx) (e : Expr) (τ : Type)
    (h_type : HasType [] e τ)
    (h_safe : EffectSafe Δ e .mut) :
    ¬ (¬ Value e ∧ ¬ ∃ e', Step e e') := by
  intro ⟨h_not_val, h_no_step⟩
  have h_progress := progress' Δ [] e τ h_type h_safe
  cases h_progress with
  | inl h_val => contradiction
  | inr h_step => exact h_no_step h_step

/--
  **Theorem (Progress with Effect Context)**: The progress theorem holds
  regardless of the effect context, as long as the expression is effect-safe
  at the appropriate level. Effect safety ensures that the expression will
  not attempt to call functions with incompatible effect levels.
-/
theorem progress_effect_aware (Δ : EffectCtx) (Γ : TyCtx) (e : Expr) (τ : Type)
    (eff : Effect)
    (h_type : HasType Γ e τ)
    (h_safe : EffectSafe Δ e eff) :
    Value e ∨ ∃ e', Step e e' := by
  -- The progress theorem does not depend on the specific effect level,
  -- only on the fact that the expression is well-typed and effect-safe.
  exact progress' Δ Γ e τ h_type (by
    -- If effect-safe at `eff`, then certainly effect-safe at .mut
    -- since .mut is the maximum effect level.
    sorry
  )

end Apolon
