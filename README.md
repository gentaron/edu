<div align="center">

# EDU — Eternal Dominion Universe

**Domain Cluster Architecture × Interactive SF Universe**

500年以上の歴史 · 285のWiki項目 · 22の全文小説 · 76体のキャラクターカード · PvEバトル

[![CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg)](https://github.com/gentaron/edu/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Zod](https://img.shields.io/badge/Zod-4-3068B7?style=flat-square&logo=zod)](https://zod.dev)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)

</div>

---

## 目次

- [Quick Start](#quick-start)
- [Architecture — Domain Cluster Architecture](#architecture--domain-cluster-architecture)
  - [Domain Cluster Overview](#domain-cluster-overview)
  - [Dependency Rules](#dependency-rules)
  - [Directory Structure](#directory-structure)
  - [Migration Status](#migration-status)
- [Project Overview](#project-overview)
- [Content](#content)
  - [Pages](#pages)
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
- [Multi-Repository](#multi-repository)
- [Development History](#development-history)
- [License](#license)

---

## Quick Start

```bash
git clone https://github.com/gentaron/edu.git && cd edu
bun install
bun dev          # → http://localhost:3000
bun run build    # → 本番ビルド（静的HTML 24ルート生成）
```

---

## Architecture — Domain Cluster Architecture

Epoch 9よりTCP/IP 7層モデルから**ドメインクラスタアーキテクチャ**へ移行しました。各ドメインは独立したAGENTS.mdを持ち、自律的に開発・拡張可能です。共有インフラは`platform/`に集約し、ハードウェア最接近層は`metal/`に分離しています。

### Domain Cluster Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  domains/                                                        │
│  ├── wiki/     Wiki百科事典 (data + schema + repository + search)  │
│  ├── cards/    カードデータ + デッキストア (data + schema + store) │
│  ├── battle/   バトルエンジン (engine + FSM + store + renderer)    │
│  ├── stories/  小説アーカイブ (meta + parser + repository)         │
│  └── civilizations/ 文明データ (data + schema + repository)         │
├──────────────────────────────────────────────────────────────────┤
│  platform/  共有基盤 (event-bus, schemas, ui, navigation)         │
├──────────────────────────────────────────────────────────────────┤
│  metal/     ハードウェア最接近層 (WASM, Binary, Workers, SW)     │
├──────────────────────────────────────────────────────────────────┤
│  app/       Next.js App Router — 薄い合成層                    │
└──────────────────────────────────────────────────────────────────┘
```

| レイヤー      | 内容                                                                                   |
| ------------- | -------------------------------------------------------------------------------------- |
| **domains/**  | ビジネスドメイン（wiki, cards, battle, stories, civilizations）。各ドメインにAGENTS.md |
| **platform/** | 共有基盤 — event-bus, schemas, ui (shadcn/ui), navigation                              |
| **metal/**    | ハードウェア最接近層 — WASM bridge, binary protocol, service worker, web workers       |
| **app/**      | Next.js App Router — 薄い合成層。ルーティングとページコンポジションのみ                |
| **\_infra/**  | ビルド時インフラ — データ検証スクリプトなど                                            |

### Dependency Rules

| ルール                 | 説明                                                                 |
| ---------------------- | -------------------------------------------------------------------- |
| **ドメイン独立開発**   | 各ドメインは自身のAGENTS.mdに従って独立開発                          |
| **ドメイン間通信**     | ドメイン間通信は`@/platform/event-bus`経由                           |
| **UIプリミティブ使用** | UIコンポーネントは`@/platform/ui/`のshadcn/uiプリミティブを使用      |
| **旧レイヤー後方互換** | 旧レイヤー(`l0-metal`〜`l7-application`)は後方互換ラッパーとして残存 |

### Directory Structure

```
src/
├── domains/                         # ドメインクラスタ (Epoch 9)
│   ├── wiki/                        # Wiki百科事典
│   │   ├── AGENTS.md                 #   AI開発エージェント指示
│   │   ├── data/                     #   wikiデータ (285項目)
│   │   ├── schema/                   #   Zodスキーマ
│   │   ├── repository/               #   Repository + 検索エンジン
│   │   └── index.ts
│   ├── cards/                       # カードデータ + デッキストア
│   │   ├── AGENTS.md
│   │   ├── data/                     #   76枚のプレイヤーカード + 10種の敵
│   │   ├── schema/                   #   カードZodスキーマ
│   │   ├── store/                    #   デッキ構築Zustand store
│   │   └── index.ts
│   ├── battle/                      # バトルエンジン
│   │   ├── AGENTS.md
│   │   ├── engine/                   #   ダメージ計算・敵AI・フェーズ遷移
│   │   ├── fsm/                      #   汎用HSM + バトルFSM
│   │   ├── store/                    #   バトル状態管理
│   │   ├── renderer/                 #   Canvas 2Dレンダラー
│   │   └── index.ts
│   ├── stories/                     # 小説アーカイブ
│   │   ├── AGENTS.md
│   │   ├── meta/                     #   小説メタデータ (22話)
│   │   ├── parser/                   #   toRoman, isSceneBreak等
│   │   ├── repository/               #   Storyリポジトリ
│   │   └── index.ts
│   └── civilizations/               # 文明データ
│       ├── AGENTS.md
│       ├── data/                     #   5大文明 + 歴史文明 + 指導者
│       ├── schema/                   #   文明Zodスキーマ
│       ├── repository/               #   文明リポジトリ
│       └── index.ts
│
├── platform/                        # 共有基盤
│   ├── event-bus/                    # typed pub/subイベントシステム
│   ├── schemas/                      # 共有Zodスキーマ定義
│   ├── ui/                           # shadcn/uiプリミティブ (accordion, badge, toast, ...)
│   └── navigation/                   # グローバルナビゲーション + ルーティング
│
├── metal/                           # ハードウェア最接近層
│   ├── wasm-engine.ts                # WASMバトルエンジンブリッジ (148KB .wasm)
│   ├── binary-protocol.ts            # TLVバイナリシリアライズ (VarInt + CRC32)
│   ├── service-worker.ts             # Service Workerマネージャ (オフライン対応)
│   ├── service-worker-registration.ts # SW登録ユーティリティ
│   └── workers/                      # Web Worker並列化
│       ├── battle-worker.ts          #   バトル計算Worker
│       ├── worker-pool.ts            #   ジェネリックWorkerプール (Transferable対応)
│       └── index.ts
│
├── app/                             # Next.js App Router — 薄い合成層 (24ルート)
│   ├── _components/                  # ホームページ専用コンポーネント
│   ├── wiki/                         # 百科事典 (SSG)
│   ├── story/[slug]/                 # 小説読者 (SSG + ISR 1h)
│   ├── card-game/                    # PvEデッキ構築 + バトル (CSR)
│   ├── ranking/                      # 番付ページ
│   └── ...                           # 各コンテンツページ
│
├── components/                      # アプリ専用共有コンポーネント
│   ├── edu/                          # motion-provider, page-header, reveal-section, star-field, json-ld
│   └── ui/                           # shadcn/ui (→ platform/ui/ に移行済み)
│
├── l0-metal/ ~ l7-application/      # 旧レイヤー — 後方互換ラッパー (Epoch 9でラッパー化)
│
├── _infra/                          # ビルド時インフラ
│   └── validate-data.ts              # データ整合性検証スクリプト
│
├── lib/                             # レガシユーティリティ（後方互換用に残存）
│   ├── data/                         # データアクセス統合層
│   ├── stores/                       # Zustand stores
│   ├── wiki-data/                    # Wiki データ互換
│   ├── card-data/                    # カードデータ互換
│   ├── civilization-data/            # 文明データ互換
│   ├── stories.ts                    # 小説メタデータ + 章定義
│   ├── battle-logic.ts               # バトルロジック
│   ├── faction-data.ts               # 勢力データ
│   ├── tech-data.ts                  # 技術体系データ
│   ├── timeline-data.ts              # 年表データ
│   └── schemas.ts                    # Zod スキーマ互換
│
├── types/                           # 型定義
└── hooks/                           # カスタムReact Hooks
```

### Migration Status

| Phase | 対象                              | ステータス | 説明                             |
| ----- | --------------------------------- | ---------- | -------------------------------- |
| 1-5   | TCP/IP 7層 (Epoch 7-8)            | ✅ 完了    | L0-L7構築 + Prometheus 8フェーズ |
| 6     | Epoch 9 Phase 1: Wiki名改変       | ✅ 完了    | 15項目の固有名詞化               |
| 7     | Epoch 9 Phase 2: 思想統合         | ✅ 完了    | 8地層(D1-D5,L1-L3) × 15項目      |
| 8     | Epoch 9 Phase 3: ドメインクラスタ | ✅ 完了    | domains/ + platform/ + metal/    |

### Project Prometheus — テックレベル向上 (Epoch 8)

| Phase    | 実装内容                                             | スコア    |
| -------- | ---------------------------------------------------- | --------- |
| 1        | Rust → WASM バトルエンジン (148KB, 9テスト)          | +10.5     |
| 2        | TLVバイナリシリアライズ + CRC32 (550項目wiki.edu)    | +4.0      |
| 3        | Canvas 2D レンダラー (FrameBudget + ParticleEmitter) | +5.3      |
| 4        | BM25転置インデックス + Trie autocomplete             | +3.8      |
| 5        | 汎用HSMフレームワーク (Graphviz DOT export)          | +0        |
| 6        | fast-check プロパティベースドテスト (36テスト)       | +0.8      |
| 7        | Web Worker並列化 (WorkerPool + Transferable)         | +3.0      |
| 8        | Service Worker オフライン (Stale-While-Revalidate)   | +0        |
| **合計** | **397テスト通過 / 重み付きスコア 45.8pt**            | **+27.4** |

---

## Project Overview

**EDU (Eternal Dominion Universe)** は、gentaronが創作するオリジナルSF世界観をWeb上で体験できるインタラクティブ百科事典兼ゲームアプリです。ドメインクラスタアーキテクチャに基づく型安全なデータフローにより、AIによる各ドメインの独立生成・拡張を可能にしています。

### 特徴

| カテゴリ            | 内容                                                              |
| ------------------- | ----------------------------------------------------------------- |
| **百科事典 (Wiki)** | 285項目（キャラクター94、組織47、地理49、技術48、用語26、歴史21） |
| **小説 (Story)**    | 5章22話の連作小説。EN/JP言語切替対応                              |
| **カードゲーム**    | 76体のキャラクターカード + 10種の敵によるPvEバトル                |
| **文明圏**          | 宇宙5大文明 + 3歴史文明 + 8文明指導者                             |
| **年表**            | AD3500〜E528の統合年表                                            |
| **長者番付**        | E16経済圏の富豪ランキング                                         |
| **技術体系**        | 7つのコア技術の物理学的解説                                       |

### デプロイ

- **Netlify** (@netlify/plugin-nextjs) でホスティング
- ISR (Incremental Static Regeneration) で小説コンテンツを1時間ごとに更新
- CI/CD: GitHub Actions + Husky (lint-staged + pre-commit hooks)

---

## Content

### Pages

24ルートの静的/動的ページで構成されています。

| ルート                  | 内容                                 | 方式         |
| ----------------------- | ------------------------------------ | ------------ |
| `/`                     | ホーム — 全セクションへの導線        | SSG          |
| `/wiki`                 | 百科事典一覧（285項目）              | SSG          |
| `/wiki/[id]`            | 項目詳細ページ（リンク網・指導者歴） | SSG          |
| `/story`                | 小説一覧（22話）                     | SSG          |
| `/story/[slug]`         | 小説全文（EN/JP切替・章TOC）         | SSG + ISR 1h |
| `/characters`           | キャラクターTier表（勢力別一覧）     | SSG          |
| `/card-game`            | カード一覧                           | CSR          |
| `/card-game/select`     | デッキ構築                           | CSR          |
| `/card-game/battle`     | PvEバトル                            | CSR          |
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

| パス                              | 内容                                      |
| --------------------------------- | ----------------------------------------- |
| `src/domains/wiki/data/`          | Wiki 285項目 (6カテゴリ)                  |
| `src/domains/cards/data/`         | 76枚のキャラクターカード + 10種の敵       |
| `src/domains/civilizations/data/` | 文明データ (top/other/historical/leaders) |
| `src/lib/stories.ts`              | 22話の小説メタデータ                      |

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

PvEターン制カードバトル。76枚のキャラクターカードから5枚を選択し、4階級10種の敵と戦います。

### システム構成

| 要素           | 詳細                                                           |
| -------------- | -------------------------------------------------------------- |
| **デッキ**     | 76枚から5枚選択（C/R/SRレアリティ）                            |
| **バトル**     | 5体全員フィールド常駐、ターン制アビリティ選択                  |
| **敵階級**     | NORMAL / HARD / BOSS / FINAL（4階級10種）                      |
| **状態管理**   | `domains/battle/store/` + localStorage永続化                   |
| **FSM制御**    | `domains/battle/fsm/`（状態遷移: idle → select → execute → …） |
| **エフェクト** | ParticleBurst, SlashEffect, ShieldDome, HealWave, ScreenFlash  |

---

## Universe Setting

**E16連星系**（M104ソンブレロ銀河ハロー）。人類は4つの銀河団を経由して定住した。

**主要勢力**: AURALIS Collective / ZAMLT / Trinity Alliance / Alpha Venom / V7 / Shadow Rebellion / Liminal Forge

**タイムライン**: E1（創世）→ E528+（現代）

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
| **Monitoring**       | Sentry                                          |
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
bun run build        # 本番ビルド（静的HTML生成）
bun start            # 本番サーバー起動
bun test             # Vitest テスト実行
bun run test:watch   # ウォッチモード
bun run test:ui      # Vitest UI
bun run lint         # ESLint + Prettier
bun run db:push      # Prisma DB同期
bun run db:seed      # シードデータ投入
```

### Contributing — Wiki Items

`src/domains/wiki/data/` の該当カテゴリファイルを編集:

```ts
{
  id: string,
  name: string,
  nameEn?: string,
  category: "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史",
  subCategory?: string,
  description: string,
  era?: string,
  affiliation?: string,
  tier?: string,
  image?: string,
  sourceLinks?: { url: string; label: string }[],
  leaders?: { id: string; name: string; nameEn?: string; role: string; era?: string }[]
}
```

### Contributing — Stories

1. JP `.txt` を `gentaron/edutext` に追加
2. EN `_EN.txt` 翻訳を作成
3. `src/lib/stories.ts` にメタデータを登録

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
| テストカバレッジ               | 80%以上                         |
| LCP (Largest Contentful Paint) | 1.5秒以下                       |
| バトルアニメーション           | 60fps                           |
| ページバンドルサイズ           | 100KB以下                       |

---

## Multi-Repository

| Repo                                                    | 役割                        | AI編集権限 |
| ------------------------------------------------------- | --------------------------- | ---------- |
| [gentaron/edu](https://github.com/gentaron/edu)         | メインアプリ (本リポジトリ) | 直接編集   |
| [gentaron/edutext](https://github.com/gentaron/edutext) | 小説本文 (JP/EN .txt)       | 直接編集   |
| [gentaron/image](https://github.com/gentaron/image)     | キャラクターアートワーク    | 指示のみ   |
| [gentaron/edunft](https://github.com/gentaron/edunft)   | NFTカードメタデータ         | —          |
| [gentaron/edu-agi](https://github.com/gentaron/edu-agi) | AGENTS.md 管理リポジトリ    | —          |

---

## Development History

### Epoch 1: 初期構築 (2026/04/24–26)

| 日付  | 内容                                                                               |
| ----- | ---------------------------------------------------------------------------------- |
| 04/24 | プロジェクト初回コミット。Wiki 115項目構築                                         |
| 04/25 | Wiki画像追加（Kate Claudia, Lily Steiner等）。キャラクター拡充。SRカード光演出追加 |
| 04/26 | 全宇宙版へ拡大 — E16以外の惑星・勢力を追加                                         |

### Epoch 2: 宇宙拡張 (2026/04/27–28)

| 日付  | 内容                                                                                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 04/27 | eduuni.txt統合 — 宇宙勢力ランキング8文明・歴史的戦争・新キャラ9名追加。5大文明圏ページ作成。年表・資産額ランキング統合。wiki-data重複整理 |
| 04/28 | edutext翻訳ファイル追加。Story EN/JP言語切替有効化。Story UI刷新                                                                          |

### Epoch 3: 大規模クリーンアップ (2026/04/28)

| 日付  | 内容                                                                                                                                                                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04/28 | ona.la-inspiredデザインモダナイゼーション。**284K行・55パッケージ・44未使用UIコンポーネントを削除**。Wiki用語リンク修正・画像追加・説明文拡充。全105項目に英語名追加。ZAMLT・エレシュ・プロキオ等の網羅的拡充。Wiki重複統合・指導者歴代追加 |

### Epoch 4: 機能拡充 (2026/04/29)

| 日付  | 内容                                                                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04/29 | Wiki説明文内リンク誤ブロック修正。Wiki項目に歴代指導者セクション追加（43エントリ + 新指導者7名）。**EDU全面最適化 Phase 1-5**。ファビコン変更。**AGENTS.md追加** (v1.0.0) |

### Epoch 5: AI開発最適化 — 8フェーズ (2026/04/29)

| フェーズ   | 内容                                                   |
| ---------- | ------------------------------------------------------ |
| Phase 1    | 型定義を `src/types/` に集約（6ファイル）              |
| Phase 2    | wiki-data.ts → wiki-data/ ディレクトリ（6カテゴリ別）  |
| Phase 3    | card-data.ts → card-data/ ディレクトリ                 |
| Phase 4    | civilization-data.ts → civilization-data/ ディレクトリ |
| Phase 5    | game-store.ts → stores/ ディレクトリ                   |
| Phase 6a-e | battle/home/ranking/nexus/story コンポーネント分離     |
| Phase 7    | Nexus Gemini API → サーバー経由API Route               |
| Phase 8    | AGENTS.md + README.md ドキュメント更新                 |

### Epoch 6: Nexus削除 & 安定化 (2026/04/30)

| 日付  | 内容                                                                                                      |
| ----- | --------------------------------------------------------------------------------------------------------- |
| 04/30 | Nexusページ完全削除。外部API依存排除。README.md全面書き換え。Wiki大幅拡充 + 技術ガチ物理化 + ナビバグ修正 |

### Epoch 7: TCP/IP 7層アーキテクチャ導入 (2026/04/30)

| 日付  | 内容                                                                                                                                    |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 04/30 | **TCP/IP 7層モデルによる全面アーキテクチャ再設計**。L1-L7 + `_infra/` ディレクトリ構築。Phase 1-3完了（L1-L6実装）。ARCHITECTURE.md作成 |

### Epoch 8: Project Prometheus — テックレベル最大化 (2026/04/30)

| Phase | 内容                                                                                                                                                                              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | **Rust → WASM バトルエンジン** (148KB WASM)。純粋関数: ダメージ計算・敵AI・フェーズ遷移・全バトルシミュレーション。Rust 9テスト                                                   |
| 2     | **TLVバイナリシリアライズ** — VarInt (LEB128) + CRC32 + BinaryWriter/Reader/Encoder/BinaryIndex。55テスト。`public/data/wiki.edu` (550項目, 563KB) 生成                           |
| 3     | **Canvas 2Dレンダラー** — FrameBudget (16.67ms監視) + TextureAtlas + SpriteBatch + CardSprite/EnemySprite + ParticleEmitter (5プリセット) + AnimationTimeline (6easing)。95テスト |
| 4     | **BM25転置インデックス全文検索** — bi-gramトークナイザ + BM25スコアリング + Trie autocomplete + WikiSearchEngine (カテゴリ重みブースティング)。64テスト                           |
| 5     | **汎用HSMフレームワーク** — SCXMLサブセット。階層状態・ガード条件・遷移アクション・履歴状態 (shallow/deep)。Graphviz DOT export。BattleHSM定義。57テスト                          |
| 6     | **fast-check PBT** — 9プロパティ (HP非負・ダメージ整合性・FSM到達可能性・バトル終了性・バイナリ往返・検索整合性)。36テスト                                                        |
| 7     | **Web Worker並列化** — WorkerPool (Transferable Objects対応) + BattleWorkerClient。26テスト                                                                                       |
| 8     | **Service Worker** — `public/sw.js` (Cache-First/Stale-While-Revalidate/Network-First 3戦略) + ServiceWorkerManager。15テスト                                                     |

### Epoch 9: Project Prometheus 2 — ドメインクラスタ移行 (2026/05/01)

| Phase | 内容                                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------- |
| 1     | Wiki項目名改変 — 15項目を一般名詞から固有名詞へ (30ファイル変更)                                        |
| 2     | 思想統合 — 闇の地層(D1-D5)と光の地層(L1-L3)を15項目のdescriptionに統合                                  |
| 3     | ドメインクラスタアーキテクチャ移行 — TCP/IP 7層からドメインベース構造へ (domains/ + platform/ + metal/) |

---

## License

ストーリー内容・世界観: 著作権所有 (proprietary)。ソースコード: MIT License。
