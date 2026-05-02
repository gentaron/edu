/-
  Apolon DSL — Syntax Definitions
  ================================
  Defines the abstract syntax of the Apolon DSL: expressions, types, effects,
  statements, cards, and modules. This corresponds to the formal grammar in
  `docs/apolon/grammar.md` §3 (Syntactic Grammar).
-/

namespace Apolon

/-- Variable names are strings. -/
abbrev VarName := String

/-- Field labels for row polymorphism (prefixed with #). -/
abbrev Label := String

/-- Row labels: e.g. "#name", "#hp". -/
def labelPrefix : String := "#"

/-- Binary operators for arithmetic and comparison. -/
inductive BinOp where
  | add | sub | mul | div | mod        -- arithmetic
  | eq | ne | lt | le | gt | ge          -- comparison
  | and | or                            -- logical
  deriving Repr, BEq

/-- Unary operators. -/
inductive UnaryOp where
  | not | neg
  deriving Repr, BEq

/--
  Effect levels: Pure < View < Mut.
  Ordered by increasing capability — a `pure` function can call only `pure`
  functions; a `view` function can call `pure` and `view`; a `mut` function
  can call any.  See grammar.md §5.1.
-/
inductive Effect where
  | pure : Effect
  | view : Effect
  | mut  : Effect
  deriving Repr, BEq

/-- Effect ordering: pure ≤ view ≤ mut. -/
instance : LE Effect where
  le e1 e2 := match e1, e2 with
    | .pure, .pure => true
    | .pure, .view => true
    | .pure, .mut  => true
    | .view, .view => true
    | .view, .mut  => true
    | .mut,  .mut  => true
    | _,     _     => false

instance : LT Effect where
  lt e1 e2 := e1 ≤ e2 ∧ e1 ≠ e2

/-- Maximum of two effects (used to combine effect clauses). -/
def Effect.max : Effect → Effect → Effect
  | .pure, e => e
  | e, .pure => e
  | .view, .mut => .mut
  | .mut,  .view => .mut
  | .view, .view => .view
  | .mut,  .mut  => .mut

instance : Max Effect where
  max := Effect.max

/-- Minimum of two effects. -/
def Effect.min : Effect → Effect → Effect
  | .pure, _ => .pure
  | _, .pure => .pure
  | .view, .view => .view
  | .mut,  .mut  => .mut
  | .view, .mut  => .view
  | .mut,  .view => .view

instance : Min Effect where
  min := Effect.min

/--
  Types in the Apolon type system.
  Supports base types, function types, record types with row polymorphism,
  and list types. See grammar.md §4.2.
-/
inductive ApType where
  | TInt        : ApType
  | TBool       : ApType
  | TString     : ApType
  | TUnit       : ApType
  | TVar        : String → ApType          -- type variable for polymorphism
  | TArrow      : ApType → ApType → ApType     -- function type A → B
  | TRecord     : List (Label × ApType) → ApType  -- {#l1: T1, #l2: T2, ...}
  | TList       : ApType → ApType            -- [T]
  | TTuple      : List ApType → ApType       -- (T1, T2, ...)
  deriving Repr

/-- Named types (Card, FieldChar, BattleState, etc.) represented as aliases. -/
abbrev TypeName := String

/-- A type declaration: `type Foo = τ` or `alias Foo<a> = τ`. -/
structure TypeDecl where
  name   : TypeName
  params : List String      -- type parameters
  body   : ApType
  deriving Repr

/--
  Expressions in the Apolon DSL.
  This is a simplified AST focusing on the core term forms from grammar.md §3.
  Pattern matching, match expressions, and some syntactic sugar are represented
  via their desugared forms.
-/
inductive Expr where
  | intLit     : Int → Expr
  | boolLit    : Bool → Expr
  | strLit     : String → Expr
  | unitLit    : Expr
  | var        : VarName → Expr
  | app        : Expr → Expr → Expr           -- function application
  | binOp      : BinOp → Expr → Expr → Expr   -- binary operation
  | unaryOp    : UnaryOp → Expr → Expr         -- unary operation
  | ifThenElse : Expr → Expr → Expr → Expr     -- if c then e1 else e2
  | lam        : VarName → ApType → Expr → Expr  -- λx:τ. e  (lambda)
  | letE       : VarName → Expr → Expr → Expr  -- let x = e1 in e2
  | record     : List (Label × Expr) → Expr    -- {#l1: e1, #l2: e2, ...}
  | field      : Expr → Label → Expr           -- e.#label (field access)
  | listLit    : List Expr → Expr              -- [e1, e2, ...]
  | cons       : Expr → Expr → Expr            -- e1 :: e2 (list prepend)
  | pipe       : Expr → VarName → Expr         -- e |> f (pipe)
  deriving Repr

/--
  Statements (used inside effect blocks).
  See grammar.md §3 (Statements).
-/
inductive Stmt where
  | letS       : VarName → ApType → Expr → Stmt   -- let x: τ = e
  | letSInfer  : VarName → Expr → Stmt           -- let x = e
  | exprS      : Expr → Stmt                      -- expression statement
  | returnS    : Expr → Stmt                      -- return e
  deriving Repr

/--
  An effect clause: one of `pure { ... }`, `view { ... }`, or `mut { ... }`.
  See grammar.md §5.3.
-/
structure EffectClause where
  level : Effect
  body  : List Stmt
  deriving Repr

/--
  An ability declaration within a card.
  `ability name(params): retType = effect_ clause1 | clause2 | ...`
-/
structure AbilityDecl where
  name      : String
  params    : List (VarName × ApType)   -- parameter list
  retType   : ApType                    -- return type
  effect    : Effect                  -- declared effect level
  clauses   : List EffectClause       -- effect clauses
  deriving Repr

/--
  Rarity level for a card.
-/
inductive Rarity where
  | common : Rarity
  | rare   : Rarity
  | sr     : Rarity
  deriving Repr, BEq

/--
  Card meta fields (name, rarity, attack, defense, etc.).
-/
structure CardMeta where
  name        : String
  rarity      : Rarity
  affiliation : String
  attack      : Int
  defense     : Int
  imageUrl    : String
  flavorText  : String
  deriving Repr

/--
  A complete card declaration.
  See grammar.md §3 (CardDecl).
-/
structure CardDecl where
  meta     : CardMeta
  abilities : List AbilityDecl
  deriving Repr

/--
  A function declaration.
  `fn name<params>(args): retType = body`
-/
structure FnDecl where
  name      : String
  typeParams : List String
  params    : List (VarName × ApType)
  retType   : ApType
  effect    : Effect              -- declared effect level
  body      : Expr
  deriving Repr

/--
  A top-level declaration in a module.
-/
inductive TopLevel where
  | fnDecl    : FnDecl → TopLevel
  | cardDecl  : CardDecl → TopLevel
  | typeDecl  : TypeDecl → TopLevel
  | importDecl : List String → TopLevel  -- module path segments
  deriving Repr

/--
  A module: `module path::segments { decls }`.
  See grammar.md §3 (Module).
-/
structure Module where
  path : List String
  decls : List TopLevel
  deriving Repr

/-- A closure value: a lambda paired with an environment (represented as a list of var→expr pairs). -/
structure Closure where
  param : VarName
  body  : Expr
  env   : List (VarName × Expr)  -- captured environment
  deriving Repr

end Apolon
