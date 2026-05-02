# Apolon DSL — Formal Grammar Specification

> **Lore mapping**: The Apolon DSL is the **Liminal Forge compilation pipeline** — the divine
> language through which the 8 Thought Layers express card abilities, battle effects, and
> dimensional resonance patterns. Every `.apo` file is a *forging blueprint* for the Liminal Forge.

## 1. Overview

Apolon is a statically-typed, purely-functional DSL designed for defining card abilities and
battle effects in the EDU battle engine. It compiles to WASM 2.0 via an SSA IR intermediate
representation. Key design goals:

- **Hindley-Milner type inference** with row polymorphism for extensible record types
- **Effect system**: every function is tagged `pure`, `view`, or `mut`; the compiler rejects
  mutating operations in `pure` context at *compile time* (not runtime)
- **no_std target**: emitted WASM uses no heap allocator; all values are stack-allocated or
  statically allocated
- **Deterministic**: the language has no undefined behavior; all arithmetic saturates on overflow
- **Branded types**: module IDs, ability IDs, and IR block IDs are opaque branded newtypes

### 1.1 File Extension

`.apo` — ASCII/UTF-8 source files.

### 1.2 Module Resolution

Each `.apo` file defines exactly one module. The module name is derived from the file path:

```
cards/diana.apo          → module cards::diana
cards/sr/ninigis.apo     → module cards::sr::ninigis
effects/shield.apo       → module effects::shield
```

## 2. Lexical Grammar

All tokens are case-sensitive. Whitespace (space, tab, newline) is insignificant except as a
token separator. Comments are `//` to end-of-line or `/* ... */` block.

### 2.1 Keywords

```
module    import    card    ability    effect    ultimate
pure      view      mut     record     enum      match
if        else      let     fn         return    type
alias     where     effect_ (effect marker)
Int       Bool     String   Unit       FieldChar BattleState
BattleResult  Enemy  PhaseThreshold  AbilityType  EffectType
```

### 2.2 Literals

```
INT_LIT    = [0-9]+
STRING_LIT = " (escaped characters: \n \t \\ \") "
BOOL_LIT   = true | false
```

### 2.3 Operators

```
+  -  *  /  %        -- arithmetic
== != < > <= >=      -- comparison
&& || !              -- logical (short-circuit)
::                   -- cons (list prepend)
|>                   -- pipe (left-to-right application)
.                    -- record field access
#                    -- row-polymorphic label
```

### 2.4 Delimiters

```
( ) [ ] { } , ; : -> => ' _
```

### 2.5 Identifiers

```
IDENT   = [a-zA-Z_][a-zA-Z0-9_]*
IDENT_U = [A-Z][a-zA-Z0-9_]*    -- type/constructor names
```

## 3. Syntactic Grammar (EBNF)

