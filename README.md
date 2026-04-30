<div align="center">

# EDU — Eternal Dominion Universe

**Domain Cluster Architecture × Interactive SF Universe**

500+年の宇宙史 · 285+ Wiki項目 · 22全文小説 · 76キャラクターカード · Rust WASM PvEバトル

[![CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg)](https://github.com/gentaron/edu/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Rust](https://img.shields.io/badge/Rust-WASM-CE422B?style=flat-square&logo=rust)](https://www.rust-lang.org)
[![Zod](https://img.shields.io/badge/Zod-4-3068B7?style=flat-square&logo=zod)](https://zod.dev)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)
[![Tests](https://img.shields.io/badge/Tests-17_pass-22C55E?style=flat-square)]()

</div>

---

## 目次

- [Quick Start](#quick-start)
- [Architecture](#architecture)
  - [Domain Cluster Overview](#domain-cluster-overview)
  - [Dependency Rules](#dependency-rules)
  - [Directory Structure](#directory-structure)
  - [AGENTS.md Protocol](#agentsmd-protocol)
- [Project Overview](#project-overview)
- [Content Inventory](#content-inventory)
  - [Pages (26 routes)](#pages-26-routes)
  - [Data Sources](#data-sources)
  - [Content Pipeline](#content-pipeline)
- [Card Game System](#card-game-system)
- [Universe Setting](#universe-setting)
- [Tech Stack](#tech-stack)
- [Development](#development)
  - [Commands](#commands)
  - [Contributing — Wiki Items](#contributing--wiki-items)
  - [Contributing — Stories](#contributing--stories)
  - [Contributing — Artwork](#contributing--artwork)
- [Quality Standards](#quality-standards)
- [Multi-Repository Ecosystem](#multi-repository-ecosystem)
- [Development History — Full Technical Changelog](#development-history--full-technical-changelog)
  - [Epoch 0: Foundation (2026/04/12–20)](#epoch-0-foundation-2026041220)
  - [Epoch 1: Game Systems & Content Expansion (2026/04/21–22)](#epoch-1-game-systems--content-expansion-2026042122)
  - [Epoch 2: Universe Expansion (2026/04/27–28)](#epoch-2-universe-expansion-2026042728)
  - [Epoch 3: Great Cleanup & Modernization (2026/04/28)](#epoch-3-great-cleanup--modernization-20260428)
  - [Epoch 4: Feature Completion & AI DevOps (2026/04/29)](#epoch-4-feature-completion--ai-devops-20260429)
  - [Epoch 5: Refactoring Sprint — 8 Phases (2026/04/29)](#epoch-5-refactoring-sprint--8-phases-20260429)
  - [Epoch 6: Nexus Removal & Stabilization (2026/04/29–30)](#epoch-6-nexus-removal--stabilization-2026042930)
  - [Epoch 7: TCP/IP 7-Layer Architecture (2026/04/30)](#epoch-7-tcpip-7-layer-architecture-20260430)
  - [Epoch 8: Project Prometheus — Max Tech Level (2026/04/30)](#epoch-8-project-prometheus--max-tech-level-20260430)
  - [Epoch 9: Domain Cluster Migration × Philosophy Integration (2026/05/01)](#epoch-9-domain-cluster-migration--philosophy-integration-20260501)
- [Architecture Evolution — Comparative View](#architecture-evolution--comparative-view)
- [Metrics Summary](#metrics-summary)
- [License](#license)

---

## Quick Start

```bash
git clone https://github.com/gentaron/edu.git && cd edu
bun install
bun dev          # → http://localhost:3000
bun run build    # → 本番ビルド（静的HTML 26ルート生成）
bun test         # → 17テスト実行
```

> **Runtime**: Bun | **Framework**: Next.js 16 App Router | **Deploy**: Netlify

---

## Architecture

Epoch 9でTCP/IP 7層モデルから**ドメインクラスタアーキテクチャ**へ移行完了。各ドメインは独立したAGENTS.mdを持ち、AIエージェントが自律的に開発・拡張可能な構造です。共有インフラは`platform/`に集約し、ハードウェア最接近層は`metal/`に分離、Next.js `app/`は薄い合成層に留めています。

### Domain Cluster Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  domains/                                                       │
│  ├── wiki/          Wiki百科事典 (33K行: data × 6 + repo + search)  │
│  ├── cards/         カードデータ + デッキストア (4K行)                │
│  ├── battle/        バトルエンジン (5K行: engine + FSM + store)     │
│  ├── stories/       小説アーカイブ (600行: meta + parser + repo)    │
│  └── civilizations/ 文明データ (1.3K行: top/other/historical)      │
├─────────────────────────────────────────────────────────────────┤
│  platform/  共有基盤 (863行: event-bus, schemas, ui, navigation) │
├─────────────────────────────────────────────────────────────────┤
│  metal/     ハードウェア最接近層 (2.3K行: WASM, Binary, Workers) │
├─────────────────────────────────────────────────────────────────┤
│  app/       Next.js App Router — 薄い合成層 (9K行, 26ルート)    │
├─────────────────────────────────────────────────────────────────┤
│  crates/    Rust WASMバトルエンジン (806行, 148KB .wasm)        │
└─────────────────────────────────────────────────────────────────┘
```

| レイヤー      | 行数   | 責務                                                                                            |
| ------------- | ------ | ----------------------------------------------------------------------------------------------- |
| **domains/**  | 33,050 | ビジネスドメイン。wiki, cards, battle, stories, civilizationsの5ドメイン。各ドメインにAGENTS.md |
| **app/**      | 8,995  | Next.js App Router — ルーティングとページコンポジションのみ。ロジックはdomainsに委譲            |
| **metal/**    | 2,338  | ハードウェア最接近層 — WASM bridge, binary protocol, service worker, web workers                |
| **platform/** | 863    | 共有基盤 — event-bus, schemas, ui (shadcn/ui), navigation, validators, invariants               |
| **lib/**      | ~3,000 | レガシー後方互換ユーティリティ — stores, data access, lang, schemas                             |
| **crates/**   | 806    | Rust → WASM バトルエンジン — 純粋関数: ダメージ計算・敵AI・フェーズ遷移                         |

### Dependency Rules

| ルール                 | 実装                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **ドメイン独立開発**   | 各ドメインは自身のAGENTS.mdに従って独立開発。AIは対象ドメインのAGENTS.mdのみロード |
| **ドメイン間通信**     | ドメイン間通信は`@/platform/event-bus`経由（typed pub/sub）                        |
| **UIプリミティブ使用** | UIコンポーネントは`@/platform/ui/`のshadcn/uiプリミティブを使用                    |
| **Metal分離**          | WASM/Binary/Workerコードは`@/metal/`に隔離。app層からは`wasm-bridge`経由でアクセス |
| **合成層の薄さ**       | `app/`はロジックを持たず、domainsからデータを取得してJSXを構成するのみ             |

### Directory Structure

```
src/
├── domains/                         # ドメインクラスタ (Epoch 9)
│   ├── wiki/                        # Wiki百科事典 (33K行)
│   │   ├── AGENTS.md                #   AI開発エージェント指示書
│   │   ├── characters.data.ts       #   キャラクター94体
│   │   ├── organizations.data.ts    #   組織47項目
│   │   ├── geography.data.ts        #   地理49項目
│   │   ├── technology.data.ts       #   技術48項目
│   │   ├── terms.data.ts            #   用語26項目
│   │   ├── history.data.ts          #   歴史21項目
│   │   ├── wiki-characters-new.data.ts  # 新キャラ追加データ
│   │   ├── wiki.data.ts             #   統合エクスポート
│   │   ├── wiki.repository.ts       #   Repository (getById, getByCategory, search)
│   │   ├── wiki-search.ts           #   全文検索エンジン (BM25 + bi-gram)
│   │   ├── wiki-characters.data.ts  #   キャラクター型定義エクスポート
│   │   ├── content.repository.ts    #   コンテンツRepository
│   │   ├── inverted-index.ts        #   転置インデックス
│   │   ├── terminology-*.ts         #   用語分類モジュール (6ファイル)
│   │   └── characters-new.ts        #   新キャラモジュール
│   ├── cards/                       # カードデータ (4K行)
│   │   ├── AGENTS.md
│   │   ├── player-cards.data.ts     #   76枚のプレイヤーカード
│   │   ├── enemies.ts               #   10種の敵データ
│   │   ├── cards.store.ts           #   デッキ構築 Zustand store
│   │   ├── cards.repository.ts      #   カードRepository
│   │   └── cards.ts                 #   統合エクスポート
│   ├── battle/                      # バトルエンジン (5K行)
│   │   ├── AGENTS.md
│   │   ├── battle.engine.ts         #   ダメージ計算・敵AI・フェーズ遷移
│   │   ├── battle.fsm.ts            #   バトル有限状態マシン
│   │   ├── battle.store.ts          #   バトル状態管理 (Zustand)
│   │   ├── battle.data.ts           #   バトルデータ定義
│   │   ├── battle-renderer.ts       #   Canvas 2Dレンダラー
│   │   ├── hsm/                     #   汎用HSMフレームワーク
│   │   │   ├── battle-hsm.ts        #     BattleHSM定義
│   │   │   └── graphviz.ts          #     Graphviz DOT export
│   │   └── canvas/                  #   Canvas描画モジュール
│   │       ├── battle-renderer.ts   #     スプライト描画
│   │       └── index.ts
│   ├── stories/                     # 小説アーカイブ (600行)
│   │   ├── stories.meta.ts          #   22話のメタデータ
│   │   ├── stories.parser.ts        #   toRoman, isSceneBreak等パーサ
│   │   ├── stories.repository.ts    #   Story Repository
│   │   └── stories.schema.ts        #   Zodスキーマ
│   └── civilizations/               # 文明データ (1.3K行)
│       ├── civ-top.data.ts          #   5大文明
│       ├── civ-other.data.ts        #   その他文明
│       ├── civ-historical.data.ts   #   歴史文明
│       ├── civ-leaders.data.ts      #   文明指導者
│       └── civ.repository.ts        #   文明Repository
│
├── platform/                        # 共有基盤 (863行)
│   ├── AGENTS.md                    #   AI開発エージェント指示書
│   ├── event-bus.ts                 #   typed pub/subイベントシステム
│   ├── navigation.tsx               #   グローバルナビゲーション
│   ├── page-header.tsx              #   PageHeaderコンポーネント
│   ├── reveal-section.tsx           #   RevealSection / RevealGrid / SectionHeader
│   ├── motion-provider.tsx          #   Framer Motion LazyMotionプロバイダ
│   ├── json-ld.tsx                  #   JSON-LD構造化データ
│   ├── schemas/                     #   Zodスキーマ定義
│   │   ├── wiki.schema.ts
│   │   ├── card.schema.ts
│   │   ├── civilization.schema.ts
│   │   ├── tech.schema.ts
│   │   ├── faction.schema.ts
│   │   ├── relation.schema.ts
│   │   ├── timeline.schema.ts
│   │   ├── character-detail.schema.ts
│   │   └── shared.schema.ts
│   ├── ui/                          #   shadcn/uiプリミティブ
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   ├── validators/                  #   実行時データ検証
│   └── invariants/                  #   クロスデータ整合性チェック
│
├── metal/                           # ハードウェア最接近層 (2.3K行)
│   ├── wasm-bridge.ts               #   WASMバトルエンジンブリッジ (148KB .wasm)
│   ├── binary-protocol.ts           #   TLVバイナリシリアライズ (VarInt + CRC32)
│   ├── service-worker.ts            #   Service Workerマネージャ (オフライン対応)
│   ├── service-worker-registration.ts
│   └── workers/                     #   Web Worker並列化
│       ├── battle-worker.ts         #     バトル計算Worker
│       ├── battle-worker-client.ts  #     クライアントラッパー
│       └── worker-pool.ts           #     ジェネリックWorkerプール (Transferable対応)
│
├── app/                             # Next.js App Router — 薄い合成層 (26ルート, 9K行)
│   ├── layout.tsx                   #   ルートレイアウト (navigation + metadata)
│   ├── page.tsx                     #   ホームページ
│   ├── _components/                 #   ホーム専用コンポーネント (hero, sections, cards)
│   ├── wiki/                        #   百科事典 (SSG)
│   ├── story/[slug]/                #   小説読者 (SSG + ISR 1h)
│   ├── card-game/                   #   PvEデッキ構築 + バトル (CSR)
│   ├── characters/                  #   キャラクターTier表
│   ├── civilizations/               #   5大文明圏 (×5 詳細ページ)
│   └── ...                          #   各コンテンツページ
│
├── lib/                             # レガシー後方互換ユーティリティ
│   ├── data/                        #   データアクセス統合層 (wiki.ts, cards.ts)
│   ├── stores/                      #   Zustand stores (battle-store, deck-store)
│   ├── utils.ts                     #   汎用ユーティリティ (cn, etc.)
│   ├── lang.ts                      #   EN/JP言語ユーティリティ
│   └── ...                          #   各種データファイル (後方互換用)
│
├── types/                           # 型定義 (barrel export)
├── hooks/                           #   カスタムReact Hooks (use-toast)
└── _infra/                          # ビルド時インフラ (validate-data, pack-data)

crates/edu-battle-engine/            # Rust WASMバトルエンジン (806行)
├── src/
│   ├── lib.rs                       #   WASMエクスポート関数
│   ├── combat.rs                    #   ダメージ計算・敵AI・フェーズ遷移
│   └── types.rs                     #   型定義
└── Cargo.toml
```

### AGENTS.md Protocol

本リポジトリはAIエージェントによる自律開発を前提とした**AGENTS.mdプロトコル**を採用しています。

```
AIエージェント実行フロー:
1. ルート AGENTS.md を読む (アーキテクチャ全体を把握)
2. タスクの対象ドメインを特定
3. 対象ドメインの AGENTS.md のみを読む (他ドメインは読まない)
4. 変更 → テスト → 型チェック → ビルド
```

| AGENTS.md        | 所在地                         | 対象範囲           |
| ---------------- | ------------------------------ | ------------------ |
| ルート AGENTS.md | `/AGENTS.md`                   | アーキテクチャ全体 |
| Wiki ドメイン    | `src/domains/wiki/AGENTS.md`   | Wikiデータ + 検索  |
| Battle ドメイン  | `src/domains/battle/AGENTS.md` | バトルエンジン     |
| Platform         | `src/platform/AGENTS.md`       | 共有基盤           |

---

## Project Overview

**EDU (Eternal Dominion Universe)** は、gentaronが創作するオリジナルSF世界観「E16連星系」をWeb上で体験できるインタラクティブ百科事典兼カードバトルゲームアプリです。ドメインクラスタアーキテクチャに基づく型安全なデータフローにより、各ドメインの独立開発・拡張を可能にし、AIエージェントによる自律的なコンテンツ生成とコード保守を実現しています。

### 特徴

| カテゴリ            | 内容                                                               |
| ------------------- | ------------------------------------------------------------------ |
| **百科事典 (Wiki)** | 285+項目（キャラクター94、組織47、地理49、技術48、用語26、歴史21） |
| **小説 (Story)**    | 5章22話の連作小説。EN/JP言語切替対応。ビルド時生成 + ISR 1h        |
| **カードゲーム**    | 76体のキャラクターカード + 10種の敵によるPvEターン制バトル         |
| **文明圏**          | 宇宙5大文明 + その他文明 + 文明指導者                              |
| **年表**            | AD3500〜E528の統合年表                                             |
| **長者番付**        | E16経済圏の富豪ランキング                                          |
| **技術体系**        | 7つのコア技術の物理学的解説                                        |

### デプロイ

- **Netlify** (@netlify/plugin-nextjs) でホスティング
- ISR (Incremental Static Regeneration) で小説コンテンツを1時間ごとに更新
- CI/CD: GitHub Actions + Husky (lint-staged + pre-commit hooks)
- pre-commit: ESLint 9 + Prettier + TypeScript型チェック (tsc --noEmit)

---

## Content Inventory

### Pages (26 routes)

| ルート                  | 内容                                 | 方式         |
| ----------------------- | ------------------------------------ | ------------ |
| `/`                     | ホーム — 全セクションへの導線        | SSG          |
| `/wiki`                 | 百科事典一覧（285+項目）             | SSG          |
| `/wiki/[id]`            | 項目詳細ページ（リンク網・指導者歴） | SSG          |
| `/story`                | 小説一覧（22話）                     | SSG          |
| `/story/[slug]`         | 小説全文（EN/JP切替・章TOC）         | SSG + ISR 1h |
| `/characters`           | キャラクターTier表（勢力別一覧）     | SSG          |
| `/card-game`            | カード一覧                           | CSR          |
| `/card-game/select`     | デッキ構築（76枚から5枚選択）        | CSR          |
| `/card-game/battle`     | PvEバトル（4階級10種の敵）           | CSR          |
| `/universe`             | 宇宙構造・星系データ                 | SSG          |
| `/civilizations`        | 5大文明圏一覧                        | SSG          |
| `/civilizations/[name]` | 各文明の詳細ページ (×5)              | SSG          |
| `/timeline`             | 統合年表                             | SSG          |
| `/auralis`              | AURALIS Collective 記録              | SSG          |
| `/mina`                 | ミナ・エウレカ・エルンスト           | SSG          |
| `/iris`                 | アイリス キャラクター詳細            | SSG          |
| `/liminal`              | リミナル・フォージ                   | SSG          |
| `/factions`             | 勢力系譜                             | SSG          |
| `/technology`           | 技術体系                             | SSG          |
| `/ranking`              | 世界長者番付                         | SSG          |

### Data Sources

| パス                                      | 項目数 | 内容                                      |
| ----------------------------------------- | ------ | ----------------------------------------- |
| `src/domains/wiki/`                       | 285+   | Wiki百科事典 (6カテゴリ × 6dataファイル)  |
| `src/domains/cards/player-cards.*`        | 76     | キャラクターカード (C/R/SRレアリティ)     |
| `src/domains/cards/enemies.ts`            | 10     | 敵データ (NORMAL/HARD/BOSS/FINAL)         |
| `src/domains/stories/stories.meta.ts`     | 22     | 小説メタデータ (slug, title, chapter)     |
| `src/domains/civilizations/civ-*.data.ts` | 11+    | 文明データ (top/other/historical/leaders) |

> 小説本文はビルド時に `gentaron/edutext` (GitHub raw) からフェッチし、ISRでキャッシュ更新。

### Content Pipeline

```
gentaron/edutext (raw .txt)
       ↓  build time fetch
src/app/story/[slug]/page.tsx (SSG + ISR 1h)
```

- JP原典: `filename.txt` → EN翻訳: `filename_EN.txt`
- EN原典: `filename.txt` → JP翻訳: `filename_JP.txt`
- `getStoryUrlForLang()` / `getStoryTitle()` で言語切替

---

## Card Game System

PvEターン制カードバトル。76枚のキャラクターカードから5枚を選択し、4階級10種の敵と戦います。バトルエンジンはRustで実装されWASMとしてコンパイル（148KB）され、ブラウザ上で高速に動作します。

### システム構成

| 要素             | 詳細                                                          |
| ---------------- | ------------------------------------------------------------- |
| **デッキ**       | 76枚から5枚選択（C/R/SRレアリティ）                           |
| **バトル**       | 5体全員フィールド常駐、ターン制アビリティ選択                 |
| **敵階級**       | NORMAL / HARD / BOSS / FINAL（4階級10種）                     |
| **WASMエンジン** | Rust→WASM (148KB) — ダメージ計算・敵AI・フェーズ遷移          |
| **状態管理**     | `domains/battle/store/` + localStorage永続化                  |
| **FSM制御**      | `domains/battle/fsm/` — 汎用HSM + BattleHSM                   |
| **Canvas描画**   | FrameBudget (16.67ms) + SpriteBatch + ParticleEmitter         |
| **エフェクト**   | ParticleBurst, SlashEffect, ShieldDome, HealWave, ScreenFlash |

---

## Universe Setting

**E16連星系**（M104ソンブレロ銀河ハロー）。人類は4つの銀河団を経由して定住した。

**主要勢力**: AURALIS Collective / ZAMLT / Trinity Alliance / Alpha Venom / V7 / Shadow Rebellion / Liminal Forge

**タイムライン**: E1（創世）→ E528+（現代） — AD3500〜E528の統合年表を収録

**8つの思想地層 (Epoch 9で導入)**:

| 層  | 名称           | 傾向 | 説明                             |
| --- | -------------- | ---- | -------------------------------- |
| D1  | 超未来第一主義 | 闇   | 未来の技術による現代の支配       |
| D2  | 安全の監視者   | 闇   | 監視社会による安全保障           |
| D3  | 国家=株式会社  | 闇   | 国家運営の企業化                 |
| D4  | 倫理の解除     | 闇   | 道徳制約の撤廃による「自由」     |
| D5  | 脱人間化       | 闇   | 人体改造・意識転送による脱人間化 |
| L1  | 防衛的加速主義 | 光   | d/acc — 技術による防衛的加速     |
| L2  | 多元性民主主義 | 光   | Plurality — 多元的な民主主義     |
| L3  | 第2のゲーム    | 光   | Game B — 新しい社会ゲームの創造  |

---

## Tech Stack

| カテゴリ             | 技術                                            |
| -------------------- | ----------------------------------------------- |
| **Framework**        | Next.js 16 (App Router)                         |
| **Language**         | TypeScript 5 (strict, noUncheckedIndexedAccess) |
| **Styling**          | Tailwind CSS v4 + tw-animate-css                |
| **UI Components**    | shadcn/ui (Radix primitives)                    |
| **Animation**        | Framer Motion 12                                |
| **State Management** | Zustand 5                                       |
| **Validation**       | Zod 4                                           |
| **ORM**              | Prisma 6                                        |
| **WASM Engine**      | Rust (wasm-pack, 148KB .wasm)                   |
| **Testing**          | Vitest 4 + Testing Library                      |
| **Linting**          | ESLint 9 + Prettier                             |
| **Git Hooks**        | Husky + lint-staged                             |
| **CI/CD**            | GitHub Actions                                  |
| **Deployment**       | Netlify (@netlify/plugin-nextjs)                |
| **Runtime**          | Bun                                             |

---

## Development

### Commands

```bash
bun dev              # 開発サーバー :3000
bun run build        # 本番ビルド（静的HTML生成 + tsc --noEmit）
bun start            # 本番サーバー起動
bun test             # Vitest テスト実行
bun run test:watch   # ウォッチモード
bun run test:ui      # Vitest UI
bun run lint         # ESLint + Prettier
bun run db:push      # Prisma DB同期
bun run db:seed      # シードデータ投入
```

### Contributing — Wiki Items

`src/domains/wiki/` の該当カテゴリファイルを編集:

```ts
{
  id: string,                              // 一意識別子（日本語OK）
  name: string,                            // 表示名
  nameEn?: string,                         // 英語名
  category: "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史",
  subCategory?: string,                    // サブカテゴリ
  description: string,                     // 詳細説明（Wikiリンク: [[項目名]] 記法対応）
  era?: string,                            // 活動時代
  affiliation?: string,                    // 所属勢力
  tier?: string,                           // Tier (S/A/B/C)
  image?: string,                          // 画像URL (gentaron/image)
  sourceLinks?: { url: string; label: string }[],  // 外部リンク
  leaders?: { id: string; name: string; nameEn?: string; role: string; era?: string }[]
}
```

### Contributing — Stories

1. JP `.txt` を `gentaron/edutext` に追加
2. EN `_EN.txt` 翻訳を作成
3. `src/domains/stories/stories.meta.ts` にメタデータを登録

### Contributing — Artwork

[gentaron/image](https://github.com/gentaron/image) にPNGをpushし、データの `image` フィールドを更新。

画像命名規則: 英語名PascalCase（例: `MinaEurekaErnst.png`）· 400×400px以上· 正方形推奨

---

## Quality Standards

| 指標                           | 目標                            |
| ------------------------------ | ------------------------------- |
| TypeScript strict mode         | 有効 (noUncheckedIndexedAccess) |
| `any` 型                       | 禁止                            |
| `eslint-disable`               | 禁止                            |
| Zodスキーマ検証                | ビルド時実行                    |
| テスト                         | 全17テスト通過                  |
| LCP (Largest Contentful Paint) | 1.5秒以下                       |
| バトルアニメーション           | 60fps                           |
| ページバンドルサイズ           | 100KB以下                       |

---

## Multi-Repository Ecosystem

| Repo                                                    | 役割                        | AI編集権限 |
| ------------------------------------------------------- | --------------------------- | ---------- |
| [gentaron/edu](https://github.com/gentaron/edu)         | メインアプリ (本リポジトリ) | 直接編集   |
| [gentaron/edutext](https://github.com/gentaron/edutext) | 小説本文 (JP/EN .txt)       | 直接編集   |
| [gentaron/image](https://github.com/gentaron/image)     | キャラクターアートワーク    | 指示のみ   |
| [gentaron/edunft](https://github.com/gentaron/edunft)   | NFTカードメタデータ         | —          |
| [gentaron/edu-agi](https://github.com/gentaron/edu-agi) | AGENTS.md 管理リポジトリ    | —          |

---

## Development History — Full Technical Changelog

> 本セクションは、プロジェクトの全履歴をEpoch単位で技術的に詳細に記録したものです。各Epochのアーキテクチャ変更、ファイル操作、テスト状況を比較可能な形式でまとめています。
>
> **総コミット数**: 149 | **期間**: 2026/04/12 — 2026/05/01 (20日) | **総差分**: 69,661 insertions / 126,410 deletions

---

### Epoch 0: Foundation (2026/04/12–20)

**期間**: 9日 | **コミット**: ~25 | **焦点**: プロジェクト初期構築・Wiki百科事典の構築

このEpochはプロジェクトの基盤を築いた期間です。SF世界観「E16連星系」のWiki百科事典を中心に、基本的なWebアプリケーションを構築しました。

**主要な作業内容**:

| 日付  | 変更内容                                                                                                                                                   |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04/12 | プロジェクト初回コミット。Next.js + TypeScript + Tailwind CSSの基本構成                                                                                    |
| 04/20 | **Wiki 115項目構築** — 全用語・キャラクター・地名・戦争・技術を網羅的に追加                                                                                |
| 04/20 | Wiki画像追加 — Kate Claudia, Lily Steiner, ミナ, レイラ等のキャラクター画像を [gentaron/image](https://github.com/gentaron/image) からGitHub raw URLで参照 |
| 04/20 | Wiki個別ページ化 — 全204エントリを `/wiki/[id]` の動的ルートで個別表示。一覧をカード表示に変更                                                             |
| 04/20 | **E16所在設定の確定** — カシオペア矮小銀河の言及を全ページから削除し、M104ソンブレロ銀河ハローに統一                                                       |
| 04/20 | canonical narrative structure導入 — Core/Sub lore source links                                                                                             |
| 04/20 | 初代Kate/Lillieの正しい名前に修正（Kate Claudia / Lily Steiner）                                                                                           |
| 04/21 | **小説サイト構築** — raw .txtリンクを全文表示Storyページに置き換え                                                                                         |
| 04/21 | **初版カードゲーム実装** — xstateステートマシン + Prisma schema (Card, Deck, Match等) + seed data                                                          |

**Epoch 0終了時のメトリクス**:

- Wiki: 204エントリ
- Story: .txt全文表示（静的リンク）
- カードゲーム: xstate + Prisma（初期PvP構想）
- 画像: ローカルPNG → GitHub raw URL参照に移行完了

---

### Epoch 1: Game Systems & Content Expansion (2026/04/21–22)

**期間**: 2日 | **コミット**: ~20 | **焦点**: カードゲーム再設計・DevOps導入

**主要な作業内容**:

| 日付  | 変更内容                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------ |
| 04/21 | **PvEカードゲーム追加** — PvP構想からドラゴン等エネミーとのターン制PvEへ設計変更                                         |
| 04/21 | **カードゲーム全書き換え** — 既存25枚カードを削除し、Wiki全64キャラをキャラクターカードとして再構成                      |
| 04/21 | **3画面構成への再設計** — カード一覧 → デッキ構築(5枚選択) → PvEバトルの3画面に分離。敵10種(NORMAL/HARD/BOSS/FINAL)      |
| 04/21 | Wikiキャラクター55体の画像リンク追加 ([gentaron/image](https://github.com/gentaron/image)からの参照)                     |
| 04/22 | **フィールド制バトルシステム** — 順番制から全5体フィールド常駐方式へ変更。ボス強化 + エフェクト進化                      |
| 04/22 | **DevOps導入** — CI (GitHub Actions)、テスト(Vitest)、エラートラッキング(Sentry)、pre-commit hooks (Husky + lint-staged) |
| 04/22 | `.env`履歴からの削除 + WebSocket auth強化 + rate limit導入                                                               |
| 04/22 | **ストーリーページの章別構成化 + UI大幅リニューアル** — 読書体験を小説ライクに改善                                       |
| 04/22 | PR #1 マージ: feature/card-game → main                                                                                   |

**技術的変更点**:

- バトル方式: 順番制(1体ずつ行動) → **フィールド制**(5体全員常駐)
- カード種類: 汎用カード25枚 → **キャラクターカード64枚**(Wikiデータからの自動生成)
- Prisma導入: Card, Deck, DeckCard, Match, MatchPlayer, TurnLogモデル
- セキュリティ: `.env`履歴削除 + WebSocket auth + rate limiting

---

### Epoch 2: Universe Expansion (2026/04/27–28)

**期間**: 2日 | **コミット**: ~8 | **焦点**: 宇宙規模への拡大・多言語対応

**主要な作業内容**:

| 日付  | 変更内容                                                                               |
| ----- | -------------------------------------------------------------------------------------- |
| 04/25 | 全宇宙版へ拡大 — E16以外の惑星・勢力を追加                                             |
| 04/27 | **eduuni.txt統合** — 宇宙勢力ランキング8文明・歴史的戦争・新キャラ9名を一括追加        |
| 04/27 | **宇宙5大文明圏ページ作成** — `/civilizations` + 各文明詳細ページ(×5)を新規作成        |
| 04/27 | 5大文明圏を年表・資産額ランキングに統合                                                |
| 04/27 | wiki-data重複整理 — 225行削減                                                          |
| 04/27 | アポロン・ドミニオン大戦タイムライン修正（E370-E385に統一）                            |
| 04/28 | edutext翻訳ファイル追加                                                                |
| 04/28 | **Story EN/JP言語切替有効化** — JP原典にEN翻訳、EN原典にJP翻訳のビルド時フェッチ + ISR |
| 04/28 | Story UI刷新 — novel-like reading体験、行間改善                                        |

**技術的変更点**:

- コンテンツ規模: E16単一惑星 → **全宇宙規模**(複数銀河・惑星・文明)
- Storyパイプライン: 静的リンク → **ビルド時フェッチ + ISR 1h** + EN/JP切替
- 新ページ: `/civilizations`, `/civilizations/[name]` (×5)

---

### Epoch 3: Great Cleanup & Modernization (2026/04/28)

**期間**: 1日 | **コミット**: ~15 | **焦点**: ona.laインスパiredモダナイゼーション・大規模削除

このEpochはプロジェクトの**最大規模の削除**を実施した期間です。ona.la / yuimarudev の分析に基づくデザインモダナイゼーションを行いました。

**主要な作業内容**:

| 日付  | 変更内容                                                                                        |
| ----- | ----------------------------------------------------------------------------------------------- |
| 04/28 | **ona.la-inspiredデザインモダナイゼーション**                                                   |
| 04/28 | **大規模クリーンアップ: 284K行・55パッケージ・44未使用UIコンポーネントを削除**                  |
| 04/28 | **全105項目に英語名追加** — nameEnフィールドの付与                                              |
| 04/28 | Wiki用語リンク修正 — isEmbeddedInWord関数でひらがな助詞(の/に/で等)で繋がれた用語の誤リンク解消 |
| 04/28 | ZAMLT・エレシュ・プロキオ・ロースターの網羅的拡充                                               |
| 04/28 | Wiki重複エントリ統合・短項目拡充・指導者歴代追加・リンクネットワーク修復                        |
| 04/28 | MODERNIZATION_ROADMAP.md作成 — ona.la/yuimarudev分析 & 10-step移行計画                          |
| 04/28 | IMPLEMENTATION_PROMPTS.md作成 — テックスタック移行プロンプト                                    |

**削除規模の詳細**:

- **284,000行**のソースコード削除
- **55パッケージ**の依存関係削除
- **44 UIコンポーネント**の未使用ファイル削除
- サブモジュール参照の完全除去（Netlifyビルドエラー解消）

---

### Epoch 4: Feature Completion & AI DevOps (2026/04/29)

**期間**: 1日 | **コミット**: ~12 | **焦点**: Wiki拡充・AGENTS.md導入・メインページ分割

**主要な作業内容**:

| 日付  | 変更内容                                                                                                                                                          |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04/29 | Wiki説明文内リンク誤ブロック修正                                                                                                                                  |
| 04/29 | **Wiki項目に歴代指導者セクション追加** — 全共同体（文明/組織/国家/企業）43エントリに `leaders` フィールド追加。新指導者7名作成（ファランクス/セルヴァ・ドーン等） |
| 04/29 | `/wiki/[id]` ページに「歴代指導者」セクション実装（アイコン/役職/時代/リンク付）                                                                                  |
| 04/29 | **EDU全面最適化 Phase 1-5**                                                                                                                                       |
| 04/29 | **AGENTS.md追加** (v1.0.0) — AI開発ルールベース                                                                                                                   |
| 04/29 | **メインページ分割: 2,785行→360行** — 単一巨大コンポーネントを9つの独立ページに分離                                                                               |
| 04/29 | **Nexus組織・人物相関AI解析ページ追加** — Gemini API連携（後のEpoch 6で削除）                                                                                     |
| 04/29 | ファビコン変更 (CeliaDominix)                                                                                                                                     |

**技術的変更点**:

- AGENTS.md v1.0.0導入 — AIエージェントによる開発ルールの標準化
- メインページ分割: 2785行のモノリス → 360行 + 9独立ページ
- 新データフィールド: `leaders[]` (歴代指導者セクション)

---

### Epoch 5: Refactoring Sprint — 8 Phases (2026/04/29)

**期間**: 1日 | **コミット**: 14 | **焦点**: AI開発最適化・コード分割・コンポーネント分離

このEpochは、AIエージェントが効率的にコードを理解・変更できるよう、**体系的なリファクタリング**を実施した期間です。8フェーズに分けて段階的に実行されました。

| Phase    | 内容                                                   | 変更ファイル |
| -------- | ------------------------------------------------------ | ------------ |
| Phase 1  | 型定義を `src/types/` に集約（6ファイル）              | 6 files      |
| Phase 2  | wiki-data.ts → wiki-data/ ディレクトリ（6カテゴリ別）  | 8 files      |
| Phase 3  | card-data.ts → card-data/ ディレクトリ分割             | 5 files      |
| Phase 4  | civilization-data.ts → civilization-data/ ディレクトリ | 5 files      |
| Phase 5  | game-store.ts → stores/ ディレクトリ分割               | 4 files      |
| Phase 6a | battle/page.tsx コンポーネント分離                     | 3 files      |
| Phase 6b | home page.tsx コンポーネント分離                       | 4 files      |
| Phase 6c | ranking/page.tsx コンポーネント分離                    | 3 files      |
| Phase 6d | nexus/page.tsx ユーティリティ分離                      | 2 files      |
| Phase 6e | story-reader-ui.tsx コンポーネント分離                 | 3 files      |
| Phase 7  | Nexus Gemini API呼び出しをサーバー経由API Routeに変更  | 3 files      |
| Phase 8  | AGENTS.md + README.md ドキュメント更新                 | 2 files      |

**リファクタリングの方針**:

- **単一責任の原則**: 1ファイルの上限を400行以下に抑える
- **ドメイン別分離**: wiki/card/civilization/battle/storyのデータとロジックを独立ディレクトリに
- **コンポーネント粒度**: ページコンポーネントからUIコンポーネント・データアクセス・ユーティリティを分離
- **API Route化**: クライアント直接API呼び出し → サーバー経由API Route

---

### Epoch 6: Nexus Removal & Stabilization (2026/04/29–30)

**期間**: 2日 | **コミット**: ~5 | **焦点**: 外部依存排除・安定化

**主要な作業内容**:

| 日付  | 変更内容                                                                         |
| ----- | -------------------------------------------------------------------------------- |
| 04/29 | **Nexusページ完全削除** — 外部Gemini API依存を排除。AI解析機能をアプリから除去   |
| 04/30 | **EDU UI 最先端進化 — 8フェーズ完全実装**                                        |
| 04/30 | 不要物削除 + 3リポジトリ連携自動化                                               |
| 04/30 | **Wiki一覧をカテゴリサマリーに再設計** — 全項目表示からカテゴリ別サマリー表示へ  |
| 04/30 | 背景UIシンプル化                                                                 |
| 04/30 | Wiki大幅拡充 + 技術ガチ物理化（7つのコア技術を物理学整合的に解説）+ ナビバグ修正 |

**技術的変更点**:

- 外部API完全除去 — Gemini API連携を削除し、自己完完型アプリへ
- Wiki一覧UI: 全項目フラット表示 → **カテゴリ別サマリー** (各カテゴリの代表項目 + カウント)
- 技術解説の物理学的厳密化 — 7つのコア技術（量子バイオバンク、次元ピラミッド等）を現実の物理学に整合するよう書き換え

---

### Epoch 7: TCP/IP 7-Layer Architecture (2026/04/30)

**期間**: 1日 | **コミット**: 2 | **焦点**: アーキテクチャの全面的再設計

このEpochは、OSI参照モデルに着想を得た**TCP/IP 7層アーキテクチャ**を導入し、全ソースコードの物理的な配置を変更した大型リファクタリングです。

**導入したレイヤー構造**:

| レイヤー        | ディレクトリ           | 責務                                               |
| --------------- | ---------------------- | -------------------------------------------------- |
| L0 Metal        | `src/l0-metal/`        | WASM, Binary Protocol, Service Worker, Web Workers |
| L1 Physical     | `src/l1-physical/`     | 物理/永続データ (wiki, cards, civilizations)       |
| L2 Data Link    | `src/l2-datalink/`     | データ形式・スキーマ (Zod schemas)                 |
| L3 Network      | `src/l3-network/`      | Repository + Search                                |
| L4 Transport    | `src/l4-transport/`    | イベントバス + 状態管理                            |
| L5 Session      | `src/l5-session/`      | バトルFSM + HSM                                    |
| L6 Presentation | `src/l6-presentation/` | UIコンポーネント + ナビゲーション                  |
| L7 Application  | `src/l7-application/`  | ページコンポジション + API Routes                  |
| Infrastructure  | `src/_infra/`          | ビルド時スクリプト (validate, pack)                |

**実装フェーズ**:

| Phase | 内容                                         | コミット  |
| ----- | -------------------------------------------- | --------- |
| 1-3   | L1-L6のディレクトリ構築 + データ移動 + index | `1e68fcd` |
| 4     | README.md全面整備 + ARCHITECTURE.md作成      | `5884475` |

**アーキテクチャ設計思想**:

- 各レイヤーは**上位レイヤーのみに依存**（下位レイヤーを知らない）
- 同一レイヤー内のモジュール間は直接インポート禁止（イベントバス経由で通信）
- `_infra/`はビルド時のみ実行されるスクリプトで、ランタイムには含まれない

> **注**: この7層構造はEpoch 9でドメインクラスタアーキテクチャに移行し、L0-L7は後方互換ラッパーとして残存しています。

---

### Epoch 8: Project Prometheus — Max Tech Level (2026/04/30)

**期間**: 1日 | **コミット**: 1 (超大規模) | **焦点**: テックレベルの最大化

このEpochはプロジェクト史上最大の**技術的飛躍**です。Rust×WASM、Canvas 2Dレンダラー、BM25全文検索、HSMフレームワーク、PBT、Web Workers、Service Workerという、フロントエンドエンジニアリングの高度な技術を一気に導入しました。

**8フェーズの全容**:

| Phase    | 実装内容                                             | テスト数 | テクスコア | コミット  |
| -------- | ---------------------------------------------------- | -------- | ---------- | --------- |
| 1        | **Rust → WASM バトルエンジン** (148KB)               | 9        | +10.5      | `d781594` |
| 2        | **TLVバイナリシリアライズ** (VarInt + CRC32)         | 55       | +4.0       | (同上)    |
| 3        | **Canvas 2Dレンダラー** (FrameBudget + SpriteBatch)  | 95       | +5.3       | (同上)    |
| 4        | **BM25転置インデックス全文検索** + Trie autocomplete | 64       | +3.8       | (同上)    |
| 5        | **汎用HSMフレームワーク** (Graphviz DOT export)      | 57       | +0.0       | (同上)    |
| 6        | **fast-check PBT** (9プロパティ)                     | 36       | +0.8       | (同上)    |
| 7        | **Web Worker並列化** (WorkerPool + Transferable)     | 26       | +3.0       | (同上)    |
| 8        | **Service Worker** (3キャッシュ戦略)                 | 15       | +0.0       | (同上)    |
| **合計** | **397テスト / 重み付きスコア 45.8pt**                | **397**  | **+27.4**  |           |

#### Phase 1: Rust → WASM バトルエンジン (148KB)

Rustで純粋関数としてバトルエンジンを実装し、`wasm-pack`でWASMにコンパイル。TypeScriptから`wasm-bridge.ts`経由で呼び出します。

```
Rust (crates/edu-battle-engine/)
├── lib.rs       — WASMエクスポート関数
├── combat.rs    — ダメージ計算・敵AI・フェーズ遷移・全バトルシミュレーション
└── types.rs     — 型定義 (Character, Enemy, BattleState, BattlePhase)
    ↓ wasm-pack build --target web
public/wasm/edu_battle_engine.js + .wasm (148KB)
```

- **純粋関数**: 副作用なし、全状態を引数で受け取る
- **9テスト**: ダメージ計算整合性、フェーズ遷移、全員不能検出、敗北/勝利判定
- **148KB**: wasm-opt最適化済みの小型バイナリ

#### Phase 2: TLVバイナリシリアライズ + CRC32

VarInt (LEB128) + CRC32 + BinaryWriter/Reader/Encoder/BinaryIndexによる効率的なバイナリエンコード。`public/data/wiki.edu` (550項目, 563KB) の生成スクリプトも含みます。

- **VarInt**: LEB128可変長整数エンコーディング
- **CRC32**: データ整合性チェック
- **TLV**: Type-Length-Value形式のバイナリプロトコル
- **55テスト**: エンコード/デコードの往返同一性、境界値、CRC検出

#### Phase 3: Canvas 2Dレンダラー

FrameBudget (16.67ms/60fps監視) + TextureAtlas + SpriteBatch + CardSprite/EnemySprite + ParticleEmitter (5プリセット: burst, slash, heal, shield, screenFlash) + AnimationTimeline (6種easing関数)。

- **95テスト**: スプライト描画、パーティクル寿命、フレームバジェット遵守、アニメーション補間

#### Phase 4: BM25転置インデックス全文検索

bi-gramトークナイザ + BM25スコアリング + Trie autocomplete + WikiSearchEngine (カテゴリ重みブースティング付き)。

- **64テスト**: 転置インデックス構築、BM25スコア計算、autocomplete候補順序、カテゴリフィルタ

#### Phase 5: 汎用HSMフレームワーク

SCXMLサブセットの階層状態マシン (HSM) フレームワーク。階層状態・ガード条件・遷移アクション・履歴状態 (shallow/deep) をサポート。Graphviz DOT export機能により、状態遷移図の可視化が可能です。

- **57テスト**: 状態遷移、ガード評価、履歴状態、DOT出力の構文正当性
- **BattleHSM**: バトルの全状態遷移をHSMで形式化

#### Phase 6: fast-check プロパティベースドテスト (PBT)

9つのプロパティをfast-checkで検証:

1. HPは常に非負
2. ダメージは攻撃力の範囲内
3. FSMは任意の状態から終了状態に到達可能
4. バトルは有限ステップで終了
5. バイナリエンコード/デコードの往返同一性
6. 検索結果の整合性
7. 転置インデックスの単調性
8. WorkerPoolのタスクリターン
9. CRC32の衝突耐性

- **36テスト**: 100回×9プロパティのランダム入力で不変量を検証

#### Phase 7: Web Worker並列化

WorkerPool (Transferable Objects対応) + BattleWorkerClient。バトル計算をメインスレッドから分離し、UIのブロッキングを防止します。

- **26テスト**: Worker起動/終了、メッセージ往返、Transferable転送、プールサイズ管理

#### Phase 8: Service Worker

`public/sw.js` で3つのキャッシュ戦略を実装:

| 戦略                   | 対象                       |
| ---------------------- | -------------------------- |
| Cache-First            | 静的アセット (JS/CSS/WASM) |
| Stale-While-Revalidate | HTMLページ                 |
| Network-First          | APIレスポンス              |

- **15テスト**: キャッシュヒット/ミス、戦略選択、有効期限管理

---

### Epoch 9: Domain Cluster Migration × Philosophy Integration (2026/05/01)

**期間**: 1日 | **コミット**: 5 | **焦点**: アーキテクチャ移行・SF世界観の深化

このEpochは、TCP/IP 7層アーキテクチャから**ドメインクラスタアーキテクチャ**への移行と、SF世界観に**8つの思想地層**を統合した大型アップデートです。4フェーズ + 補完コミットで実行されました。

#### Phase 1: Wiki項目名改変

15項目のWikiエントリを一般名詞から**SF固有名詞**に変更。30ファイルにわたる全参照を一括置換しました。

| 旧id                     | 新id                     | 新nameEn                 |
| ------------------------ | ------------------------ | ------------------------ |
| 企業国家                 | コーポラトクラシー       | Corporatocracy           |
| 名の継承制度             | クロニクル・ネーム       | Chronicle Name           |
| 戦士決定戦               | スティル・アレーナ       | Steel Arena              |
| ジマ・オイル             | アビサル・ドレイン       | Abyssal Drain            |
| 空間ホール               | ホライゾン・ゲート       | Horizon Gate             |
| 次元ピラミッド           | 次元階梯パンディクト     | Pandict Dimension Ladder |
| 搾取生物                 | リーチ・ドレイン         | Leechdrain               |
| プライマリー・フィールド | オルタ・フィールド       | Altera Field             |
| トゥキディデスの罠       | ヘゲモニー・パラドックス | Hegemony Paradox         |
| ラブマーク               | シギル・アフェクト       | Sigil Affect             |
| 精子レジストリ           | ジーン・カタログ         | Gene Catalogue           |
| 量子バイオバンク         | クロマ・アーカイブ       | Chroma Archive           |
| 量子ファイナンス・コア   | オムニバス・エンジン     | Omnibus Engine           |
| ナノセル・インプラント   | セル・ウィーヴ           | Cell Weave               |
| 時相放送                 | クロノキャスト           | Chronocast               |

**コミット**: `9641560` | **変更**: 30ファイル

#### Phase 2: 思想統合 — 8地層 × 15項目

15項目のWiki `description` 末尾に、SF世界観の**8つの思想地層**（闇5層 + 光3層）に基づく哲学段落を追記しました。

**闇の地層**:
| 層 | 名称 | 代表組織/技術 |
|---|---|---|
| D1 | 超未来第一主義 | ZAMLT, 次元階梯パンディクト |
| D2 | 安全の監視者 | Shadow Rebellion, Alpha Kane |
| D3 | 国家=株式会社 | コーポラトクラシー, コーポラトムパブリカ |
| D4 | 倫理の解除 | Eros-7 |
| D5 | 脱人間化 | ペルセポネ, ナノセル・インプラント, クオリア・コア |

**光の地層**:
| 層 | 名称 | 代表組織/技術 |
|---|---|---|
| L1 | 防衛的加速主義 (d/acc) | AURALIS Collective, セリア黄金期 |
| L2 | 多元性民主主義 (Plurality) | UECO, nトークン経済, 銀河系コンソーシアム |
| L3 | 第2のゲーム (Game B) | テクノ文化ルネサンス, セリア黄金期 |

**コミット**: `16fe05b` | **変更**: 15項目 × 2ファイル (data + legacy)

#### Phase 3: ドメインクラスタアーキテクチャ移行

TCP/IP 7層（L0-L7）から**ドメインベース構造**への全面的移行。旧レイヤーは削除し、`domains/` + `platform/` + `metal/` の3層に再編しました。

**移行マッピング**:

| 旧パス                                   | 新パス                                |
| ---------------------------------------- | ------------------------------------- |
| `src/l1-physical/wiki/`                  | `src/domains/wiki/`                   |
| `src/l1-physical/cards/`                 | `src/domains/cards/`                  |
| `src/l1-physical/civilizations/`         | `src/domains/civilizations/`          |
| `src/lib/battle-logic.ts`                | `src/domains/battle/battle.engine.ts` |
| `src/l5-session/battle-fsm.ts`           | `src/domains/battle/battle.fsm.ts`    |
| `src/lib/stories.ts`                     | `src/domains/stories/stories.meta.ts` |
| `src/l4-transport/event-bus.ts`          | `src/platform/event-bus.ts`           |
| `src/l2-datalink/schemas/`               | `src/platform/schemas/`               |
| `src/components/ui/`                     | `src/platform/ui/`                    |
| `src/components/edu/navigation.tsx`      | `src/platform/navigation.tsx`         |
| `src/components/edu/reveal-section.tsx`  | `src/platform/reveal-section.tsx`     |
| `src/components/edu/motion-provider.tsx` | `src/platform/motion-provider.tsx`    |
| `src/components/edu/json-ld.tsx`         | `src/platform/json-ld.tsx`            |
| `src/l0-metal/`                          | `src/metal/`                          |
| `src/l3-network/repositories/`           | 各ドメインの `*.repository.ts`        |
| `src/l3-network/search/`                 | `src/domains/wiki/wiki-search.ts`     |

**削除した旧ディレクトリ** (Phase 3 補完で実施):

| 削除対象                     | ファイル数                       |
| ---------------------------- | -------------------------------- |
| `src/l0-metal/`              | 6 files                          |
| `src/l1-physical/`           | 4 files (indexのみ残存→後で削除) |
| `src/l2-datalink/`           | 6 files                          |
| `src/l3-network/`            | 6 files                          |
| `src/l4-transport/`          | 5 files                          |
| `src/l5-session/`            | 4 files                          |
| `src/l6-presentation/`       | 1 file                           |
| `src/l7-application/`        | 1 file                           |
| `src/components/edu/`        | 4 files                          |
| `src/components/ui/`         | 4 files                          |
| `src/lib/battle-logic.ts`    | 1 file                           |
| `src/lib/card-data/`         | 4 files                          |
| `src/lib/civilization-data/` | 5 files                          |
| `src/lib/schemas.ts`         | 1 file                           |
| `src/lib/stories.ts`         | 1 file                           |
| `src/lib/wiki-data/`         | 8 files                          |

**コミット**: `750c883` + `34a3143` (補完) | **変更**: 111ファイル (Phase 3) + 109ファイル (補完)

#### Phase 4: README.md全面更新

READMEをドメインクラスタアーキテクチャに合わせて全面書き換え。Development HistoryセクションをEpoch 1-9で構造化しました。

**コミット**: `6615462`

#### Phase 3 補完: 残ファイル確定・旧L層全削除

Phase 3で移行しきれなかった旧L層ファイルの完全削除と、platform/拡張（validators, invariants, json-ld, motion-provider, page-header, reveal-section）を実施。**109ファイル変更、12,948行削除**。

**コミット**: `34a3143`

---

## Architecture Evolution — Comparative View

アーキテクチャの変遷をEpoch間で比較した表です。

### ディレクトリ構造の変遷

| Epoch | ディレクトリ構造                                           | 特徴                                   |
| ----- | ---------------------------------------------------------- | -------------------------------------- |
| 0-2   | `src/lib/wiki-data.ts` + `src/app/`                        | フラットな単一ファイル構成             |
| 3     | 大規模削除後、最小限の構成に整理                           | 284K行削除                             |
| 4     | `src/lib/data/` + `src/types/` + `src/lib/stores/`         | 型定義とデータの分離開始               |
| 5     | `src/lib/*/` (6カテゴリディレクトリ) + `src/stores/`       | ドメイン別ディレクトリ分割             |
| 7     | **TCP/IP 7層** (`src/l0-metal/` 〜 `src/l7-application/`)  | レイヤー指向アーキテクチャ             |
| 8     | 7層 + `crates/edu-battle-engine/` (Rust WASM)              | 7層 + Metal層(Rust) + `_infra/`        |
| 9     | **ドメインクラスタ** (`domains/` + `platform/` + `metal/`) | ドメイン指向アーキテクチャ + AGENTS.md |

### データスケールの変遷

| Epoch | Wiki項目          | カード数            | 小説         | ページ数 | テスト  |
| ----- | ----------------- | ------------------- | ------------ | -------- | ------- |
| 0     | 115 → 204         | 0 → 25              | .txtリンク   | ~5       | 0       |
| 1     | 204               | 64 (キャラカード化) | .txt全文     | ~12      | 0       |
| 2     | 204+              | 64                  | 22話 (EN/JP) | ~18      | 0       |
| 3     | 285+ (拡充・統合) | 64                  | 22話         | ~18      | 0       |
| 4-5   | 285+              | 64                  | 22話         | ~22      | 0       |
| 7     | 285+              | 64                  | 22話         | ~24      | 0       |
| 8     | 285+              | 64                  | 22話         | ~24      | **397** |
| 9     | 285+ (15項目改変) | **76**              | 22話         | **26**   | **17**  |

### テスト戦略の変遷

| Epoch | テストフレームワーク     | テスト数 | テスト種別                       |
| ----- | ------------------------ | -------- | -------------------------------- |
| 1-7   | 導入なし                 | 0        | —                                |
| 8     | Vitest + fast-check      | 397      | Unit + PBT (9プロパティ)         |
| 9     | Vitest + Testing Library | 17       | Unit (wiki, stories, game-store) |

> Epoch 8の397テストの多くはRustテスト(9) + バイナリプロトコル(55) + Canvasレンダラー(95) + BM25(64) + HSM(57) + PBT(36) + Worker(26) + SW(15)で構成されていました。Epoch 9のドメイン移行でテストのインポートパスが更新され、17テストがアプリケーション層で通過しています。

### 主要技術導入のタイムライン

```
04/12  Next.js + TypeScript + Tailwind CSS (初期構成)
04/21  xstate (ステートマシン) → 後にHSMに進化
04/21  Prisma (ORM)
04/22  Vitest, Husky, lint-staged, Sentry
04/22  ESLint, Prettier (pre-commit hooks)
04/28  ISR (Incremental Static Regeneration)
04/29  AGENTS.md (AI開発ルールベース)
04/30  Zod (バリデーション)
04/30  Rust → WASM (バトルエンジン)
04/30  Canvas 2D (レンダラー)
04/30  BM25 + Trie (全文検索)
04/30  HSM (階層状態マシン)
04/30  fast-check (PBT)
04/30  Web Workers + Transferable
04/30  Service Worker (オフライン)
05/01  ドメインクラスタアーキテクチャ
05/01  AGENTS.md Protocol (ドメイン別)
```

---

## Metrics Summary

### コードベース規模 (Epoch 9 現在)

| 指標                 | 数値               |
| -------------------- | ------------------ |
| 総コミット数         | 149                |
| 開発期間             | 20日               |
| 総差分               | 69,661+ / 126,410- |
| TypeScript/TSX総行数 | 48,663             |
| Rust行数             | 806                |
| ドメイン層行数       | 33,050             |
| アプリ層行数         | 8,995              |
| Metal層行数          | 2,338              |
| Platform層行数       | 863                |
| テストファイル行数   | 244                |
| WASMバイナリサイズ   | 148KB              |

### コンテンツ規模

| 指標         | 数値             |
| ------------ | ---------------- |
| Wiki項目     | 285+             |
| カード       | 76 + 敵10種      |
| 小説         | 22話 (5章)       |
| ページルート | 26               |
| 文明         | 5大文明 + その他 |
| 思想地層     | 8 (闇5 + 光3)    |

### 品質ゲート (通過状況)

| チェック                  | ステータス |
| ------------------------- | ---------- |
| `tsc --noEmit`            | ✅ パス    |
| `eslint --max-warnings=0` | ✅ パス    |
| `prettier --check`        | ✅ パス    |
| `bun test`                | ✅ 17/17   |
| `bun run build`           | ✅ 成功    |

---

## License

ストーリー内容・世界観: 著作権所有 (proprietary)。ソースコード: MIT License。
