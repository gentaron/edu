<div align="center">

# EDU — Eternal Dominion Universe

**Domain Cluster Architecture x Interactive SF Universe**

500+ 年の宇宙史 · 285+ Wiki 項目 · 22 全文小説 · 76 キャラクターカード · Rust WASM PvE バトル

[![CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg)](https://github.com/gentaron/edu/actions)
[![Rust CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg?branch=main&label=Rust)](https://github.com/gentaron/edu/actions)
[![Kani](https://github.com/gentaron/edu/actions/workflows/kani.yml/badge.svg)](https://github.com/gentaron/edu/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Rust](https://img.shields.io/badge/Rust-no_std-CE422B?style=flat-square&logo=rust)](https://www.rust-lang.org)
[![Tests](https://img.shields.io/badge/Tests-854_%2B_217_pass-22C55E?style=flat-square)]()
[![Coverage](https://img.shields.io/badge/Coverage-91.72%25-4CAF50?style=flat-square)]()
[![PBT](https://img.shields.io/badge/PBT-56_%2B_9_properties-F59E0B?style=flat-square)]()
[![Kani](https://img.shields.io/badge/Kani-6_proofs-9333EA?style=flat-square)]()
[![RISC-V](https://img.shields.io/badge/RISC--V-bare_metal-1DACD6?style=flat-square)]()
[![Quantum](https://img.shields.io/badge/Quantum-8_qubits-6366F1?style=flat-square)]()
[![PQC](https://img.shields.io/badge/PQC-ML--KEM_%2B_ML--DSA-EF4444?style=flat-square)]()
[![WebGPU Compute](https://img.shields.io/badge/WebGPU-Compute-4A90D9?style=flat-square)](docs/adr/0004-webgpu-compute-pipeline.md)
[![ZK-Verified Replays](https://img.shields.io/badge/ZK-Verified_Replays-Merkle-9333EA?style=flat-square)](docs/adr/0005-zk-replay-verification.md)
[![Lean 4 Theorems](https://img.shields.io/badge/Lean_4-Engine_Theorems_Mechanized-2D6B4E?style=flat-square)](docs/adr/0006-lean-as-engine-load-bearing.md)
[![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)

</div>

---

## Quick Start

```bash
git clone https://github.com/gentaron/edu.git && cd edu
bun install
bun dev            # http://localhost:3000
bun run build      # production build (51 pages)
bun test           # 854 tests
bun run lint       # eslint --max-warnings=0
bun run bench      # TS + Rust benchmarks
```

> **Runtime**: Bun · **Framework**: Next.js 16 App Router · **Deploy**: Netlify

---

## Architecture

**Domain Cluster Architecture** — 各ドメインは独立した AGENTS.md を持ち、AI エージェントが自律的に開発・拡張可能。共有インフラは `platform/` に集約、ハードウェア最接近層は `metal/` に分離、`app/` は薄い合成層。

```
┌───────────────────────────────────────────────────────────────┐
│  domains/                                                     │
│  ├── wiki/          Wiki 百科事典 (BM25 全文検索 + 転置インデックス) │
│  ├── cards/         カードデータ + デッキストア (Zustand)          │
│  ├── battle/        バトルエンジン (FSM + Canvas 2D)              │
│  ├── stories/       小説アーカイブ (22 話, EN/JP)                 │
│  └── civilizations/ 文明データ (5 大文明 + 指導者)                │
├───────────────────────────────────────────────────────────────┤
│  platform/  共有基盤 — event-bus, Zod schemas, shadcn/ui       │
├───────────────────────────────────────────────────────────────┤
│  metal/     WASM bridge, TLV binary protocol, Web Workers      │
├───────────────────────────────────────────────────────────────┤
│  app/       Next.js App Router — ルーティングと JSX 構成のみ    │
├───────────────────────────────────────────────────────────────┤
│  crates/    Rust バトルエンジン (1,400+ 行, no_std, 5 crates, 61 tests) │
└───────────────────────────────────────────────────────────────┘
```

| Layer         | Lines  | Responsibility                                                   |
| ------------- | ------ | ---------------------------------------------------------------- |
| **domains/**  | ~33K   | ビジネスドメイン (wiki, cards, battle, stories, civilizations)   |
| **app/**      | ~9K    | Next.js ルーティング + ページコンポジション                      |
| **metal/**    | ~2.3K  | WASM bridge, TLV binary protocol, Service Worker, Web Workers    |
| **platform/** | ~863   | Event bus, Zod schemas, shadcn/ui, validators, invariants        |
| **lib/**      | ~3K    | 後方互換ユーティリティ                                           |
| **crates/**   | 7,200+ | Rust → WASM/native/RISC-V/Quantum/PQC/ZK (9 crates, no_std core) |

### Dependency Rules

| Rule                 | Implementation                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **Domain isolation** | 各ドメインは独立 AGENTS.md に従い開発。ドメイン間は `@/platform/event-bus` (typed pub/sub) |
| **Metal separation** | WASM/Binary/Worker は `@/metal/` に隔離。app 層からは `wasm-bridge` 経由                   |
| **Thin composition** | `app/` はロジックを持たず、domains からデータを取得して JSX を構成                         |
| **Branded Types**    | CardId, EnemyId, WikiId でコンパイル時型安全性を保証                                       |

### AGENTS.md Protocol

本リポジトリは AI エージェント自律開発を前提とした **AGENTS.md プロトコル**を採用。

```
AI Agent Flow:
1. Read root AGENTS.md (architecture overview)
2. Identify target domain
3. Read target domain's AGENTS.md only (no cross-domain reads)
4. Change → Test → Type-check → Build
```

| AGENTS.md | Location                       | Scope                 |
| --------- | ------------------------------ | --------------------- |
| Root      | `/AGENTS.md`                   | Architecture overview |
| Wiki      | `src/domains/wiki/AGENTS.md`   | Wiki data + search    |
| Battle    | `src/domains/battle/AGENTS.md` | Battle engine         |
| Platform  | `src/platform/AGENTS.md`       | Shared infrastructure |

---

## Project Overview

**EDU (Eternal Dominion Universe)** は、gentaron 創作のオリジナル SF 世界観「E16 連星系」を Web 上で体験できるインタラクティブ百科事典兼カードバトルゲームアプリ。ドメインクラスタアーキテクチャによる型安全なデータフローで、各ドメインの独立開発・拡張と AI エージェントによる自律的コンテンツ生成を実現。

### Features

| Category             | Content                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Wiki**             | 285+ 項目 (キャラクター 94, 組織 47, 地理 49, 技術 48, 用語 26, 歴史 21) — BM25 全文検索 + 自動リンク |
| **Story**            | 5 章 22 話の連作小説。EN/JP 言語切替。SSG + ISR 1h                                                    |
| **Card Game**        | 76 キャラクターカード (C/R/SR) + 10 種敵による PvE ターン制バトル。Rust WASM エンジン                 |
| **Civilizations**    | 宇宙 5 大文明 + その他文明 + 指導者データ                                                             |
| **Timeline**         | AD3500 ~ E528 の統合年表                                                                              |
| **8 Thought Layers** | D1-D5 (闇) + L1-L3 (光) — 哲学地層システム                                                            |

### Pages (20 routes)

| Route                   | Content                                   | Mode         |
| ----------------------- | ----------------------------------------- | ------------ |
| `/`                     | Home — all section links                  | SSG          |
| `/wiki`                 | Encyclopedia (285+ items)                 | SSG          |
| `/wiki/[id]`            | Item detail (cross-links, leader history) | SSG          |
| `/story`                | Story list (22 chapters)                  | SSG          |
| `/story/[slug]`         | Full text (EN/JP toggle, chapter TOC)     | SSG + ISR 1h |
| `/characters`           | Character tier list (by faction)          | SSG          |
| `/card-game`            | Card collection browser                   | CSR          |
| `/card-game/select`     | Deck builder (pick 5 from 76)             | CSR          |
| `/card-game/battle`     | PvE battle (4 tiers, 10 enemies)          | CSR          |
| `/universe`             | Universe structure, star system data      | SSG          |
| `/civilizations`        | 5 great civilizations                     | SSG          |
| `/civilizations/[name]` | Civilization detail (x5)                  | SSG          |
| `/timeline`             | Unified timeline                          | SSG          |
| `/auralis`              | AURALIS Collective record                 | SSG          |
| `/mina`                 | Mina Eureka Ernst                         | SSG          |
| `/iris`                 | Iris character detail                     | SSG          |
| `/liminal`              | Liminal Forge                             | SSG          |
| `/factions`             | Faction genealogy                         | SSG          |
| `/technology`           | Technology system (7 core techs)          | SSG          |
| `/ranking`              | Wealth ranking                            | SSG          |

---

## Card Game System

PvE ターン制カードバトル。76 枚のキャラクターカードから 5 枚を選択し、4 階級 10 種の敵と戦う。バトルエンジンは Rust 実装 → WASM (148KB) でブラウザ上で高速動作。

| Component       | Detail                                                          |
| --------------- | --------------------------------------------------------------- |
| **Deck**        | 76 cards, pick 5 (C/R/SR rarity)                                |
| **Battle**      | 5 units always on field, turn-based ability selection           |
| **Enemy tiers** | NORMAL / HARD / BOSS / FINAL (4 tiers, 10 types)                |
| **WASM engine** | Rust → WASM (148KB) — damage calc, enemy AI, phase transition   |
| **State**       | Zustand store + localStorage persistence                        |
| **FSM**         | Hierarchical State Machine — BattleHSM with Graphviz DOT export |
| **Canvas**      | FrameBudget 16.67ms + SpriteBatch + ParticleEmitter             |
| **Effects**     | ParticleBurst, SlashEffect, ShieldDome, HealWave, ScreenFlash   |

### EffectType System

9 値の enum (HEAL, DAMAGE, SHIELD, HEAL_DAMAGE, DAMAGE_SHIELD, HEAL_SHIELD, HEAL_DAMAGE_SHIELD, ATTACK_REDUCTION, SPECIAL_PANDICT)。全 case が exhaustive check で網羅性をコンパイル時保証。

---

## Universe Setting

**E16 連星系** (M104 ソンブレロ銀河ハロー)。人類は 4 つの銀河団を経由して定住。

**Major Factions**: AURALIS Collective / ZAMLT / Trinity Alliance / Alpha Venom / V7 / Shadow Rebellion / Liminal Forge

**Timeline**: E1 (genesis) → E528+ (present) — AD3500 ~ E528 unified timeline

**8 Thought Layers** (Epoch 9):

| Layer | Name                      | Alignment | Description                               |
| ----- | ------------------------- | --------- | ----------------------------------------- |
| D1    | Hyperfuture Primacy       | Dark      | Present domination through future tech    |
| D2    | Safety Overseer           | Dark      | Surveillance-based security               |
| D3    | Nation = Corporation      | Dark      | Corporate nation-state                    |
| D4    | Ethical Liberation        | Dark      | Moral constraint removal                  |
| D5    | Dehumanization            | Dark      | Body modification, consciousness transfer |
| L1    | Defensive Accelerationism | Light     | d/acc — tech for defensive acceleration   |
| L2    | Plurality Democracy       | Light     | Pluralistic democratic governance         |
| L3    | Game B                    | Light     | New societal game creation                |

---

## Tech Stack

| Category             | Technology                                                                   |
| -------------------- | ---------------------------------------------------------------------------- |
| **Framework**        | Next.js 16 (App Router, Turbopack)                                           |
| **Language**         | TypeScript 5 (strict, noUncheckedIndexedAccess)                              |
| **Styling**          | Tailwind CSS v4 + tw-animate-css                                             |
| **UI Components**    | shadcn/ui (Radix primitives)                                                 |
| **Animation**        | Framer Motion 12                                                             |
| **State Management** | Zustand 5                                                                    |
| **Validation**       | Zod 4                                                                        |
| **ORM**              | Prisma 6                                                                     |
| **WASM Engine**      | Rust (wasm-pack, 148KB .wasm)                                                |
| **Testing**          | Vitest 4 + Testing Library + fast-check (PBT)                                |
| **Linting**          | ESLint 9 (custom: no-cross-domain-import, require-jsdoc) + SonarJS + Unicorn |
| **Git Hooks**        | Husky + lint-staged                                                          |
| **CI/CD**            | GitHub Actions                                                               |
| **Deployment**       | Netlify (@netlify/plugin-nextjs)                                             |
| **Runtime**          | Bun                                                                          |

---

## Development

### Commands

```bash
bun dev              # Dev server :3000
bun run build        # Production build (tsc + prebuild validation + SSG)
bun start            # Production server
bun test             # 854 tests (vitest run)
bun run test:watch   # Watch mode
bun run test:coverage # Coverage report
bun run test:ui      # Vitest UI
bun run lint         # ESLint --max-warnings=0
bun run bench        # TS + Rust benchmarks
bun run bench:rust   # Rust criterion.rs benchmarks
bun run size         # Bundle size measurement
bun run size:json    # Bundle size as JSON
bun run baseline     # Full performance baseline
bun run db:push      # Prisma DB sync
bun run db:seed      # Seed data
```

### Contributing — Wiki Items

Edit the target category file in `src/domains/wiki/`:

```ts
{
  id: string,                              // Unique identifier (Japanese OK)
  name: string,                            // Display name
  nameEn?: string,                         // English name
  category: "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史",
  subCategory?: string,
  description: string,                     // Description ([[Wiki link]] notation)
  era?: string,
  affiliation?: string,
  tier?: string,                           // S/A/B/C
  image?: string,                          // URL (gentaron/image)
  sourceLinks?: { url: string; label: string }[],
  leaders?: { id: string; name: string; nameEn?: string; role: string; era?: string }[]
}
```

### Contributing — Stories

1. Add JP `.txt` to [gentaron/edutext](https://github.com/gentaron/edutext)
2. Create EN `_EN.txt` translation
3. Register metadata in `src/domains/stories/stories.meta.ts`

### Contributing — Artwork

Push PNG to [gentaron/image](https://github.com/gentaron/image), update `image` field in data.

Naming: English PascalCase (e.g. `MinaEurekaErnst.png`) · 400x400px+ · Square preferred

---

## Quality Standards

| Metric                    | Status                                                           |
| ------------------------- | ---------------------------------------------------------------- |
| TypeScript strict mode    | noUncheckedIndexedAccess                                         |
| `any` type count          | 0 (enforced by ESLint)                                           |
| `eslint-disable`          | 0 (enforced)                                                     |
| Zod build-time validation | validate-data.ts (285 Wiki ID uniqueness, etc.)                  |
| Test suite                | 854 TS tests + 217 Rust tests, all passing                       |
| Coverage                  | 91.72% (V8 provider)                                             |
| PBT properties            | 56 (fast-check) + 9 (Rust)                                       |
| Formal verification       | 6 Kani bounded model checking proofs                             |
| ESLint                    | --max-warnings=0 (custom: no-cross-domain-import, require-jsdoc) |
| Bundle size (gzip)        | Max chunk 158KB                                                  |
| WASM                      | 148KB .wasm (no_std core)                                        |
| Rust targets              | x86_64, wasm32, riscv64gc (bare-metal)                           |
| Clippy                    | -D warnings (zero warnings)                                      |
| Build                     | 51 pages, 0 errors                                               |

---

## Performance Benchmarks

Detailed results in [BENCHMARKS.md](BENCHMARKS.md).

| Module                  | Key Result                                                      |
| ----------------------- | --------------------------------------------------------------- |
| **Binary Protocol**     | VarInt encode: 12.6M ops/sec · CRC32 1KB: 182K ops/sec          |
| **Wiki Search**         | Single term: ~0.56ms · Autocomplete JP: ~0.04ms (Trie)          |
| **Battle Engine**       | Phase transition: 1.5M ops/sec · Simulate battle (5v1): ~0.02ms |
| **Rust (criterion.rs)** | calculate_damage: <100ns · simulate_battle: ~10us               |

---

## Multi-Repository Ecosystem

| Repo                                                    | Role                         |
| ------------------------------------------------------- | ---------------------------- |
| [gentaron/edu](https://github.com/gentaron/edu)         | Main application (this repo) |
| [gentaron/edutext](https://github.com/gentaron/edutext) | Story texts (JP/EN .txt)     |
| [gentaron/image](https://github.com/gentaron/image)     | Character artwork            |
| [gentaron/edunft](https://github.com/gentaron/edunft)   | NFT card metadata            |
| [gentaron/edu-agi](https://github.com/gentaron/edu-agi) | AGENTS.md management         |

---

## Metrics Summary

| Metric                  | Value                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| **Total commits**       | 157                                                                                         |
| **TypeScript**          | 59,020 lines, 226 files                                                                     |
| **Rust**                | 7,200+ lines, 9 crates (core, WASM, native, embedded, battle, quasi, pqc, prover, verifier) |
| **Lean 4**              | 7 modules (Syntax, Typing, Effects, Progress, HpInvariant, TlvInjective, NoInfiniteCombo) |
| **Test suite**          | 854 TS + 217 Rust tests                                                                     |
| **Coverage**            | 91.72%                                                                                      |
| **PBT properties**      | 56 (fast-check) + 9 (Rust)                                                                  |
| **Formal verification** | 6 Kani proofs + Creusot/Prusti contracts + Lean 4 theorems (ζ: load-bearing)              |
| **Quantum**             | 8-qubit AerSimulator, byte-identical PMF (Qiskit + edu-quasi)                               |
| **PQC**                 | ML-KEM-768 (Kyber) + ML-DSA-44 (Dilithium), 15 PBT properties                               |
| **Benchmarks**          | 27 (TS) + 16 (Rust criterion.rs)                                                            |
| **Build output**        | 51 pages (39 static, 12 SSG)                                                                |
| **Max bundle (gzip)**   | 158KB                                                                                       |
| **Wiki entries**        | 285+ (6 categories)                                                                         |
| **Cards**               | 76 player cards, 10 enemies                                                                 |
| **Stories**             | 22 chapters, EN/JP                                                                          |
| **Domains**             | 5 (wiki, cards, battle, stories, civilizations)                                             |
| **Development period**  | 2026/04/12 — 2026/05/01 (20 days)                                                           |