```
Program       ::= Module*

Module        ::= "module" ModulePath "{" TopLevel* "}"
ModulePath    ::= IDENT ("::" IDENT)*

TopLevel      ::= ImportDecl
                | CardDecl
                | FnDecl
                | TypeDecl
                | EffectDecl
                | LetDecl

ImportDecl    ::= "import" ModulePath ("as" IDENT)?

-- ────────────────────────────────────────────
-- Card Declaration (primary use case)
-- ────────────────────────────────────────────
CardDecl      ::= "card" IDENT "{" CardField* "}"

CardField     ::= CardMetaField
                | CardAbilityDecl

CardMetaField ::= "name"        "=" STRING_LIT
                | "rarity"      "=" Rarity
                | "affiliation" "=" STRING_LIT
                | "attack"      "=" INT_LIT
                | "defense"     "=" INT_LIT
                | "image_url"   "=" STRING_LIT
                | "flavor_text" "=" STRING_LIT

Rarity        ::= "C" | "R" | "SR"

CardAbilityDecl ::= "ability" IDENT AbilityParams AbilityEffect

AbilityParams   ::= "(" ParamList ")"

ParamList       ::= Param ("," Param)*
Param           ::= IDENT ":" TypeExpr

AbilityEffect   ::= ":" TypeExpr "=" Expr   -- simple effect
                  | ":" TypeExpr "=" "effect_" EffectBody   -- effect-annotated

EffectBody      ::= EffectClause ("|" EffectClause)*
EffectClause    ::= EffectTag "{" Stmt* "}"
EffectTag       ::= "pure" | "view" | "mut"

-- ────────────────────────────────────────────
-- Function Declaration
-- ────────────────────────────────────────────
FnDecl        ::= "fn" IDENT TypeParams? "(" ParamList? ")"
                 (":" TypeExpr)? ("where" ConstraintList)?
                 "=" Expr

TypeParams    ::= "[" IDENT ("," IDENT)* "]"
ConstraintList ::= Constraint ("," Constraint)*
Constraint    ::= IDENT ":" KindExpr

-- ────────────────────────────────────────────
-- Type Expressions
-- ────────────────────────────────────────────
TypeExpr      ::= BaseType
                | TypeExpr "->" TypeExpr           -- function type (right-assoc)
                | IDENT_U                            -- named type
                | "{" RowType "}"                    -- record type
                | "[" TypeExpr "]"                    -- list type
                | TypeExpr "+" TypeExpr              -- row extension
                | "(" TypeExpr ("," TypeExpr)* ")"    -- tuple

BaseType      ::= "Int" | "Bool" | "String" | "Unit"

RowType       ::= (RowLabel ":" TypeExpr) ("," RowLabel ":" TypeExpr)*
RowLabel      ::= "#" IDENT

-- ────────────────────────────────────────────
-- Expressions
-- ────────────────────────────────────────────
Expr          ::= Expr1 ("|" Expr1)*                   -- effect blocks (only at top of ability)

Expr1         ::= Expr2 ">>" Expr1                    -- effect bind

Expr2         ::= Expr3 ("||" Expr3)*
Expr3         ::= Expr4 ("&&" Expr4)*
Expr4         ::= Expr5 ("==" | "!=" | "<" | ">" | "<=" | ">=") Expr5
Expr5         ::= Expr6 ("+" | "-" ) Expr6
Expr6         ::= Expr7 ("*" | "/" | "%") Expr7
Expr7         ::= Expr8 ("::" Expr8)?                  -- cons
Expr8         ::= Expr9 (("|>" IDENT) | ("." IDENT))*  -- pipe / field access

Expr9         ::= INT_LIT | STRING_LIT | BOOL_LIT | IDENT | IDENT_U
                | "(" Expr ")"                          -- grouping
                | "[" Expr ("," Expr)* "]"              -- list literal
                | "{" RowLabel "=" Expr ("," RowLabel "=" Expr)* "}"  -- record literal
                | "if" Expr "then" Expr "else" Expr     -- conditional
                | "match" Expr "{" MatchArm* "}"        -- pattern match
                | "let" IDENT "=" Expr "in" Expr        -- let binding
                | Expr "(" ArgList? ")"                 -- application

ArgList       ::= Expr ("," Expr)*

MatchArm      ::= Pattern "=>" Expr
Pattern       ::= INT_LIT | STRING_LIT | BOOL_LIT | IDENT
                | IDENT_U                              -- constructor
                | "_"                                   -- wildcard
                | "(" Pattern ("," Pattern)* ")"        -- tuple pattern

-- ────────────────────────────────────────────
-- Statements (inside effect blocks)
-- ────────────────────────────────────────────
Stmt          ::= LetStmt
                | ExprStmt
                | ReturnStmt

LetStmt       ::= "let" IDENT ":" TypeExpr "=" Expr
                | "let" IDENT "=" Expr
ReturnStmt    ::= "return" Expr
ExprStmt      ::= Expr

-- ────────────────────────────────────────────
-- Type Declarations
-- ────────────────────────────────────────────
TypeDecl      ::= "type" IDENT_U TypeParams? "=" TypeExpr
                | "alias" IDENT_U TypeParams? "=" TypeExpr

-- ────────────────────────────────────────────
-- Effect Declaration (standalone)
-- ────────────────────────────────────────────
EffectDecl    ::= "effect" IDENT "=" EffectSpec
EffectSpec    ::= "pure" | "view" | "mut"
```

