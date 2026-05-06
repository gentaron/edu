# ADR-0003: Apolon DSL — Type-Safe Card Definitions via Domain-Specific Language

## Status
Accepted

## Context

Phase γ of the EDU project introduces a domain-specific language (DSL) for card definitions, replacing the existing TypeScript card objects. The current approach has critical limitations:

- **No type safety for abilities**: Card abilities are defined as TypeScript objects with string-typed effect fields. A typo like `"shild"` instead of `"shield"` is only caught at runtime, if at all.
- **No compile-time verification of effect semantics**: The TypeScript engine performs no static analysis on ability implementations. An ability that accidentally reads battle state in a pure context goes undetected until a test (or a player) hits the bug.
- **No path to WASM execution**: All card logic executes in JavaScript. This precludes deterministic cross-platform battle simulation — two different JS runtimes can produce subtly different floating-point results, breaking replay verification.
- **No formal verification surface**: TypeScript's type system cannot express effect purity, row-polymorphic record constraints, or saturating arithmetic invariants. The battle engine's `no_std` Rust core (Phase α) achieved formal tractability, but the card definition layer remains inexpressive.

The game's in-universe lore demands a "Liminal Forge" — a divine compilation pipeline through which card abilities are forged into deterministic, verifiable artifacts. The technical reality must match: we need a language that compiles card definitions into WASM with verified semantics, not another layer of unverified JavaScript objects.

## Decision

We introduce the **Apolon DSL** (`.apo` files) — a statically-typed, purely-functional domain-specific language for defining card abilities and battle effects. Apolon compiles to WASM 2.0 via an SSA IR intermediate representation, with the following compilation pipeline:

```
.apo source
  |
  v
[Lexer] -- tokens
  |
  v
[Parser] -- AST
  |
  v
[Type Checker] -- HM inference + row polymorphism + effect inference
  |
  v
[Effect Validator] -- rejects pure->mut violations
  |
  v
[SSA Builder] -- SSA IR with basic blocks
  |
  v
[Optimizer] -- constant folding, dead code elimination, inlining
  |
  v
[WASM Codegen] -- wasm-encoder -> .wasm binary
```

The full specification lives in [`docs/apolon/grammar.md`](../apolon/grammar.md).

### Key Design Decisions

