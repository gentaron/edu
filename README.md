<div align="center">

# EDU — Eternal Dominion Universe

**TCP/IP 7-Layer Architecture × Interactive SF Universe**

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
- [Architecture — TCP/IP 7-Layer Model](#architecture--tcpip-7-layer-model)
  - [Layer Overview](#layer-overview)
  - [Dependency Rules](#dependency-rules)
  - [MoE AI Processing](#moe-ai-processing)
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

## Architecture — TCP/IP 7-Layer Model

本プロジェクトはネットワークのTCP/IPモデルを着想源とし、データフローの単方向性・層間分離・独立拡張性を保証する7層アーキテクチャを採用しています。各層はMoE（混合専門家）AIによる独立生成・処理を前提に設計されています。

### Layer Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  L7 Application    機能モジュール (wiki, cards, story, ...)     │
│                    Route pages → L3-L6 API経由でコンポーズ       │
├──────────────────────────────────────────────────────────────────┤
│  L6 Presentation   無状態UIコンポーネント (shadcn/ui, motion)    │
│                    Props in → DOM out. 副作用ゼロ                 │
├──────────────────────────────────────────────────────────────────┤
│  L5 Session        FSM状態機械 (battle, deck, story flows)       │
│                    フロー制御・遷移管理・オーケストレーション      │
├──────────────────────────────────────────────────────────────────┤
│  L4 Transport      イベントバス + Zustand (内部化)               │
│                    typed pub/sub · 非同期通信・状態隠蔽           │
├──────────────────────────────────────────────────────────────────┤
│  L3 Network        Repositoryパターン + キャッシュ               │
│                    データアクセス統一API                          │
├──────────────────────────────────────────────────────────────────┤
│  L2 DataLink       Zod Schemas + バリデータ + 不変条件           │
│                    型安全なインターフェース定義                    │
├──────────────────────────────────────────────────────────────────┤
│  L1 Physical       生データ (.data.ts, as const satisfies)       │
│                    wiki 285項目 · cards 76体 · civilizations      │
└──────────────────────────────────────────────────────────────────┘
```

### Dependency Rules

| ルール                   | 説明                                                  |
| ------------------------ | ----------------------------------------------------- |
| **単方向依存**           | `Ln` は `Ln-1` にのみ依存。逆方向・飛び越しimport禁止 |
| **層間インターフェース** | 隣接層間はZodスキーマ固定の型で通信                   |
| **イベント通信**         | クロスコンポーネント通信はL4イベントバス経由          |
| **独立テスト**           | 各層はモック不要で独立テスト可能                      |
| **AI独立生成**           | MoE各専門家は自分の層のみを読み書き                   |

### MoE AI Processing

各層はAIエージェントによる独立処理を前提としています。ある層の変更が他層に波及することはありません。

| Layer | AI専門家の責務               | 入力                 | 出力                      |
| ----- | ---------------------------- | -------------------- | ------------------------- |
| L1    | 生データの生成・修正         | 設定資料             | `.data.ts` (as const)     |
| L2    | スキーマ定義・バリデータ作成 | L1データ構造         | Zod schemas / validators  |
| L3    | リポジトリ実装               | L2スキーマ           | Repositoryクラス          |
| L4    | イベント種別・状態定義の追加 | ドメイン要求         | event types / stores      |
| L5    | FSMフローデザイン            | ユースケース         | 状態遷移図・ロジック      |
| L6    | UIコンポーネント生成         | デザイン要件 + props | 無状態Reactコンポーネント |
| L7    | 機能モジュールのコンポーザ   | ユーザーストーリー   | ページ・ルート            |

### Directory Structure

```
src/
├── l1-physical/                # L1 — 生データ層
│   ├── wiki/                   # Wiki項目 (characters, orgs, geography, tech, terms, history)
│   │   ├── characters.data.ts  #   キャラクター 94体
│   │   ├── characters-new.data.ts
│   │   ├── organizations.data.ts  # 組織 47項目
│   │   ├── geography.data.ts  #   地理 49項目
│   │   ├── technology.data.ts #   技術 48項目
│   │   ├── terms.data.ts      #   用語 26項目
│   │   ├── history.data.ts    #   歴史 21項目
│   │   └── index.ts
│   ├── cards/                  # カードデータ
│   │   ├── player-cards.data.ts  #  76枚のプレイヤーカード
│   │   ├── enemies.data.ts    #   10種のPvEエネミー
│   │   └── index.ts
│   └── civilizations/          # 文明データ
│       ├── top.data.ts         #   5大文明
│       ├── other.data.ts       #   その他文明
│       ├── historical.data.ts  #   歴史的文明
│       ├── leaders.data.ts     #   文明指導者
│       └── index.ts
│
├── l2-datalink/                # L2 — スキーマ・バリデーション層
│   ├── schemas/                # Zodスキーマ (wiki, card, story, civilization, etc.)
│   ├── validators/             # ランタイムバリデーション関数
│   └── invariants/             # データ間整合性チェック
│
├── l3-network/                 # L3 — データアクセス層
│   └── repositories/           # Repositoryパターン
│       ├── wiki.repository.ts
│       ├── card.repository.ts
│       ├── story.repository.ts
│       ├── civilization.repository.ts
│       └── content.repository.ts
│
├── l4-transport/               # L4 — 通信・状態層
│   ├── event-bus.ts            # typed pub/subイベントシステム
│   └── state/                  # Zustand stores (L4 APIに隠蔽)
│       ├── battle.state.ts     #   バトル状態管理
│       └── deck.state.ts       #   デッキ構築状態
│
├── l5-session/                 # L5 — フロー制御層
│   └── battle-fsm.ts           # バトル有限状態機械
│
├── l6-presentation/            # L6 — 無状態UI層 (スキャフォールド)
│
├── l7-application/             # L7 — 機能モジュール層 (スキャフォールド)
│
├── _infra/                     # ビルド時インフラ
│   └── validate-data.ts        # データ整合性検証スクリプト
│
├── app/                        # Next.js App Router (24ルート)
│   ├── _components/            # ホームページ専用コンポーネント
│   ├── wiki/                   # 百科事典 (SSG)
│   ├── story/[slug]/           # 小説読者 (SSG + ISR 1h)
│   │   ├── _components/        #   story-reader-ui, lang-toggle, related-stories
│   │   └── _lib/               #   parser (toRoman, isSceneBreak, etc.)
│   ├── card-game/              # PvEデッキ構築 + バトル (CSR)
│   │   └── battle/_components/ #   9バトルUIコンポーネント
│   ├── ranking/_components/    # 番付ページコンポーネント
│   └── ...                     # 各コンテンツページ
│
├── components/
│   ├── edu/                    # アプリ専用共有コンポーネント
│   │   ├── navigation.tsx      #   グローバルナビゲーション
│   │   ├── motion-provider.tsx #   Framer Motion設定
│   │   ├── page-header.tsx     #   ページヘッダー
│   │   ├── reveal-section.tsx  #   セクション表示アニメーション
│   │   ├── star-field.tsx      #   背景スターフィールド
│   │   └── json-ld.tsx         #   構造化データ
│   └── ui/                     # shadcn/ui プリミティブ (accordion, badge, toast)
│
├── lib/                        # レガシユーティリティ（L1-L7への移行進行中）
│   ├── data/                   # データアクセス統合層
│   ├── stores/                 # Zustand stores (L4移行済み)
│   ├── wiki-data/              # Wiki データ（L1移行済み、互換用に残存）
│   ├── card-data/              # カードデータ（L1移行済み）
│   ├── civilization-data/      # 文明データ（L1移行済み）
│   ├── stories.ts              # 小説メタデータ + 章定義 (22話)
│   ├── battle-logic.ts         # バトルロジック
│   ├── faction-data.ts         # 勢力データ
│   ├── tech-data.ts            # 技術体系データ
│   ├── timeline-data.ts        # 年表データ
│   └── schemas.ts              # Zod スキーマ（L2移行済み）
│
├── types/                      # 型定義（L2移行進行中）
└── hooks/                      # カスタムReact Hooks
```

### Migration Status

| Phase | 対象                 | ステータス | 説明                                                              |
| ----- | -------------------- | ---------- | ----------------------------------------------------------------- |
| 1     | L1 + L2              | ✅ 完了    | 生データをL1へ、ZodスキーマをL2へ移行                             |
| 2     | L3 + L4              | ✅ 完了    | Repositoryパターン + イベントバス + Zustand内部化                 |
| 3     | L5 + L6              | ✅ 完了    | Battle FSM + Presentationコンポーネントレジストリ                 |
| 4     | L7                   | 🔄 進行中  | 機能モジュール定義、app/がL7 APIを採用中                          |
| 5     | 品質コンプライアンス | 📋 計画    | strict TS/ESLint・80%テストカバレッジ・パフォーマンスベンチマーク |

> **Note**: `src/lib/` は後方互換性のため一時的に残存。L7統合完了後に削除予定。

---

## Project Overview

**EDU (Eternal Dominion Universe)** は、gentaronが創作するオリジナルSF世界観をWeb上で体験できるインタラクティブ百科事典兼ゲームアプリです。TCP/IP 7層アーキテクチャに基づく型安全なデータフローにより、AIによる各層の独立生成・拡張を可能にしています。

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

| パス                                         | 内容                                      |
| -------------------------------------------- | ----------------------------------------- |
| `src/l1-physical/wiki/characters.data.ts`    | キャラクター94体                          |
| `src/l1-physical/wiki/organizations.data.ts` | 組織47項目                                |
| `src/l1-physical/wiki/geography.data.ts`     | 地理49項目                                |
| `src/l1-physical/wiki/technology.data.ts`    | 技術48項目                                |
| `src/l1-physical/wiki/terms.data.ts`         | 用語26項目                                |
| `src/l1-physical/wiki/history.data.ts`       | 歴史21項目                                |
| `src/l1-physical/cards/player-cards.data.ts` | 76枚のキャラクターカード                  |
| `src/l1-physical/cards/enemies.data.ts`      | 10種のPvEエネミー                         |
| `src/l1-physical/civilizations/`             | 文明データ (top/other/historical/leaders) |
| `src/lib/stories.ts`                         | 22話の小説メタデータ                      |

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

| 要素           | 詳細                                                          |
| -------------- | ------------------------------------------------------------- |
| **デッキ**     | 76枚から5枚選択（C/R/SRレアリティ）                           |
| **バトル**     | 5体全員フィールド常駐、ターン制アビリティ選択                 |
| **敵階級**     | NORMAL / HARD / BOSS / FINAL（4階級10種）                     |
| **状態管理**   | L4 Zustand (battle.state.ts) + localStorage永続化             |
| **FSM制御**    | L5 battle-fsm.ts（状態遷移: idle → select → execute → ...）   |
| **エフェクト** | ParticleBurst, SlashEffect, ShieldDome, HealWave, ScreenFlash |

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
| **State Management** | Zustand 5 (L4層に隠蔽)                          |
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

`src/l1-physical/wiki/` の該当カテゴリファイルを編集:

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

[gentaron/image](https://github.com/gentaron/image) にPNGをpushし、L1データの `image` フィールドを更新。

画像命名規則: 英語名PascalCase（例: `MinaEurekaErnst.png`）· 400×400px以上· 正方形推奨

---

## Quality Standards

| 指標                           | 目標                            |
| ------------------------------ | ------------------------------- |
| TypeScript strict mode         | 有効 (noUncheckedIndexedAccess) |
| `any` 型                       | 禁止                            |
| `eslint-disable`               | 禁止                            |
| Zodスキーマ検証                | ビルド時実行                    |
| レイヤー別テストカバレッジ     | 80%以上                         |
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

---

## License

ストーリー内容・世界観: 著作権所有 (proprietary)。ソースコード: MIT License。
