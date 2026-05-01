# Apolon DSL — Formal Grammar Specification

> **Version:** 1.0.0-draft
> **Status:** Spec-first canonical definition (committed before implementation)
> **Lore mapping:** Ability inscriptions authored in the Liminal Forge

---

## 1. Overview

Apolon is a statically-typed domain-specific language for defining card abilities in the edu battle system. Every `.apo` file is a compilation unit that produces a WASM 2.0 module. The language is designed for:

- **Expressiveness** — arbitrary arithmetic, conditional logic, entity references
- **Safety** — Hindley-Milner type inference with row polymorphism for stat records
- **Purity tracking** — a three-tier effect system (`pure | random | mutating`) enforced at compile time
- **Determinism** — integer-only arithmetic by default (no floating-point ambiguity in golden tests)

---

## 2. Lexical Conventions

### 2.1 Source Encoding

All `.apo` source files are UTF-8 encoded. Comments and string literals may contain any valid Unicode code point. Identifiers are restricted to ASCII alphanumeric characters plus underscore and hyphen.

### 2.2 Whitespace and Comments

```
whitespace  ::= (0x20 | 0x09 | 0x0A | 0x0D)+
line_comment ::= "//" (ASCII_printable - (0x0A))*
block_comment ::= "/*" (ASCII_char - "*/")* "*/"
```

Whitespace and comments are insignificant (ignored by the lexer) except as token separators. Nested block comments are **not** supported (a single `*/` closes any open `/*`).

### 2.3 Keywords (Reserved)

The following identifiers are reserved and cannot be used as variable names:

```
card      ability   stats     on        cast      when
if        else      let       fn        pure      random
mutating  effect    int       bool      str       unit
entity    damage    heal      shield    apply
self      target    caster    true      false     return
cost      mana      hp        turn_start turn_end
```

### 2.4 Literals

```
int_lit    ::= ("+" | "-")? [0-9]+
bool_lit   ::= "true" | "false"
str_lit    ::= '"' printable_char* '"'
printable_char ::= ASCII_char - (0x22 | 0x5C)
               | escape_char
escape_char  ::= "\n" | "\t" | "\\" | "\"" | "\x" hex hex
hex        ::= [0-9a-fA-F]
ident      ::= [a-zA-Z_][a-zA-Z0-9_-]*
```

Card names and ability names use quoted strings. Variable identifiers within expressions follow the `ident` rule, allowing hyphens in the middle for compound names.

### 2.5 Operators and Punctuation

```
"+"   "-"   "*"   "/"   "%"           -- arithmetic
"="   "=="  "!="  "<"   ">"  "<="  ">="  -- comparison / assignment
"("   ")"   "{"   "}"   "["   "]"      -- delimiters
";"   ":"   ","   "."                     -- separators
"->"  "=>"  "||"  "&&"  "!"              -- operators
```

### 2.6 Token Precedence (from lowest to highest)

```
1.  Logical OR:   ||
2.  Logical AND:  &&
3.  Comparison:   ==  !=  <  >  <=  >=
4.  Addition:     +  -
5.  Multiplication: *  /  %
6.  Unary:        -  !
7.  Call/Member:  f(x)  e.field
```

---

## 3. Context-Free Grammar

### 3.1 Program

```
program ::= module_decl? item*

module_decl ::= "module" ident
```

A `.apo` file is a sequence of items. An optional module declaration provides the namespace.

### 3.2 Items