1. **Hindley-Milner type inference with row polymorphism** (not structural typing without rows). We use Algorithm W with Damas-Milner row extensions. Row polymorphism enables functions like `fn get_name(r: {#name: String | r}): String` that accept any record containing a `#name` field, providing extensible record subtyping without the fragility of string-indexed structural types. This was chosen over simple structural typing because card records are extended across modules (e.g., an SR card's record type is a row extension of the base `Card` type), and row labels prevent silent field-name collisions.

2. **Three-tier effect system** (`pure` / `view` / `mut`) with compile-time enforcement. Every function and ability is classified by its effect level: `pure` functions perform no state access, `view` functions may read `BattleState`, and `mut` functions may read and write `BattleState`. Effect levels are inferred by the compiler and escalate automatically — a function that calls a `view` function is at least `view`. Violations (a `pure` function calling a `mut` function) are **compile-time errors** (E0005), not runtime checks. This was chosen over a runtime effect system because battle simulation determinism requires that all side effects be statically known before execution.

3. **WASM 2.0 target via `wasm-encoder`** (not LLVM). The compiler emits WASM directly using the `wasm-encoder` Rust crate, targeting WASM 2.0 with reference types if available. Memory is imported (no internal allocator), and all values are stack-allocated or statically allocated in the data section. This was chosen over an LLVM backend because: (a) LLVM's WASM target pulls in unnecessary runtime support, (b) `wasm-encoder` gives us byte-level control over the output binary, enabling the 250KB gzip size budget, and (c) the Apolon language is small enough that a direct codegen is maintainable without the complexity of an IR-to-IR lowering pipeline.

4. **Tree-sitter grammar for IDE integration**. We provide a `tree-sitter-apolon` grammar that generates a Tree-sitter parser for syntax highlighting, code navigation, and editor integration (VS Code, Neovim, Helix). This was chosen over LSP-first development because Tree-sitter provides zero-config syntax highlighting that works immediately, while LSP features (hover types, go-to-definition, completions) can be layered on top incrementally.

5. **Lean 4 progress theorem proof skeleton**. We maintain a partial Lean 4 formalization of the Apolon type system's progress and preservation properties in `proofs/lean/Apolon/`. This is a skeleton — full mechanized proofs are deferred to Phase ζ — but it establishes the proof architecture and validates that the type system is mechanization-friendly. This was chosen over no proof skeleton at all because early exploration of the formalization surface catches design decisions that would make later proofs intractable (e.g., row variable scoping, effect subtyping).

6. **Branded types for module/ability/block IDs**. The compiler generates opaque newtypes (`ModuleId`, `AbilityId`, `BlockId`) that cannot be constructed from raw strings at runtime. These branded types are embedded in the WASM module's custom sections and prevent accidental ID mixing (e.g., passing a `BlockId` where a `ModuleId` is expected). This was chosen over untyped string IDs because the SSA IR and WASM codegen both rely on ID identity guarantees that raw strings cannot provide.

7. **250KB gzip size budget per module**. Each compiled `.apo` module must produce a `.wasm` binary that compresses to no more than 250KB gzip. This is enforced by the compiler's size-budget check (E0010). This budget was chosen because the EDU web client targets mobile browsers with slow connections, and the total WASM payload for all cards must remain under 2MB to meet the initial-load budget.

## Consequences

### Type-Safe Card Definitions

Every card ability is now type-checked before compilation. The Apolon compiler rejects mismatched types (E0003), undefined variables (E0002), and duplicate definitions (E0008) at compile time. Row polymorphism ensures that card record extensions are type-safe: an SR card's record must be a valid row extension of the base `Card` type, and field-name typos (e.g., `#atack` instead of `#attack`) produce row label conflict errors (E0012).

### Effect Violations Caught at Compile Time

The three-tier effect system eliminates an entire class of bugs. A pure ability that accidentally calls `deal_damage` (a `mut` function) is rejected at compile time with error E0005. This is a significant improvement over the TypeScript status quo, where effect violations are only caught by integration tests — if they are caught at all.

### WASM Execution for Deterministic Battle Simulation

Card abilities compiled from `.apo` files execute as WASM modules with identical behavior across all runtimes (browsers, Node.js, Wasmtime). The WASM spec guarantees deterministic execution for all integer arithmetic (saturating on overflow in Apolon's case), and the `no_std` design ensures no heap allocator variance. This enables byte-identical battle replays across platforms.

### Golden Tests Ensure TS↔WASM Byte-Identical Results

The `cards/golden/` directory contains canonical JSON snapshots of card definitions and battle results. CI validates that: (a) the TypeScript engine produces results matching the golden files, and (b) the WASM engine produces byte-identical results. Any divergence between the two runtimes is a CI failure, ensuring that the Apolon DSL compilation never introduces behavioral regressions.

### Migration Path

Existing TypeScript card objects (64 cards) remain functional during the migration. New cards are authored in `.apo` format. Cards are migrated to `.apo` one at a time, with golden test parity checks at each step. The TypeScript definitions are retired once all cards pass golden tests in both runtimes.

## Lore-Tech Mapping

- Apolon DSL → WASM = **The Liminal Forge compilation pipeline** — the divine language through which the 8 Thought Layers express card abilities
- SSA IR = **The 8 Thought Layers crystallized into computational form** — named basic blocks mirror the discrete cognitive strata
- Effect system (`pure` / `view` / `mut`) = **Three-tier invocation purity** — the celestial hierarchy of Forge operations
- Tree-sitter grammar = **The Lexicon of the Forge** — the formal structure underlying all Forged utterances
- Lean 4 progress theorem = **The L1–L3 Light Layers of mechanized truth** — partial formalization; ζ completes the full proof
- Branded types = **True Names** — each module, ability, and block carries an unforgeable identity

## Metrics

| Metric                        | Before (Phase α/β)  | After (Phase γ)                                    |
| ----------------------------- | ------------------- | -------------------------------------------------- |
| Card definitions              | 64 TS card objects  | ≥ 10 `.apo` cards (growing)                        |
| Type safety for abilities     | None (string-typed) | HM inference + row polymorphism                     |
| Compile-time effect checking  | None                | 3-level effect system (pure/view/mut)              |
| Effect violation detection    | Runtime (tests)     | Compile-time (E0005)                               |
| WASM output                   | Engine core only    | Card abilities + engine core                       |
| Golden test parity (TS↔WASM)  | N/A                 | Byte-identical battle results                      |
| IDE support                   | TypeScript only     | Tree-sitter grammar + syntax highlighting          |
| Formal verification surface   | Kani (Rust core)    | Kani (Rust core) + Lean 4 skeleton (type system)  |
| Size budget enforcement       | None                | 250KB gzip per module (E0010)                      |
| Error codes                   | None (TS exceptions)| 12 compile-time error codes (E0001–E0012)         |
