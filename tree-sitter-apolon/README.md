# tree-sitter-apolon

Tree-sitter grammar for the **Apolon DSL** — a statically-typed, purely-functional DSL
for defining card abilities and battle effects in the EDU battle engine.

## File extension

`.apo`

## Grammar coverage

The grammar covers all constructs from the formal specification:

- **Module system**: `module` declarations, `import` with aliases and selective imports
- **Card declarations**: meta fields (`name`, `rarity`, `affiliation`, `attack`, `defense`,
  `image_url`, `flavor_text`), ability declarations with parameters and effect annotations
- **Function declarations**: optional effect tag (`pure`/`view`/`mut`), type parameters,
  constraints via `where`, return type annotation
- **Type expressions**: base types (`Int`, `Bool`, `String`, `Unit`), arrow types (`->`),
  record types with row labels (`#label: Type`), list types (`[T]`), tuple types,
  row extension (`+`), named types (upper-case identifiers)
- **Expressions**: all precedence levels, `if`/`then`/`else`, `match` with patterns,
  `let`/`in`, lambda-free (functions are always named), list/record literals,
  pipe (`|>`), field access (`.`), cons (`::`), application (`f(x, y)`),
  unary (`-`, `!`)
- **Effect system**: `effect_` blocks with `pure`, `view`, `mut` clauses separated by `|`
- **Pattern matching**: integer/string/boolean/variable/constructor/wildcard/tuple patterns
- **Type & alias declarations**, **enum declarations**, **effect declarations**
- **Comments**: line (`//`) and block (`/* */`)

### Operator precedence (low → high)

| Level | Operators          | Associativity |
|-------|--------------------|---------------|
| 1     | `\|`               | left          |
| 2     | `>>`               | right         |
| 3     | `\|\|`             | left          |
| 4     | `&&`               | left          |
| 5     | `== != < > <= >=`  | left          |
| 6     | `+ -`              | left          |
| 7     | `* / %`            | left          |
| 8     | `::`               | right         |
| 9     | `\|> .`            | left          |
| 10    | `f(...)`           | —             |
| 11    | `- !` (prefix)     | —             |

## Generating the parser

```bash
# Install tree-sitter CLI
npm install -g tree-sitter-cli

# Generate the parser
cd tree-sitter-apolon
tree-sitter generate

# Test
tree-sitter test
tree-sitter parse test.apo
```

## Running corpus tests

```bash
tree-sitter test
```

This runs all 26 corpus test cases across 7 corpus files:

| Corpus file              | Tests |
|--------------------------|-------|
| `corpus/modules.txt`     | 4     |
| `corpus/card-declarations.txt` | 5  |
| `corpus/expressions.txt` | 6     |
| `corpus/type-expressions.txt` | 3 |
| `corpus/effect-system.txt` | 2   |
| `corpus/pattern-matching.txt` | 3 |
| `corpus/prelude.txt`     | 3     |
| **Total**                | **26** |

## Project structure

```
tree-sitter-apolon/
├── grammar.js           # Grammar definition
├── package.json         # NPM package metadata
├── README.md            # This file
└── corpus/
    ├── modules.txt
    ├── card-declarations.txt
    ├── expressions.txt
    ├── type-expressions.txt
    ├── effect-system.txt
    ├── pattern-matching.txt
    └── prelude.txt
```
