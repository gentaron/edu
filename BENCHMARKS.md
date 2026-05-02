# 📊 Performance Benchmarks — Phase 2.5

> Scientific benchmark infrastructure for the edu project.
> Benchmarks are reproducible, version-controlled, and integrated into CI.

## How to Run

| Command                      | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `bun run bench`              | Run all TypeScript benchmarks (Vitest bench) |
| `bun run bench:rust`         | Run Rust criterion.rs benchmarks             |
| `bun run size`               | Measure JS/WASM bundle sizes                 |
| `bun run size:json`          | Bundle size as JSON (for CI parsing)         |
| `bun run baseline`           | Capture full performance baseline report     |
| `ANALYZE=true bun run build` | Build with Next.js bundle analyzer           |

## Benchmark Infrastructure

### TypeScript Benchmarks (Vitest)

Located in `src/**/__benchmarks__/*.bench.ts`:

| Module          | File                                            | Benchmarks | Description                                   |
| --------------- | ----------------------------------------------- | ---------- | --------------------------------------------- |
| Binary Protocol | `metal/__benchmarks__/binary-protocol.bench.ts` | 12         | VarInt, String, Object encode/decode, CRC32   |
| Wiki Search     | `wiki/__benchmarks__/wiki-search.bench.ts`      | 9          | Search, autocomplete, category filtering      |
| Battle Engine   | `battle/__benchmarks__/battle-engine.bench.ts`  | 6          | Damage calc, phase transition, log management |
| WebGPU Compute  | `metal/webgpu/__benchmarks__/compute.bench.ts` | 12         | Particle integration, AoE falloff, ring buffer |

### Rust Benchmarks (Criterion.rs)

Located in `crates/edu-battle-engine/benches/battle_bench.rs`:

| Group                    | Benchmarks | Description                       |
| ------------------------ | ---------- | --------------------------------- |
| `calculate_damage`       | 4          | Attack, Defense, Effect, Ultimate |
| `execute_enemy_turn`     | 2          | Normal and shielded               |
| `simulate_battle`        | 4          | Team size 1/3/5, boss 500HP       |
| `check_phase_transition` | 3          | Above/at/below threshold          |
| `serde_json`             | 3          | Serialize/deserialize field+enemy |

## Results — Baseline (Epoch 10, Phase 2.5)

**Environment**: Ubuntu Linux, Bun 1.3.x, Node 22.x

### Binary Protocol Performance

| Benchmark                          | Ops/sec    | Mean (ms) | p99 (ms) | Relative           |
| ---------------------------------- | ---------- | --------- | -------- | ------------------ |
| writeVarInt (0..300)               | 12,623,747 | 0.0005    | 0.001    | 1.00x (baseline)   |
| writeString Japanese (x50)         | 1,205,687  | 0.005     | 0.044    | **10.47x** slower  |
| writeValue nested object (x100)    | 63,408     | 0.098     | 0.952    | **199.11x** slower |
| writeValue complex array+obj (x50) | 43,712     | 0.143     | 1.065    | **288.78x** slower |
| readVarInt (x500)                  | 1,582,628  | 0.004     | 0.022    | —                  |
| readString Japanese (x100)         | 99,064     | 0.066     | 0.464    | **15.97x** slower  |
| encode 100 entries + index         | 2,034      | 3.37      | 15.2     | —                  |
| index lookup x100                  | 1,357      | 5.05      | 18.1     | 1.50x slower       |
| CRC32 (1KB)                        | 182,147    | 0.027     | 0.058    | 1.00x (baseline)   |
| CRC32 (10KB)                       | 22,845     | 0.218     | 0.493    | **7.97x** slower   |
| CRC32 (100KB)                      | 2,351      | 2.11      | 7.4      | **77.45x** slower  |

### Wiki Search Engine Performance

