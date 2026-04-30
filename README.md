# EDU — Eternal Dominion Universe

オリジナルSFユニバース + インタラクティブWebアプリ。500年以上の歴史、285のWiki項目、22の全文小説、76体のキャラクターカードを備えたPvEカードバトル — すべて1つのNext.jsアプリに収録。

[![CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg)](https://github.com/gentaron/edu/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)

---

## 目次

- [Quick Start](#quick-start)
- [プロジェクト概要](#プロジェクト概要)
- [コンテンツ構成](#コンテンツ構成)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Commands](#commands)
- [Card Game System](#card-game-system)
- [Universe Setting](#universe-setting)
- [Content Pipeline](#content-pipeline)
- [開発変遷](#開発変遷)
- [Contributing](#contributing)
- [Related Repos](#related-repos)
- [License](#license)

---

## Quick Start

```bash
git clone https://github.com/gentaron/edu.git && cd edu
bun install
bun dev  # → localhost:3000
```

本番ビルド: `bun run build`（静的HTML 53ルート生成）

---

## プロジェクト概要

**EDU (Eternal Dominion Universe)** は、gentaronが創作するオリジナルSF世界観をWeb上で体験できるインタラクティブ百科事典兼ゲームアプリです。

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

- **Netlify** で静的サイトホスティング
- ISR (Incremental Static Regeneration) で小説コンテンツを1時間ごとに更新
- CI/CD: GitHub Actions + Husky (lint-staged + pre-commit hooks)

---

## コンテンツ構成

### ページ一覧 (24ルート)

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

---

## Architecture

```
src/
├── app/                        # Next.js App Router (24ルート)
│   ├── _components/            # ホームページ専用コンポーネント
│   ├── wiki/                   # 百科事典 (285項目, SSG)
│   ├── story/[slug]/           # 小説読者 (22話, SSG + ISR 1h)
│   │   ├── _components/        # story-reader-ui, lang-toggle, related-stories
│   │   └── _lib/               # parser (toRoman, isSceneBreak, etc.)
│   ├── card-game/              # PvEデッキ構築 + バトル (CSR)
│   │   └── battle/_components/ # 9バトルUIコンポーネント
│   ├── ranking/_components/    # 番付ページコンポーネント
│   └── ...                     # 各コンテンツページ
├── components/
│   ├── edu/                    # アプリ専用共有コンポーネント (Navigation等)
│   └── ui/                     # shadcn/ui コンポーネント
├── lib/
│   ├── data/                   # データアクセス統合層
│   ├── stores/                 # Zustand stores (battle-store, deck-store)
│   ├── wiki-data/              # Wiki データ（カテゴリ別6ファイル分割）
│   ├── card-data/              # カードデータ (cards.ts, enemies.ts)
│   ├── civilization-data/      # 文明データ (top, other, historical, leaders)
│   ├── stories.ts              # 小説メタデータ + 章定義 (22話)
│   ├── battle-logic.ts         # バトルロジック
│   ├── faction-data.ts         # 勢力データ
│   ├── iris-data.ts            # アイリス詳細データ
│   ├── mina-data.ts            # ミナ詳細データ
│   ├── liminal-data.ts         # リミナル詳細データ
│   ├── tech-data.ts            # 技術体系データ
│   ├── timeline-data.ts        # 年表データ
│   └── schemas.ts              # Zod バリデーションスキーマ
├── types/                      # 全型定義 (wiki, card, game, civilization, relation)
└── hooks/                      # カスタムReact Hooks
```

### データソース（Single Source of Truth）

| パス                                             | 内容                                      |
| ------------------------------------------------ | ----------------------------------------- |
| `src/lib/wiki-data/characters.ts`                | キャラクター94体                          |
| `src/lib/wiki-data/terminology-organizations.ts` | 組織47項目                                |
| `src/lib/wiki-data/terminology-geography.ts`     | 地理49項目                                |
| `src/lib/wiki-data/terminology-technology.ts`    | 技術48項目                                |
| `src/lib/wiki-data/terminology-terms.ts`         | 用語26項目                                |
| `src/lib/wiki-data/terminology-history.ts`       | 歴史21項目                                |
| `src/lib/card-data/cards.ts`                     | 76枚のキャラクターカード                  |
| `src/lib/card-data/enemies.ts`                   | 10種のPvEエネミー                         |
| `src/lib/stories.ts`                             | 22話の小説メタデータ                      |
| `src/lib/civilization-data/`                     | 文明データ (top/other/historical/leaders) |

小説本文はビルド時に `gentaron/edutext` (GitHub raw) からフェッチし、ISRでキャッシュ更新。

---

## Tech Stack

| カテゴリ             | 技術                               |
| -------------------- | ---------------------------------- |
| **Framework**        | Next.js 16 (App Router)            |
| **Language**         | TypeScript 5 (strict mode)         |
| **Styling**          | Tailwind CSS v4                    |
| **UI Components**    | shadcn/ui                          |
| **Animation**        | Framer Motion                      |
| **State Management** | Zustand (battle-store, deck-store) |
| **Data Fetching**    | TanStack Query                     |
| **Database**         | Prisma + PostgreSQL/SQLite         |
| **Testing**          | Vitest                             |
| **Linting**          | ESLint + Prettier                  |
| **Error Tracking**   | Sentry                             |
| **Git Hooks**        | Husky + lint-staged                |
| **CI/CD**            | GitHub Actions + Netlify           |
| **Deployment**       | Netlify (Static HTML + ISR)        |

---

## Commands

```bash
bun dev              # 開発サーバー :3000
bun run build        # 本番ビルド（静的HTML生成）
bun test             # Vitest テスト実行
bun run lint         # ESLint + Prettier
```

---

## Card Game System

- **デッキ**: 76枚のキャラクターカードから5枚を選択（C/R/SRレアリティ）
- **バトル**: 5体全員フィールド常駐、ターン制アビリティ選択
- **敵**: NORMAL/HARD/BOSS/FINALの4階級10種
- **状態管理**: Zustand + localStorage永続化
- **バトルエフェクト**: ParticleBurst, SlashEffect, ShieldDome, HealWave, ScreenFlash

---

## Universe Setting

**E16連星系**（M104ソンブレロ銀河ハロー）。人類は4つの銀河団を経由して定住した。

主要勢力: AURALIS Collective / ZAMLT / Trinity Alliance / Alpha Venom / V7 / Shadow Rebellion / Liminal Forge

タイムライン: E1（創世）→ E528+（現代）

---

## Content Pipeline

```
gentaron/edutext (raw .txt)
       ↓  build time fetch
src/app/story/[slug]/page.tsx (SSG + ISR 1h)
```

※ lore/ ミラーは使用しない。全てedutextリポジトリから直接fetch。

- JP原典: `filename.txt` → EN翻訳: `filename_EN.txt`
- EN原典: `filename.txt` → JP翻訳: `filename_JP.txt`
- `getStoryUrlForLang()` / `getStoryTitle()` で言語切替

---

## 開発変遷

### Epoch 1: 初期構築 (2026年4月前半)

| 日付  | 内容                                                                                                                                               |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04/24 | プロジェクト初回コミット。Wiki 115項目構築                                                                                                         |
| 04/25 | Wiki画像追加（Kate Claudia, Lily Steiner等）。Diana/Jen等のキャラクターを拡充。名称修正（Kate Claudia / Lily Steiner正名化）。SRカードの光演出追加 |
| 04/26 | 全宇宙版へ拡大 — E16以外の惑星・勢力を追加                                                                                                         |

### Epoch 2: 宇宙拡張 (2026年4月下旬)

| 日付  | 内容                                                                                                                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 04/27 | eduuni.txt統合 — 宇宙勢力ランキング8文明・歴史的戦争・新キャラ9名追加。5大文明圏ページ作成。年表・資産額ランキングに統合。wiki-data重複整理（225行削減）。アポロン・ドミニオン大戦年表修正 |
| 04/28 | edutext翻訳ファイル追加。Story EN/JP言語切替有効化。Story UI刷新（小説風読書体験）。Wiki UIリデザイン                                                                                      |

### Epoch 3: 大規模クリーンアップ & 最適化 (2026年4月28日)

| 日付  | 内容                                                                                                                                                                                                                                                                                                                                    |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04/28 | ona.la-inspiredデザインモダナイゼーション。**284K行・55パッケージ・44未使用UIコンポーネントを削除**（大掃除）。Wiki用語リンク修正・キャラ画像追加・説明文拡充。全105項目に英語名追加。Wiki用語の誤英語名修正（21項目）。ZAMLT・エレシュ・プロキオ・ロースターの網羅的拡充。Wiki重複エントリ統合・指導者歴代追加・リンクネットワーク修復 |

### Epoch 4: 機能拡充 (2026年4月29日)

| 日付  | 内容                                                                                                                                                                                                                                                             |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04/29 | Wiki説明文内リンク誤ブロック修正（ひらがな助詞対応）。Wiki項目に歴代指導者セクション追加（43エントリ + 新指導者7名）。**EDU全面最適化 Phase 1-5**（パフォーマンス・画像・SEO等）。ファビコンをCeliaDominixに変更。**AGENTS.md追加**（AI開発ルールベース v1.0.0） |

### Epoch 5: Nexus & リファクタリング (2026年4月29日)

| 日付  | 内容                                                                                                                                                                                   |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04/29 | Nexus組織・人物相関AI解析ページ追加（Gemini API連携）。Netlify secrets scan対応。キャラTier表のボグダス・ジャベリン統合 + ZAMLT関連カード追加。ZAMLT頭文字修正 + Gigapolis周辺区再構築 |

### Epoch 6: AI開発最適化 — 8フェーズ (2026年4月29日)

| フェーズ | 内容                                                   | コミット  |
| -------- | ------------------------------------------------------ | --------- |
| Phase 1  | 型定義を `src/types/` に集約（6ファイル）              | `da79c8c` |
| Phase 2  | wiki-data.ts → wiki-data/ ディレクトリ（6カテゴリ別）  | 既存完了  |
| Phase 3  | card-data.ts → card-data/ ディレクトリ                 | `ec42fa5` |
| Phase 4  | civilization-data.ts → civilization-data/ ディレクトリ | `f1c1155` |
| Phase 5  | game-store.ts → stores/ ディレクトリ                   | `6b50ba2` |
| Phase 6a | battle/page.tsx 9コンポーネント分離                    | `526edae` |
| Phase 6b | home page.tsx 5コンポーネント分離                      | `eaba941` |
| Phase 6c | ranking/page.tsx 5コンポーネント分離                   | `8b1454d` |
| Phase 6d | nexus/page.tsx ユーティリティ分離                      | `1db5668` |
| Phase 6e | story-reader-ui.tsx コンポーネント分離                 | `e81466e` |
| Phase 7  | Nexus Gemini API → サーバー経由API Route               | `db74b06` |
| Phase 8  | AGENTS.md + README.md ドキュメント更新                 | `d5bcd61` |

### Epoch 7: Nexus削除 & 安定化 (2026年4月30日)

| 日付  | 内容                                                                                                                       |
| ----- | -------------------------------------------------------------------------------------------------------------------------- |
| 04/30 | Nexus ページ完全削除。AI API連携（Gemini API Route）を解除。外部API依存を排除。README.md全面書き換え（開発変遷・現状完備） |

---

## Contributing

### Wiki項目の追加

`src/lib/wiki-data/` の該当カテゴリファイルを編集:

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

### アートワークの追加

[gentaron/image](https://github.com/gentaron/image) にPNGをpushし、wiki-dataの `image` フィールドを更新。

### 小説の追加

1. JP `.txt` を `gentaron/edutext` に追加
2. EN `_EN.txt` 翻訳を作成
3. `src/lib/stories.ts` にメタデータを登録

---

## Related Repos

| Repo                                                    | Purpose                  |
| ------------------------------------------------------- | ------------------------ |
| [gentaron/edutext](https://github.com/gentaron/edutext) | 小説本文 (JP/EN)         |
| [gentaron/image](https://github.com/gentaron/image)     | キャラクターアートワーク |
| [gentaron/edunft](https://github.com/gentaron/edunft)   | NFTカードメタデータ      |
| [gentaron/edu-agi](https://github.com/gentaron/edu-agi) | AGENTS.md 管理リポジトリ |

---

## License

ストーリー内容・世界観: 著作権所有 (proprietary)。ソースコード: MIT License。