```
item        ::= card_def
              | effect_def
              | fn_def
              | const_def
              | use_decl

card_def    ::= "card" str_lit ":" rarity "{" card_body "}"

rarity      ::= "C" | "R" | "SR" | "Legendary"

card_body   ::= (stats_block | ability_def | passive_def)*

stats_block ::= "stats" "{" stat_field ("," stat_field)* ","? "}"

stat_field  ::= ident "=" expr

ability_def ::= "ability" str_lit param_list? "{" ability_body "}"

param_list  ::= "(" param ("," param)* ")"

param       ::= ident ":" type_ann

passive_def ::= "passive" str_lit "{" block "}"

effect_def  ::= "effect" ident "{" effect_variant* "}"

effect_variant ::= ident "(" param ("," param)* ")" ("->" type_ann)? "{" block "}"

fn_def      ::= "fn" ident param_list ("->" type_ann)? effect_ann? "{" block "}"

effect_ann  ::= ":" ("pure" | "random" | "mutating")

const_def   ::= "const" ident ":" type_ann "=" expr ";"

use_decl    ::= "use" ident ("." ident)* ";"
```

### 3.3 Ability Body

```
ability_body ::= (cost_clause | trigger_clause | block)*

cost_clause  ::= "cost" ":" expr ("mana" | "hp" | "shield") ";"

trigger_clause ::= "on" ident block
```

`trigger_clause` supports: `on cast`, `on turn_start`, `on turn_end`.

### 3.4 Blocks and Statements

```
block       ::= stmt*

stmt        ::= expr_stmt
              | let_stmt
              | assign_stmt
              | if_stmt
              | return_stmt

expr_stmt   ::= expr ";"

let_stmt    ::= "let" ident (":" type_ann)? "=" expr ";"

assign_stmt ::= ident "=" expr ";"

if_stmt     ::= "if" expr "{" block "}" else_clause?

else_clause ::= "else" "{" block "}"
              | "else" if_stmt

return_stmt ::= "return" expr? ";"
```

### 3.5 Expressions

```
expr        ::= or_expr

or_expr     ::= and_expr ("||" and_expr)*

and_expr    ::= cmp_expr ("&&" cmp_expr)*

cmp_expr    ::= add_expr (("==" | "!=" | "<" | ">" | "<=" | ">=") add_expr)?

add_expr    ::= mul_expr (("+" | "-") mul_expr)*

mul_expr    ::= unary_expr (("*" | "/" | "%") unary_expr)*

unary_expr  ::= "-" unary_expr
              | "!" unary_expr
              | call_expr

call_expr   ::= primary_expr ("(" arg_list ")" | "." ident)*

arg_list    ::= (expr ("," expr)*)?

primary_expr ::= int_lit
               | bool_lit
               | str_lit
               | ident
               | "(" expr ")"
               | if_expr
               | struct_expr
               | list_expr

if_expr     ::= "if" expr "{" block "}" else_clause?

struct_expr ::= "{" ident ":" expr ("," ident ":" expr)* ","? "}"

list_expr   ::= "[" expr ("," expr)* "]"
```

### 3.6 Built-in Functions

Available in every compilation unit without explicit import:

```
-- Damage / Healing / Shielding
damage(target: entity, amount: int) -> unit
heal(target: entity, amount: int) -> unit
shield(target: entity, amount: int, turns: int) -> unit
apply(target: entity, effect: Effect) -> unit

-- Entity Accessors (read-only)
target.hp : int
target.maxhp : int
target.atk : int
target.def : int
target.shield : int
self.hp, self.maxhp, self.atk, self.int, self.shield : int
caster.atk, caster.int, caster.hp : int

-- Predicates (pure)
is_alive(entity) -> bool
is_dead(entity) -> bool
has_shield(entity) -> bool

-- Random (requires 'random' effect context)
roll(min: int, max: int) -> int
roll_percent() -> int
choose(targets: [entity]) -> entity

-- Utility (pure)
min(a: int, b: int) -> int
max(a: int, b: int) -> int
abs(x: int) -> int
clamp(value: int, lo: int, hi: int) -> int
```

### 3.7 Type System

#### 3.7.1 Type Annotations