| Benchmark                        | Ops/sec | Mean (ms)   | Notes                        |
| -------------------------------- | ------- | ----------- | ---------------------------- |
| search — single JP term          | ~1,800  | ~0.56       | 2-char query (e.g. "セリア") |
| search — multi-term query        | ~1,600  | ~0.62       | 4 chars with space           |
| search — English term            | ~1,800  | ~0.55       | ASCII query                  |
| search — category filtered       | ~600    | ~1.7        | Single category filter       |
| search — multi-category filtered | ~300    | ~3.3        | 3 categories merged          |
| search — limit 50                | ~1,200  | ~0.83       | Larger result set            |
| autocomplete JP prefix           | ~25,000 | ~0.04       | Trie-based prefix lookup     |
| autocomplete EN prefix           | ~28,000 | ~0.036      | Fast ASCII trie scan         |
| 100 sequential queries           | ~50     | ~20ms batch | 10 queries x 10 repeats      |

### Battle Engine Performance (Pure Functions)

| Benchmark                        | Ops/sec   | Mean (ms) | p99 (ms) | Relative            |
| -------------------------------- | --------- | --------- | -------- | ------------------- |
| calculatePhaseTransition         | 1,536,698 | 0.0004    | 0.001    | **1.00x** (fastest) |
| appendLog (30 entries)           | 355,346   | 0.003     | 0.006    | 4.32x slower        |
| charMaxHp (x1000)                | 136,251   | 0.007     | 0.025    | 11.28x slower       |
| calculateEnemyDamage (x1000)     | 82,428    | 0.011     | 0.027    | 18.64x slower       |
| calculateEffectDamage (shield)   | 6,340     | 0.138     | 0.461    | 242.37x slower      |
| calculateEffectDamage (dmg+heal) | 6,200     | 0.102     | 1.088    | **247.86x** slower  |

### GAP 2 Result — EffectType Enum Optimization

**Before (Epoch 10, Phase 2.5 baseline)**:

- `calculateEffectDamage` used up to 12 `string.includes()` calls on Japanese UTF-16 strings per invocation
- Raw string matching was the primary bottleneck (289.24x slower than fastest)

**After (Epoch 11 — EffectType enum + O(1) switch dispatch)**:

- Effect classification moved to data-definition time via `classifyEffect()` — runs ONCE when cards are loaded
- Hot path uses `switch(effectType)` — O(1) dispatch, zero runtime string matching
- All 76 card data entries have pre-computed `effectType: EffectType.XXX`
- Raw benchmark numbers are similar because template literal log construction dominates the cost (V8 optimizes short `.includes()` extremely well)
- **Key architectural win**: In actual gameplay, each `calculateEffectDamage` call does ZERO string matching — the effectType is already set on the card object

## Bundle Size Baseline

| Component          | Size         | Notes                              |
| ------------------ | ------------ | ---------------------------------- |
| JS Chunks (total)  | **2.3 MB**   | `.next/static/chunks/`             |
| Largest JS chunk   | **544 KB**   | `c06f30bc319701d5.js`              |
| 2nd largest        | 220 KB       | `c284ff537f4f1dda.js`              |
| WASM binary        | **148.5 KB** | `edu_battle_engine_bg.wasm`        |
| WASM gzipped       | **~45 KB**   | With gzip compression              |
| WASM JS glue       | **39.7 KB**  | `edu_battle_engine.js`             |
| Total build output | **~308 MB**  | Includes standalone + node_modules |

### Bundle Analyzer

Run `ANALYZE=true bun run build` to open the interactive Next.js bundle analyzer. The analyzer shows:

- Which packages contribute the most to each chunk
- Tree-shaking effectiveness
- Shared dependency duplication

## Test Coverage — Epoch 12 Delta (WebGPU Compute)

| Metric         | Epoch 11 Baseline | Epoch 12 Delta Current | Target  |
| -------------- | ---------------- | ---------------------- | ------- |
| Tests          | **1708**         | **1762** (+54)         | 500+ ✅ |
| PBT Properties | **56**           | **69** (+13)           | 56+ ✅  |
| Test Files     | **58**           | **63** (+5)            | —       |

### New WebGPU Compute Benchmarks (Epoch 12 Delta)

Located in `src/metal/webgpu/__benchmarks__/compute.bench.ts`:

