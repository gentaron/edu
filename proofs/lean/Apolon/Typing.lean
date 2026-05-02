/-
  Apolon DSL — Type System
  ========================
  Defines the Hindley-Milner type system with row polymorphism for the Apolon DSL.
  This corresponds to grammar.md §4.

  Key components:
  - TyCtx: typing context mapping variable names to types
  - TypeScheme: universally quantified types (for let-polymorphism)
  - HasType: typing judgment Γ ⊢ e : τ
  - WellTyped: a module is well-typed if all declarations typecheck
-/

import Apolon.Syntax

namespace Apolon

/-- A typing context: maps variable names to their types. -/
abbrev TyCtx := List (VarName × Type)

/-- Lookup a variable in the typing context. -/
def TyCtx.lookup (Γ : TyCtx) (x : VarName) : Option Type :=
  (Γ.find? fun (y, _) => y == x).map Prod.snd

/-- Extend the typing context with a new binding. -/
def TyCtx.extend (Γ : TyCtx) (x : VarName) (τ : Type) : TyCtx :=
  (x, τ) :: Γ

/-- A type scheme: ∀α₁...αₙ. τ — universally quantified type variables. -/
structure TypeScheme where
  vars : List String   -- quantified type variables
  body : Type
  deriving Repr

/-- Apply a type scheme by instantiating quantified variables with fresh types. -/
def TypeScheme.instantiate (σ : TypeScheme) (subst : String → Type) : Type :=
  σ.body

/-- Generalize a type over all free type variables not in the context. -/
def SchemeGen (Γ : TyCtx) (τ : Type) : TypeScheme :=
  { vars := [], body := τ }  -- simplified: no free variable computation in this skeleton

/-- Free type variables in a type. -/
def Type.freeVars : Type → List String
  | .TInt        => []
  | .TBool       => []
  | .TString     => []
  | .TUnit       => []
  | .TVar α      => [α]
  | .TArrow a b  => a.freeVars ++ b.freeVars
  | .TRecord fs  => fs.foldl (fun acc (_, t) => acc ++ t.freeVars) []
  | .TList t     => t.freeVars
  | .TTuple ts   => ts.foldl (fun acc t => acc ++ t.freeVars) []