```
type_ann    ::= "int" | "bool" | "str" | "unit" | "entity" | "Effect"
              | row_type | fn_type | list_type

fn_type     ::= "fn" "(" type_ann ("," type_ann)* ")" "->" type_ann

list_type   ::= "[" type_ann "]"

row_type    ::= "{" row_fields "}"

row_fields  ::= row_field ("," row_field)* ","?

row_field   ::= ident ":" type_ann
```

#### 3.7.2 Row Polymorphism for Stat Records

The `stats` block is typed as an open row type:

```
stats { hp = 120; atk = 45; int = 80 }
-- inferred as: { hp: int, atk: int, int: int | r }
```

Row variable `r` allows extension. Functions can operate on subsets:

```
fn needs_hp(e: { hp: int, maxhp: int | r }) : pure -> int { e.hp }
```

#### 3.7.3 Branded Types

Nominal types enforced at compile time:

```
ApolonModuleId   -- from module path hash
CardAbilityId    -- from (module_id, ability_name)
IrBlockId        -- during SSA construction
```

### 3.8 Effect System

#### 3.8.1 Annotation

```
fn_def      ::= "fn" ident param_list ret_type? ":" effect_ann "{" block "}"

effect_ann  ::= "pure" | "random" | "mutating"
```

Default: top-level abilities are `mutating`, pure helper functions are `pure`.

#### 3.8.2 Lattice

```
pure < random < mutating       -- subtyping order
```

#### 3.8.3 Composition

```
pure  + pure     = pure
pure  + random   = random
pure  + mutating = mutating
random + random  = random
random + mutating = mutating
mutating + mutating = mutating
```

#### 3.8.4 Rejection Rule

Calling `random` or `mutating` in a `pure` context is a **compile error**. This is not cosmetic — the effect system must reject invalid programs.

### 3.9 Effect Definitions

```
effect_def ::= "effect" ident "{" effect_variant* "}"

effect_variant ::= ident "(" param ("," param)* ")" ("->" type_ann)? "{" block "}"
```

Example:

```
effect Shield {
  Basic(amount: int, turns: int) {
    shield(target, amount, turns)
  }
  Reflect(amount: int) {
    shield(self, amount, 1)
    when target.hp < target.maxhp / 2 {
      damage(target, amount)
    }
  }
}
```

### 3.10 When Builder (Syntactic Sugar)

```
when expr { block }
```

desugars to:

```
if expr { block }
```

Multiple `when` clauses are independent (not else-if chains).

---

## 4. Canonical Example

```
card "Mina Eureka Ernst" : Legendary {
  stats { hp = 120; atk = 45; int = 80 }
  ability "Veni Vidi Vici" {
    cost: 3 mana
    on cast {
      damage(target, 30 + caster.int * 2)
      when target.hp < target.maxhp / 2 {
        heal(self, 15)
        apply(self, Shield(20, turns: 2))
      }
    }
  }
  ability "Dimensional Staircase" {
    cost: 5 mana
    on cast : mutating {
      damage(target, 50)
      when is_dead(target) {
        heal(self, caster.int)
      }
    }
  }
}
```

---

## 5. Operational Semantics

### 5.1 Evaluation Order

Left-to-right, innermost-first. Function arguments evaluated before call. All arithmetic is integer with truncation toward zero.

### 5.2 Entity Model

`entity` is an opaque reference to a field character. Entity references (`self`, `target`, `caster`) are provided by the runtime. Entity fields are read-only accessors — mutation through built-in functions only.

### 5.3 Determinism

Integer-only arithmetic ensures cross-platform determinism. No floating-point in the base language.

---

## 6. Constraint Summary

| Constraint | Value |
|---|---|
| Source encoding | UTF-8 |
| Arithmetic | Integer-only (truncation toward zero) |
| Max identifier length | 128 bytes |
| Max string literal length | 1024 bytes |
| Max nesting depth | 64 |
| Effect system | Mandatory enforcement |
| Row polymorphism | Extensional (open world) |
| WASM target | no_std, 250KB gzip budget per card |