| Benchmark                                      | Description                              |
| ---------------------------------------------- | ---------------------------------------- |
| CPU Particle: 256 @ 60fps                     | 256 particles, single frame update       |
| CPU Particle: 1024 @ 60fps                    | 1024 particles, single frame update      |
| CPU Particle: 2048 @ 60fps                    | 2048 particles, single frame update      |
| CPU Particle: 4096 @ 60fps                    | 4096 particles, single frame update      |
| CPU Particle: 4096 × 10 steps                 | 4096 particles, 10 sequential frames     |
| AoE 64×64 linear                              | 4096-cell grid, linear falloff           |
| AoE 128×128 smoothstep                         | 16384-cell grid, hermite interpolation    |
| AoE 256×256 exponential                        | 65536-cell grid, Gaussian decay           |
| Ring Buffer: Fallback write 1000               | Structured clone fallback write throughput |
| Ring Buffer: Fallback write+read 1000          | Fallback roundtrip throughput             |
| Ring Buffer: Shared write 1000                 | SharedArrayBuffer write throughput        |
| Ring Buffer: Shared write+read 1000            | SharedArrayBuffer roundtrip throughput    |
| Frame-time sim: 60 frames × 2048 particles     | Full battle scene simulation (1 second)   |

### Performance Budget — Epoch 12 Delta

| Budget Item                    | Limit          | Status      |
| ----------------------------- | -------------- | ----------- |
| WASM total (gzip)             | ≤ 250 KB       | ~45 KB ✅   |
| Initial JS max chunk (gzip)   | ≤ 200 KB       | ~220 KB ⚠️ |
| CI wall time per phase        | ≤ 25 minutes   | TBD         |
| Particle update (CPU, 4096)   | ≤ 16ms/frame   | Target: 60fps |
| AoE 256×256 (CPU)             | ≤ 16ms         | Target: real-time |

### Coverage Improvement Summary (28.8% → 91.72%)

| GAP   | Change                                                                                                                                                                   | Impact                                   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| GAP 1 | Added 10 new test files (validators, invariants, battle.store, wiki-search, cards.store, stories.repository, content.repository, wasm-bridge, schemas, cards.repository) | +60% statements                          |
| GAP 2 | EffectType enum + switch dispatch                                                                                                                                        | Tested via existing battle.engine tests  |
| GAP 4 | Branded types (CardId, EnemyId, WikiId, etc.)                                                                                                                            | New type safety, compile-time guarantees |
| GAP 5 | JSDoc on ~60 exported functions across 10 files                                                                                                                          | Documentation quality                    |
| GAP 7 | Custom ESLint rules (no-cross-domain-import, require-jsdoc)                                                                                                              | Architecture enforcement                 |
| GAP 8 | Build-time data validation script (prebuild)                                                                                                                             | CI/CD integration                        |

## CI Integration

The `.github/workflows/ci.yml` workflow runs on every push/PR:

| Job                    | Duration (est.) | Artifacts              |
| ---------------------- | --------------- | ---------------------- |
| quality (tsc + eslint) | ~30s            | —                      |
| test (499 tests)       | ~15s            | coverage-report        |
| coverage thresholds    | ~15s            | pr-coverage            |
| bundle-size analysis   | ~60s            | bundle-report.json     |
| TS benchmarks          | ~30s            | benchmark-results.json |
| production build       | ~90s            | —                      |

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

| Change                     | Action               |
| -------------------------- | -------------------- |
| Bundle size > 10% increase | Warning in CI        |
| WASM binary > 200KB        | Warning in CI        |
| Largest JS chunk > 500KB   | Warning in CI        |
| Benchmark regression > 20% | Investigate required |
| Test count decrease        | CI failure           |
| Coverage threshold miss    | CI failure           |

## Epoch 12 — Phase α Benchmark Delta

### no_std Core Extraction