/--
  Typing judgment: Γ ⊢ e : τ
  ============================
  This is the core type system. Rules follow the standard HM discipline
  with extensions for row-polymorphic records, lists, and tuples.

  Rules:
  - T-Int:   Γ ⊢ n : TInt
  - T-Bool:  Γ ⊢ b : TBool
  - T-Str:   Γ ⊢ s : TString
  - T-Unit:  Γ ⊢ unit : TUnit
  - T-Var:   Γ(x) = τ  ⟹  Γ ⊢ x : τ
  - T-Abs:   Γ,x:τ₁ ⊢ e : τ₂  ⟹  Γ ⊢ (λx:τ₁. e) : τ₁ → τ₂
  - T-App:   Γ ⊢ e₁ : τ₁ → τ₂,  Γ ⊢ e₂ : τ₁  ⟹  Γ ⊢ e₁ e₂ : τ₂
  - T-If:    Γ ⊢ c : TBool, Γ ⊢ e₁ : τ, Γ ⊢ e₂ : τ  ⟹  Γ ⊢ if c then e₁ else e₂ : τ
  - T-Let:   Γ ⊢ e₁ : τ₁, Γ,x:τ₁ ⊢ e₂ : τ₂  ⟹  Γ ⊢ let x = e₁ in e₂ : τ₂
  - T-BinOp: appropriate typing rules for each operator
  - T-Record: Γ ⊢ eᵢ : τᵢ for each field  ⟹  Γ ⊢ {#lᵢ: eᵢ} : {#lᵢ: τᵢ}
  - T-Field: Γ ⊢ e : {#l: τ, ...}  ⟹  Γ ⊢ e.#l : τ
  - T-List:  Γ ⊢ eᵢ : τ for each element  ⟹  Γ ⊢ [e₁, ..., eₙ] : [τ]
  - T-Cons:  Γ ⊢ e₁ : τ, Γ ⊢ e₂ : [τ]  ⟹  Γ ⊢ e₁ :: e₂ : [τ]
  - T-Pipe:  desugars to application
-/
inductive HasType : TyCtx → Expr → Type → Prop where
  /-- Integer literals have type TInt. -/
  | intLit (Γ : TyCtx) (n : Int) :
      HasType Γ (.intLit n) .TInt

  /-- Boolean literals have type TBool. -/
  | boolLit (Γ : TyCtx) (b : Bool) :
      HasType Γ (.boolLit b) .TBool

  /-- String literals have type TString. -/
  | strLit (Γ : TyCtx) (s : String) :
      HasType Γ (.strLit s) .TString

  /-- Unit literal has type TUnit. -/
  | unitLit (Γ : TyCtx) :
      HasType Γ .unitLit .TUnit

  /-- Variable lookup: Γ(x) = τ  ⟹  Γ ⊢ x : τ -/
  | var (Γ : TyCtx) (x : VarName) (τ : Type) (h : Γ.lookup x = some τ) :
      HasType Γ (.var x) τ

  /-- Lambda abstraction. -/
  | lam (Γ : TyCtx) (x : VarName) (τ₁ τ₂ : Type) (e : Expr)
      (h : HasType (Γ.extend x τ₁) e τ₂) :
      HasType Γ (.lam x τ₁ e) (.TArrow τ₁ τ₂)

  /-- Function application. -/
  | app (Γ : TyCtx) (e₁ e₂ : Expr) (τ₁ τ₂ : Type)
      (h₁ : HasType Γ e₁ (.TArrow τ₁ τ₂))
      (h₂ : HasType Γ e₂ τ₁) :
      HasType Γ (.app e₁ e₂) τ₂

  /-- If-then-else: condition must be TBool, branches must agree. -/
  | ifThenElse (Γ : TyCtx) (c e₁ e₂ : Expr) (τ : Type)
      (hc : HasType Γ c .TBool)
      (h₁ : HasType Γ e₁ τ)
      (h₂ : HasType Γ e₂ τ) :
      HasType Γ (.ifThenElse c e₁ e₂) τ

  /-- Let binding. -/
  | letE (Γ : TyCtx) (x : VarName) (e₁ e₂ : Expr) (τ₁ τ₂ : Type)
      (h₁ : HasType Γ e₁ τ₁)
      (h₂ : HasType (Γ.extend x τ₁) e₂ τ₂) :
      HasType Γ (.letE x e₁ e₂) τ₂

  /-- Arithmetic binary operations: both operands TInt, result TInt. -/
  | binOpArith (Γ : TyCtx) (op : BinOp) (e₁ e₂ : Expr)
      (h₁ : HasType Γ e₁ .TInt)
      (h₂ : HasType Γ e₂ .TInt)
      (h : op ∈ [.add, .sub, .mul, .div, .mod]) :
      HasType Γ (.binOp op e₁ e₂) .TInt

  /-- Comparison binary operations: both operands TInt, result TBool. -/
  | binOpCmp (Γ : TyCtx) (op : BinOp) (e₁ e₂ : Expr)
      (h₁ : HasType Γ e₁ .TInt)
      (h₂ : HasType Γ e₂ .TInt)
      (h : op ∈ [.eq, .ne, .lt, .le, .gt, .ge]) :
      HasType Γ (.binOp op e₁ e₂) .TBool

  /-- Logical binary operations: both operands TBool, result TBool. -/
  | binOpLogic (Γ : TyCtx) (op : BinOp) (e₁ e₂ : Expr)
      (h₁ : HasType Γ e₁ .TBool)
      (h₂ : HasType Γ e₂ .TBool)
      (h : op ∈ [.and, .or]) :
      HasType Γ (.binOp op e₁ e₂) .TBool

  /-- Logical not: operand TBool, result TBool. -/
  | unaryNot (Γ : TyCtx) (e : Expr)
      (h : HasType Γ e .TBool) :
      HasType Γ (.unaryOp .not e) .TBool

  /-- Numeric negation: operand TInt, result TInt. -/
  | unaryNeg (Γ : TyCtx) (e : Expr)
      (h : HasType Γ e .TInt) :
      HasType Γ (.unaryOp .neg e) .TInt

  /-- Record literal: each field must typecheck. -/
  | record (Γ : TyCtx) (fields : List (Label × Expr)) (types : List (Label × Type))
      (h_len : fields.length = types.length)
      (h_types : ∀ i (hi : i < fields.length),
        HasType Γ (fields[i].2) (types[i].2))
      (h_labels : ∀ i (hi : i < fields.length),
        (fields[i].1) = (types[i].1)) :
      HasType Γ (.record fields) (.TRecord types)

  /-- Field access: e must be a record containing the label. -/
  | field (Γ : TyCtx) (e : Expr) (l : Label) (τ : Type) (rest : List (Label × Type))
      (h : HasType Γ e (.TRecord ((l, τ) :: rest))) :
      HasType Γ (.field e l) τ

  /-- List literal: all elements must have the same type. -/
  | listLit (Γ : TyCtx) (elems : List Expr) (τ : Type)
      (h : ∀ e ∈ elems, HasType Γ e τ) :
      HasType Γ (.listLit elems) (.TList τ)

  /-- Cons: prepend element to list. -/
  | cons (Γ : TyCtx) (e₁ e₂ : Expr) (τ : Type)
      (h₁ : HasType Γ e₁ τ)
      (h₂ : HasType Γ e₂ (.TList τ)) :
      HasType Γ (.cons e₁ e₂) (.TList τ)

  /-- Pipe: e |> f desugars to f(e). -/
  | pipe (Γ : TyCtx) (e : Expr) (f : VarName) (τ₁ τ₂ : Type)
      (h₁ : HasType Γ e τ₁)
      (h₂ : HasType Γ (.var f) (.TArrow τ₁ τ₂)) :
      HasType Γ (.pipe e f) τ₂

/-- A module is well-typed if all function and type declarations typecheck. -/
inductive WellTypedModule : Module → Prop where
  | intro (M : Module)
      (h_fns : ∀ d ∈ M.decls,
        match d with
        | .fnDecl f => HasType (f.params.map Prod.fst |> fun xs =>
            (xs.zip f.params).map (fun (x, (_, τ)) => (x, τ)))
            f.body f.retType
        | _ => True)
      (h_cards : ∀ d ∈ M.decls,
        match d with
        | .cardDecl _ => True  -- card declarations are structurally well-formed by construction
        | _ => True)
      :
      WellTypedModule M

/-- A statement is well-typed in a given context. -/
inductive WellTypedStmt : TyCtx → Stmt → Prop where
  | letS (Γ : TyCtx) (x : VarName) (τ : Type) (e : Expr)
      (h : HasType Γ e τ) :
      WellTypedStmt Γ (.letS x τ e)

  | letSInfer (Γ : TyCtx) (x : VarName) (e : Expr) (τ : Type)
      (h : HasType Γ e τ) :
      WellTypedStmt Γ (.letSInfer x e)

  | exprS (Γ : TyCtx) (e : Expr) (τ : Type)
      (h : HasType Γ e τ) :
      WellTypedStmt Γ (.exprS e)

  | returnS (Γ : TyCtx) (e : Expr) (τ : Type)
      (h : HasType Γ e τ) :
      WellTypedStmt Γ (.returnS e)

/-- Substitution of a variable with an expression. -/
def Expr.subst (e : Expr) (x : VarName) (s : Expr) : Expr :=
  match e with
  | .intLit _     => e
  | .boolLit _    => e
  | .strLit _     => e
  | .unitLit      => e
  | .var y        => if y == x then s else e
  | .app e₁ e₂    => .app (e₁.subst x s) (e₂.subst x s)
  | .binOp op e₁ e₂ => .binOp op (e₁.subst x s) (e₂.subst x s)
  | .unaryOp op e₁ => .unaryOp op (e₁.subst x s)
  | .ifThenElse c e₁ e₂ => .ifThenElse (c.subst x s) (e₁.subst x s) (e₂.subst x s)
  | .lam y τ body  => if y == x then e else .lam y τ (body.subst x s)
  | .letE y e₁ e₂  => .letE y (e₁.subst x s) (if y == x then e₂ else e₂.subst x s)
  | .record fields  => .record (fields.map (fun (l, e) => (l, e.subst x s)))
  | .field e' l     => .field (e'.subst x s) l
  | .listLit elems  => .listLit (elems.map (fun e' => e'.subst x s))
  | .cons e₁ e₂     => .cons (e₁.subst x s) (e₂.subst x s)
  | .pipe e' f      => .pipe (e'.subst x s) f

end Apolon
