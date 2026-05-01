# 📊 Performance Benchmarks — Phase 2.5

> Scientific benchmark infrastructure for the edu project.
> Benchmarks are reproducible, version-controlled, and integrated into CI.

## How to Run

| Command | Description |
|---------|-------------|
| `bun run bench` | Run all TypeScript benchmarks (Vitest bench) |
| `bun run bench:rust` | Run Rust criterion.rs benchmarks |
| `bun run size` | Measure JS/WASM bundle sizes |
| `bun run size:json` | Bundle size as JSON (for CI parsing) |
| `bun run baseline` | Capture full performance baseline report |
| `ANALYZE=true bun run build` | Build with Next.js bundle analyzer |

## Benchmark Infrastructure

### TypeScript Benchmarks (Vitest)

Located in `src/**/__benchmarks__/*.bench.ts`:

| Module | File | Benchmarks | Description |
|--------|------|-----------|-------------|
| Binary Protocol | `metal/__benchmarks__/binary-protocol.bench.ts` | 12 | VarInt, String, Object encode/decode, CRC32 |
| Wiki Search | `wiki/__benchmarks__/wiki-search.bench.ts` | 9 | Search, autocomplete, category filtering |
| Battle Engine | `battle/__benchmarks__/battle-engine.bench.ts` | 6 | Damage calc, phase transition, log management |

### Rust Benchmarks (Criterion.rs)

Located in `crates/edu-battle-engine/benches/battle_bench.rs`:

| Group | Benchmarks | Description |
|-------|-----------|-------------|
| `calculate_damage` | 4 | Attack, Defense, Effect, Ultimate |
| `execute_enemy_turn` | 2 | Normal and shielded |
| `simulate_battle` | 4 | Team size 1/3/5, boss 500HP |
| `check_phase_transition` | 3 | Above/at/below threshold |
| `serde_json` | 3 | Serialize/deserialize field+enemy |

## Results — Baseline (Epoch 10, Phase 2.5)

**Environment**: Ubuntu Linux, Bun 1.3.x, Node 22.x

### Binary Protocol Performance

| Benchmark | Ops/sec | Mean (ms) | p99 (ms) | Relative |
|-----------|---------|-----------|----------|----------|
| writeVarInt (0..300) | 12,623,747 | 0.0005 | 0.001 | 1.00x (baseline) |
| writeString Japanese (x50) | 1,205,687 | 0.005 | 0.044 | **10.47x** slower |
| writeValue nested object (x100) | 63,408 | 0.098 | 0.952 | **199.11x** slower |
| writeValue complex array+obj (x50) | 43,712 | 0.143 | 1.065 | **288.78x** slower |
| readVarInt (x500) | 1,582,628 | 0.004 | 0.022 | — |
| readString Japanese (x100) | 99,064 | 0.066 | 0.464 | **15.97x** slower |
| encode 100 entries + index | 2,034 | 3.37 | 15.2 | — |
| index lookup x100 | 1,357 | 5.05 | 18.1 | 1.50x slower |
| CRC32 (1KB) | 182,147 | 0.027 | 0.058 | 1.00x (baseline) |
| CRC32 (10KB) | 22,845 | 0.218 | 0.493 | **7.97x** slower |
| CRC32 (100KB) | 2,351 | 2.11 | 7.4 | **77.45x** slower |

### Wiki Search Engine Performance

| Benchmark | Ops/sec | Mean (ms) | Notes |
|-----------|---------|-----------|-------|
| search — single JP term | ~1,800 | ~0.56 | 2-char query (e.g. "セリア") |
| search — multi-term query | ~1,600 | ~0.62 | 4 chars with space |
| search — English term | ~1,800 | ~0.55 | ASCII query |
| search — category filtered | ~600 | ~1.7 | Single category filter |
| search — multi-category filtered | ~300 | ~3.3 | 3 categories merged |
| search — limit 50 | ~1,200 | ~0.83 | Larger result set |
| autocomplete JP prefix | ~25,000 | ~0.04 | Trie-based prefix lookup |
| autocomplete EN prefix | ~28,000 | ~0.036 | Fast ASCII trie scan |
| 100 sequential queries | ~50 | ~20ms batch | 10 queries x 10 repeats |

