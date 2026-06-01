# ADR-0001: no_std Core Extraction & RISC-V Bare-Metal Build

## Status
Accepted

## Context
The original `edu-battle-engine` crate was a single monolithic Rust crate with `wasm-bindgen` dependencies in every module. This made it impossible to:
- Run the engine on bare-metal targets (RISC-V, ARM Cortex-M)
- Apply formal verification tools (Kani) that require `no_std`
- Compile the engine for WASM without the C runtime
- Reason about memory safety without heap allocations

## Decision
We extracted the battle engine into a layered architecture:

```
crates/
├── edu-engine-core/        # #![no_std] — zero heap, target-independent
│   ├── src/types.rs        # Core types (FieldChar, EffectType, AbilityType)
│   ├── src/damage.rs       # Damage calculation (pure functions)
│   ├── src/fsm.rs          # Battle FSM + simulation
│   ├── src/rng.rs          # xoshiro256++ deterministic PRNG
│   └── src/proofs.rs       # Kani harnesses + property test fallbacks
├── edu-engine-wasm/        # wasm-bindgen shell (JS bridge only)
├── edu-engine-native/      # criterion benchmarks
└── edu-engine-embedded/    # RISC-V bare-metal demo (5768 bytes)
```

### Key Design Decisions

1. **Fixed-size arrays** instead of `Vec<T>` — no heap required
2. **`EffectType` as exhaustive `#[repr(u8)]` enum** — 10 variants with `from_discriminant` for FFI
3. **`BattleState` uses `[FieldChar; 5]`** — stack-allocated, no allocation
4. **Fixed-point arithmetic** — `attack_multiplier: u16` (divide by 100 for float)
5. **Kani harnesses gated on `#[cfg(kani)]`** — 6 proof targets with property test fallbacks
6. **xoshiro256++ RNG** — `no_std` compatible, period 2^256 - 1, splitmix64 seeding

## Consequences
- **RISC-V binary**: 5768 bytes total (78 bytes text, 5.4KB metadata)
- **Rust tests**: 61 tests (damage, FSM, RNG, proofs) — all passing
- **TypeScript tests**: 854 tests — all passing (no regression)
- **WASM bridge**: Preserved via `edu-engine-wasm` wrapper
- **Original crate**: `edu-battle-engine` preserved for backward compatibility

## Lore-Tech Mapping
- `edu-engine-core` = **Apolon Execution Shrine** — bare-metal battle runtime
- `xoshiro256++` = **Apolonium Seeded Cascade** — deterministic probability field
- RISC-V binary = **Bare-metal Apolon execution** — no OS, no allocator
- Kani proofs = **D1–D5 Adversarial Verification Layer** — mechanized defenses

## Metrics
| Metric | Before | After |
|--------|--------|-------|
| Rust crates | 1 | 5 |
| Rust tests | 9 | 61 (+52) |
| no_std compatible | No | Yes |
| RISC-V target | N/A | riscv64gc-unknown-none-elf |
| Formal verification | None | 6 Kani harnesses + 9 property proofs |
| Deterministic RNG | No (Math.random in TS) | Yes (xoshiro256++) |
| EffectType variants | 4 (string-based) | 10 (exhaustive enum) |