## 4. Type System

### 4.1 Hindley-Milner with Row Polymorphism

Apolon uses Algorithm W for type inference with Damas-Milner extensions for row polymorphism.
The type system supports:

- **Parametric polymorphism**: `fn id<a>(x: a): a = x`
- **Row polymorphism**: Records use extensible rows, enabling subtyping via row labels.
  ```
  fn get_name(r: {#name: String | r}): String = r.name
  ```
  This function accepts any record that has a `#name: String` field, regardless of other fields.

### 4.2 Built-in Types

| Type           | Description                                      | WASM encoding       |
|----------------|--------------------------------------------------|---------------------|
| `Int`          | Signed 32-bit integer (saturating arithmetic)     | `i32`               |
| `Bool`         | `true` / `false`                                 | `i32` (0 or 1)      |
| `String`       | Static string reference (no heap allocation)     | `i32` (offset)      |
| `Unit`         | Unit type `()`                                   | (void)              |
| `[T]`          | Fixed-length list (max 64 elements)              | flat array in data  |
| `{#l: T \| r}` | Row-polymorphic record                           | struct in data      |
| `A -> B`       | Function type                                    | function index      |
| `(A, B, ...)`  | Tuple                                            | struct in data      |

### 4.3 Card Record Type

The canonical card record type (auto-derived from `card` declarations):

```
type Card = {
  #id:           String,
  #name:         String,
  #rarity:       Rarity,
  #affiliation:  String,
  #attack:       Int,
  #defense:      Int,
  #image_url:    String,
  #flavor_text:  String,
  #ability:      Ability,
  #ultimate:     UltimateAbility
}
```

### 4.4 Battle State Types (prelude)

```
type FieldChar = {
  #id:             String,
  #name:           String,
  #hp:             Int,
  #max_hp:         Int,
  #attack:         Int,
  #defense:        Int,
  #is_down:        Bool,
  #rarity:         String,
  #ultimate_name:  String,
  #ultimate_damage: Int,
  #effect:         String
}

type BattleState = {
  #turn:                   Int,
  #enemy_hp:               Int,
  #enemy_max_hp:           Int,
  #enemy_phase:            Int,
  #shield_buffer:          Int,
  #field:                  [FieldChar],
  #phase:                  Int,     -- 0=PlayerTurn, 1=Resolving, 2=EnemyTurn, 3=Victory, 4=Defeat
  #log:                    [String],
  #poison_active:          Bool,
  #enemy_attack_reduction: Int
}

type BattleResult = {
  #damage:             Int,
  #heal:               Int,
  #shield:             Int,
  #attack_reduction:   Int,
  #log:                String
}
```

## 5. Effect System

Every function and ability is classified by its effect level:

### 5.1 Effect Levels

| Level  | Keyword | Description                                      |
|--------|---------|--------------------------------------------------|
| **L0** | `pure`  | No side effects. Cannot read or write state.     |
| **L1** | `view`  | May read `BattleState` but not modify it.        |
| **L2** | `mut`   | May read and write `BattleState`.                |

### 5.2 Effect Inference Rules

1. Functions without an `effect_` annotation default to `pure`.
2. If a function calls a `view` function, it is at least `view`.
3. If a function calls a `mut` function, it is at least `mut`.
4. A `pure` function that calls a `view` or `mut` function is a **compile-time error**.
5. A `view` function that calls a `mut` function is a **compile-time error**.

### 5.3 Effect Annotations