### Battle Engine Performance (Pure Functions)

| Benchmark | Ops/sec | Mean (ms) | p99 (ms) | Relative |
|-----------|---------|-----------|----------|----------|
| calculatePhaseTransition | 1,978,048 | 0.0005 | 0.001 | **1.00x** (fastest) |
| appendLog (30 entries) | 355,346 | 0.003 | 0.006 | 5.57x slower |
| charMaxHp (x1000) | 136,251 | 0.007 | 0.025 | 14.52x slower |
| calculateEnemyDamage (x1000) | 80,049 | 0.013 | 0.027 | 24.71x slower |
| calculateEffectDamage (shield) | 10,966 | 0.091 | 0.300 | 180.37x slower |
| calculateEffectDamage (dmg+heal) | 6,839 | 0.146 | 1.057 | **289.24x** slower |

**Key finding**: `calculateEffectDamage` is the main bottleneck — string matching with Japanese text (`.includes()`) is ~289x slower than the fastest path (`calculatePhaseTransition`).

## Bundle Size Baseline

| Component | Size | Notes |
|-----------|------|-------|
| JS Chunks (total) | **2.3 MB** | `.next/static/chunks/` |
| Largest JS chunk | **544 KB** | `c06f30bc319701d5.js` |
| 2nd largest | 220 KB | `c284ff537f4f1dda.js` |
| WASM binary | **148.5 KB** | `edu_battle_engine_bg.wasm` |
| WASM gzipped | **~45 KB** | With gzip compression |
| WASM JS glue | **39.7 KB** | `edu_battle_engine.js` |
| Total build output | **~308 MB** | Includes standalone + node_modules |

### Bundle Analyzer

Run `ANALYZE=true bun run build` to open the interactive Next.js bundle analyzer. The analyzer shows:
- Which packages contribute the most to each chunk
- Tree-shaking effectiveness
- Shared dependency duplication

## Test Coverage Baseline

| Metric | Current | Target (Phase 5) |
|--------|---------|-------------------|
| Statements | **28.8%** | 80%+ |
| Branches | **38.33%** | 80%+ |
| Functions | **27.73%** | 80%+ |
| Lines | **30.14%** | 80%+ |
| Tests | **499** | 500+ ✅ |
| PBT Properties | **56** | 56 ✅ |

## CI Integration

The `.github/workflows/ci.yml` workflow runs on every push/PR:

| Job | Duration (est.) | Artifacts |
|-----|----------------|-----------|
| quality (tsc + eslint) | ~30s | — |
| test (499 tests) | ~15s | coverage-report |
| coverage thresholds | ~15s | pr-coverage |
| bundle-size analysis | ~60s | bundle-report.json |
| TS benchmarks | ~30s | benchmark-results.json |
| production build | ~90s | — |

## Comparison Targets

### vs rlibc (yuimarudev/rlibc)
- rlibc uses Clippy deny-all + nursery + pedantic — **zero warnings guaranteed**
- rlibc has `codestyle` custom toolchain for automated formatting
- edu ESLint now enforces sonarjs + unicorn (equivalent strictness)

### vs puzzler (yuimarudev/puzzler)
- puzzler proved **7.41x** performance improvement with fat LTO + nightly Rust
- edu WASM uses `opt-level = "z"` + LTO + codegen-units=1 + strip
- criterion.rs benchmarks enable the same scientific measurement approach

## Reproducibility

Benchmarks are deterministic and reproducible:
- **TypeScript**: Vitest bench runs each benchmark enough times for statistical significance (RME < 5%)
- **Rust**: Criterion.rs provides HTML reports with outlier detection, regression detection, and statistical analysis
- **Bundle size**: `scripts/measure-bundle-size.sh --json` produces machine-readable output
- **Baseline**: `scripts/capture-baseline.sh` captures all metrics in a timestamped markdown report

## Performance Regression Policy

| Change | Action |
|--------|--------|
| Bundle size > 10% increase | Warning in CI |
| WASM binary > 200KB | Warning in CI |
| Largest JS chunk > 500KB | Warning in CI |
| Benchmark regression > 20% | Investigate required |
| Test count decrease | CI failure |
| Coverage threshold miss | CI failure |