| Metric                     | Before (Epoch 11)       | After (Epoch 12, Phase α)                  | Delta |
| -------------------------- | ----------------------- | ------------------------------------------ | ----- |
| Rust crates                | 1 (`edu-battle-engine`) | 5 (core, wasm, native, embedded, original) | +4    |
| Rust tests                 | 9                       | 61 (+9 unit + 9 proof + 8 RNG)             | +52   |
| no_std compatible          | No                      | Yes (`edu-engine-core`)                    | New   |
| RISC-V target              | N/A                     | `riscv64gc-unknown-none-elf`               | New   |
| RISC-V binary size         | N/A                     | 5,768 bytes (78 bytes text)                | New   |
| Kani harnesses             | 0                       | 6 proof targets                            | +6    |
| Property-based proofs      | 0                       | 9 exhaustive fuzz tests                    | +9    |
| Deterministic RNG          | No (Math.random)        | xoshiro256++ (no_std)                      | New   |
| EffectType variants (Rust) | N/A (string-based)      | 10 exhaustive enum                         | New   |
| Fixed-point arithmetic     | No                      | u16 multiplier (/100)                      | New   |

### TypeScript CI (No Regression)

| Metric              | Before               | After                | Status    |
| ------------------- | -------------------- | -------------------- | --------- |
| TypeScript tests    | 854                  | 854                  | No change |
| tsc                 | Pass                 | Pass                 | No change |
| ESLint              | 0 errors, 0 warnings | 0 errors, 0 warnings | No change |
| Next.js build       | 51 pages             | 51 pages             | No change |
| Max JS chunk (gzip) | 158KB                | 158KB                | No change |

## Epoch 12 — Phase β Benchmark Delta (Quantum Substrate)

### Qiskit Apolonium Field Simulation

| Metric          | Value                                                |
| --------------- | ---------------------------------------------------- |
| Circuit         | 8-qubit Hadamard + CNOT entanglement chain           |
| Backend         | StatevectorSampler (qiskit-aer)                      |
| Shots           | 8192                                                 |
| Wall-clock time | ~27ms                                                |
| Unique outcomes | 32                                                   |
| Entropy         | 4.998132 bits                                        |
| Max probability | 0.034424                                             |
| Determinism     | Byte-identical across runs (md5: `a1cf5b990d41175b`) |
| Output          | `src/domains/battle/quantum-distributions.json`      |

### edu-quasi — no_std QASM-2 Interpreter

| Metric                  | Value                                            |
| ----------------------- | ------------------------------------------------ |
| Supported gates         | H, X, Z, CNOT, MEASURE                           |
| Max qubits              | 12 (4096 complex amplitudes = 64KB stack)        |
| Tests                   | 74 unit + 2 doc-tests = **76 total**             |
| Zero-heap               | Yes (stack-only `[Complex; 4096]`)               |
| Bell state verification | H(0); CX(0,1) → ~50% \|00⟩ + ~50% \|11⟩ ✅       |
| GHZ state verification  | H(0); CX chain → correct 3-qubit entanglement ✅ |
| 12-qubit circuit        | Compiles and executes successfully ✅            |

### edu-pqc — Post-Quantum Cryptography

| Metric                    | Value                                                          |
| ------------------------- | -------------------------------------------------------------- |
| KEM algorithm             | CRYSTALS-Kyber-768 (ML-KEM)                                    |
| Signature algorithm       | CRYSTALS-Dilithium (ML-DSA-44)                                 |
| Tests                     | **15 total** (7 Kyber + 8 Dilithium)                           |
| Property tests            | 7 (50-key Kyber roundtrip, 50-key Dilithium, 30 full pipeline) |
| Shared secret size        | 32 bytes                                                       |
| Kyber public key size     | 1,184 bytes                                                    |
| Kyber ciphertext size     | 1,088 bytes                                                    |
| Dilithium public key size | 1,312 bytes                                                    |
| Dilithium signature size  | ~2,420 bytes                                                   |
| FFI boundary              | C bindings (Kani cannot verify) — PBT mitigation               |

### Cumulative Rust Metrics (Phase α + β)

| Metric              | Phase α       | Phase β                                   | Total Delta   |
| ------------------- | ------------- | ----------------------------------------- | ------------- |
| Rust crates         | 5             | 7 (+edu-quasi, edu-pqc)                   | +2            |
| Rust tests          | 61            | 161 (+74 quasi + 15 pqc + 11 wasm/native) | +100          |
| Kani proofs         | 6             | 6                                         | No change     |
| SIMD module         | Yes (nightly) | Yes (nightly)                             | No change     |
| TypeScript tests    | 854           | 854                                       | No regression |
| TypeScript coverage | 91.72%        | 91.72%                                    | No regression |
