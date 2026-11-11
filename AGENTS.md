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

<!-- ecosystem:begin (自動生成: gentaron/infocollect の ecosystem/registry.json から。手で直さない) -->

## エコシステム（このリポジトリの外側）

- 役割: EDU — E16 連星系を舞台とするオリジナル SF ユニバースの本体サイト（EDU 宇宙）
- 上流（ここが受け取るもの）: edutext（EDU の原典）、image（キャラクターアート）
- 下流（ここが渡すもの）: なし
- 渡しているもの（produces）の形を変えるときは、下流のリポジトリ名をコミットメッセージに書き、壊さない移行にする。
- 調べ物は MCP の `infocollect-kb` を先に使う（`kb_search` / `kb_context`。毎日の AI 情報・論文・リリース・過去記事・全リポジトリの役割が入っている）。出典の URL を必ず添える。
- 大きな作業は MCP の `forge` で小さなカードに割り、無料のエージェントに配る（`forge_add_cards`）。マージは人が承認する。
- 進め方: 方向づけ → 作業ループ → 判断の記録 → 更新 → 完了。完了の前に、このリポジトリの検証コマンドが通ることを確かめる。
- 全体の地図: https://github.com/gentaron/infocollect/blob/HEAD/ecosystem/README.md

<!-- ecosystem:end -->
