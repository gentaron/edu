# AGENTS.md — gentaron/edu v2.0

## アーキテクチャ

ドメインクラスタ + 共有基盤 + Metal層

```
domains/  ← 各ドメイン専門家 (各自AGENTS.md)
  wiki/      — 百科事典データ + 検索 + repository
  cards/     — カードデータ + enemies + repository
  battle/    — engine + store + fsm + hsm + canvas
  stories/   — meta + parser + repository + schema
  civilizations/ — civ.data + repository
platform/ ← 共有基盤 (AGENTS.md)
  event-bus.ts     — ドメイン間イベント通信
  navigation.tsx   — 共通ナビゲーション
  reveal-section   — RevealSection / RevealGrid / SectionHeader
  page-header.tsx  — PageHeader
  motion-provider  — framer-motion LazyMotion
  json-ld.tsx      — JSON-LD構造化データ
  schemas/         — Zodスキーマ (card, wiki, civilization, tech, timeline, etc.)
  validators/      — 実行時データ検証
  invariants/      — クロスデータ整合性チェック
  ui/              — shadcn/uiコンポーネント (toast, toaster, badge, accordion)
metal/    ← WASM/Binary/Workers (wasm-bridge, service-worker, workers, binary-protocol)
app/      ← Next.js App Router 合成レイヤー (薄レイヤー)
lib/      ← 共有ユーティリティ (utils, stores, data access, lang)
types/    ← 全型定義 (barrel export)
hooks/    ← React hooks
_infra/   ← ビルド時バリデーション (validate-data, pack-data)
```

## AI実行プロトコル

1. ルートAGENTS.md (このファイル) を読む
2. タスクの対象ドメインを特定
3. 対象ドメインのAGENTS.mdを読む (他は読まない)
4. 変更 → テスト → 型チェック → ビルド

## 品質ゲート

- on save: lint + typecheck
- on feature: ドメイン内テスト
- on task: full build + full test

## 絶対ルール

- any型禁止
- eslint-disable禁止
- 外部API追加はユーザー承認必須
- 1セッション最大10ファイル編集
- 3回連続同じエラー → ユーザー報告
- Wiki項目名は固有名詞として存在感のある名前に (一般名詞不可)
- ドメイン間直接import禁止 (event-bus経由)
- データファイルは各ドメインのdata.tsに集約

## コマンド

```bash
bun install && bun dev
bun run build
bun test
bun run lint
```

## コミット

```
feat(wiki): 新キャラクター追加
fix(battle): ダメージ計算の境界値バグ
refactor(arch): ドメインクラスタ移行
```

## コンテキスト管理

- 新セッション: `git log --oneline -5` + `git status`
- ドメイン横断タスク: 影響DAGを最初に可視化

## データアクセス

- Wikiデータ: `@/domains/wiki/wiki.data` (ALL_ENTRIES含む)
- カードデータ: `@/domains/cards/cards.data` (ALL_CARDS, ENEMIES)
- 文明データ: `@/domains/civilizations/civ.data` (TOP/OTHER/HISTORICAL, LEADERS)
- ストーリー: `@/domains/stories/stories.meta` (ALL_STORIES, CHAPTERS, 各種関数)
- 共通UI: `@/platform/reveal-section`, `@/platform/page-header`, `@/platform/ui/*`
- Zodスキーマ: `@/platform/schemas` (全スキーマbarrel)
- 型定義: `@/types` (全型barrel)
- バリデーション: `@/platform/validators`, `@/platform/invariants`