```
ability shield_ally(target: FieldChar, value: Int): BattleResult
  = effect_
      pure {
        // Pure computation: calculate result without state access
        let result = {#damage: 0, #heal: 0, #shield: value, #attack_reduction: 0, #log: "shield"}
      }
```

When multiple effect clauses are combined with `|`, the overall effect level is the **maximum**
of all clauses. A `pure | mut` combination is an error — the developer must explicitly annotate
the ability as `mut`.

### 5.4 Built-in Effect-Tagged Functions

The prelude provides these stateful functions:

```
view fn get_turn(state: BattleState): Int
view fn get_enemy_hp(state: BattleState): Int
view fn get_field(state: BattleState): [FieldChar]
view fn get_shield_buffer(state: BattleState): Int
view fn is_poison_active(state: BattleState): Bool

mut fn deal_damage(state: BattleState, amount: Int): BattleState
mut fn heal_target(state: BattleState, amount: Int): BattleState
mut fn apply_shield(state: BattleState, amount: Int): BattleState
mut fn reduce_attack(state: BattleState, amount: Int): BattleState
mut fn log_message(state: BattleState, msg: String): BattleState
mut fn advance_turn(state: BattleState): BattleState
```

## 6. Standard Prelude

Every module implicitly imports the `prelude` module, which provides:

### 6.1 Arithmetic (saturating)

```
pure fn add(a: Int, b: Int): Int
pure fn sub(a: Int, b: Int): Int
pure fn mul(a: Int, b: Int): Int
pure fn div(a: Int, b: Int): Int      -- returns 0 on division by zero
pure fn mod(a: Int, b: Int): Int      -- returns 0 on division by zero
pure fn clamp(x: Int, lo: Int, hi: Int): Int
pure fn max(a: Int, b: Int): Int
pure fn min(a: Int, b: Int): Int
```

### 6.2 Comparison & Logic

```
pure fn eq(a: Int, b: Int): Bool
pure fn ne(a: Int, b: Int): Bool
pure fn lt(a: Int, b: Int): Bool
pure fn le(a: Int, b: Int): Bool
pure fn gt(a: Int, b: Int): Bool
pure fn ge(a: Int, b: Int): Bool
pure fn not(x: Bool): Bool
pure fn and(a: Bool, b: Bool): Bool
pure fn or(a: Bool, b: Bool): Bool
```

### 6.3 List Operations (fixed-length)

```
pure fn len(xs: [a]): Int
pure fn nth(xs: [a], i: Int): a
pure fn map<a, b>(xs: [a], f: a -> b): [b]
pure fn foldl<a, b>(xs: [a], init: b, f: b -> a -> b): b
pure fn filter<a>(xs: [a], f: a -> Bool): [a]
pure fn append(xs: [a], ys: [a]): [a]
pure fn concat(xss: [[a]]): [a]
```

### 6.4 String Operations

```
pure fn str_len(s: String): Int
pure fn str_concat(a: String, b: String): String
pure fn str_eq(a: String, b: String): Bool
pure fn str_contains(s: String, sub: String): Bool
```

### 6.5 Battle Helpers

```
pure fn apply_effect_type(effect: String): EffectType
pure fn classify_effect(effect: String): EffectType
pure fn make_result(damage: Int, heal: Int, shield: Int, reduction: Int, log: String): BattleResult
```

## 7. Module System

### 7.1 Imports

```
import prelude                          -- implicit in every module
import cards::diana                     -- import card module
import cards::diana as d                -- import with alias
import effects::shield (apply_shield)   -- import specific items
```

### 7.2 Visibility

All top-level declarations in a module are public by default. There is no private keyword
in this version of Apolon.

### 7.3 Card Modules

A card module declares a single card with its abilities. Example:

```
module cards::diana {

card diana {
  name        = "Diana"
  rarity      = SR
  affiliation = "Gigapolis West Continent"
  attack      = 7
  defense     = 4
  image_url   = "https://raw.githubusercontent.com/gentaron/image/main/Diana.png"
  flavor_text = "First-generation Wonder Woman. Light's judgment strikes evil."

  ability light_shield(target: FieldChar, value: Int): BattleResult =
    effect_ pure {
      make_result(0, 0, value, 0, "shield")
    }

  ultimate light_judgment(state: BattleState): BattleState =
    effect_ mut {
      let damage = 16
      let new_state = deal_damage(state, damage)
      log_message(new_state, "Light's Judgment strikes for 16 damage!")
    }
}

}
```

## 8. EffectType Enum

The `EffectType` enum is built-in and corresponds to the existing TypeScript enum:

```
enum EffectType {
  HEAL                = 0
  DAMAGE              = 1
  SHIELD              = 2
  HEAL_DAMAGE         = 3
  DAMAGE_HEAL         = 4
  DAMAGE_SHIELD       = 5
  HEAL_SHIELD         = 6
  HEAL_DAMAGE_SHIELD  = 7
  ATTACK_REDUCTION    = 8
  SPECIAL_PANDICT     = 9
}
```

## 9. Compilation Pipeline

```
.apo source
  |
  v
[Lexer] ── tokens
  |
  v
[Parser] ── AST
  |
  v
[Type Checker] ── HM inference + row polymorphism + effect inference
  |
  v
[Effect Validator] ── rejects pure→mut violations
  |
  v
[SSA Builder] ── SSA IR with basic blocks
  |
  v
[Optimizer] ── constant folding, dead code elimination, inlining
  |
  v
[WASM Codegen] ── wasm-encoder → .wasm binary
```

### 9.1 SSA IR

The intermediate representation uses named SSA values with basic blocks:

```
block entry(v0: i32, v1: i32):
  v2 = i32.add v0, v1
  v3 = i32.mul v2, 2
  jump exit(v3)

block exit(result: i32):
  return result
```

### 9.2 WASM Output

- Target: WASM 2.0 (with reference types proposal if available)
- Memory: imported, no internal allocator
- Functions: exported by module name + function name
- Data section: static strings and record layouts
- Size budget: 250 KB gzip maximum per module

## 10. Branded Types

The compiler generates branded newtypes for all IDs:

```
type ApolonModuleId   = ModuleId("cards::diana")
type CardAbilityId    = AbilityId("light_shield")
type IrBlockId        = BlockId("entry")
```

These are opaque — they cannot be constructed from raw strings at runtime. They are
generated by the compiler and embedded in the WASM module's custom sections.

## 11. Error Reporting

Compile errors include:

| Error Code | Description                              |
|------------|------------------------------------------|
| E0001      | Syntax error                             |
| E0002      | Undefined variable                       |
| E0003      | Type mismatch                            |
| E0004      | Unification failure                      |
| E0005      | Effect violation (pure calls mut)        |
| E0006      | Recursive type without indirection       |
| E0007      | Missing effect annotation                |
| E0008      | Duplicate definition                     |
| E0009      | Import not found                         |
| E0010      | WASM size budget exceeded                |
| E0011      | Division by zero (static)                |
| E0012      | Row label conflict                       |

## 12. Appendix: Complete Card Example

```
module cards::jen {

import prelude

card jen {
  name        = "Jen"
  rarity      = SR
  affiliation = "Valoria Alliance"
  attack      = 8
  defense     = 3
  image_url   = "https://raw.githubusercontent.com/gentaron/image/main/Jen.png"
  flavor_text = "Lv938+. The absolute strike of Valoria's ruler."

  ability absolute_strike(target: FieldChar, damage: Int, heal_amt: Int): BattleResult =
    effect_ pure {
      make_result(damage, heal_amt, 0, 0, "absolute_strike")
    }

  ultimate sovereign_strike(state: BattleState): BattleState =
    effect_ mut {
      let damage = 18
      let s1 = deal_damage(state, damage)
      let s2 = heal_target(s1, 2)
      log_message(s2, "Sovereign Absolute Strike for 18 damage + 2 HP restored!")
    }
}

}
```
