# AGENTS.md — gentaron/edu v2.0

## アーキテクチャ

ドメインクラスタ + 共有基盤 + Metal層

```
domains/  ← 各ドメイン専門家 (各自AGENTS.md)
platform/ ← 共有基盤 (event-bus, schemas, ui)
metal/    ← WASM/Binary/Workers
app/      ← Next.js合成層
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
