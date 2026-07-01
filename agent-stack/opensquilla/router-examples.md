# SquillaRouter ルーター設定例

## はじめに

SquillaRouter は OpenSquilla の中核ルーティングエンジンです。各ターンのタスク複雑度を推定し、
最も安価で能力の十分なモデルに自動振り分けます。外部の分類器は不要で、
プロンプトのトークン数、タスクタイプ、コンテキスト深度などからルーティング決定を行います。

## ルーターモード比較

### 1. recommended（推奨）

タスクを「簡単・中程度・困難」の3段階に自動分類し、それぞれに対応するモデルプールから選択します。

```toml
[router]
mode = "recommended"

[router.recommended]
easy_models = ["openrouter:meta-llama/llama-3.1-8b-instruct"]
medium_models = ["openrouter:anthropic/claude-3.5-haiku"]
hard_models = ["openrouter:anthropic/claude-sonnet-4"]
```

**ルーティング判断の基準**:
- **簡単**: 要約、翻訳、抽出、単純なQ&A（短いコンテキスト、単一タスク）
- **中程度**: コード生成、文章作成、データ分析（中程度のコンテキスト、構造化タスク）
- **困難**: 複雑な推論、数式証明、マルチステップ計画（長いコンテキスト、依存関係の多いタスク）

### 2. openrouter-mix

OpenRouter 上の複数モデルをコスト順にミックスします。同じ品質の回答を最安で得るのに適しています。

```toml
[router]
mode = "openrouter-mix"

[router.openrouter-mix]
models = [
  "meta-llama/llama-3.1-8b-instruct",
  "anthropic/claude-3.5-haiku",
  "anthropic/claude-sonnet-4"
]
# 自動的にコスト順にソートされ、要求レベルに合う最安モデルが選択
```

### 3. disabled

ルーティングを無効化し、単一プロバイダーで全リクエストを処理します。デバッグや特定モデルの動作確認に有用です。

```toml
[router]
mode = "disabled"

[providers.openai]
api_key_env = "OPENAI_API_KEY"
base_url = "https://api.openai.com/v1"
default_model = "gpt-4o"
```

## Router HUD によるリアルタイム観察

ターミナルでルーティング決定をリアルタイムに確認できます:

```bash
opensquilla diagnostics on
```

出力例:
```
[SquillaRouter] タスク複雑度: MEDIUM (スコア 0.62)
  → 選択モデル: claude-3.5-haiku (コスト $0.0012/1K tokens)
  → 比較: claude-sonnet-4 は不必要 (スコア 0.62 < 閾値 0.75)
  → 推定節約: 92% vs ハイエンドモデル
```

## コスト最適化の実測例

| タスクタイプ | recommended選択 | ハイエンド固定 | 節約率 |
|-------------|----------------|---------------|--------|
| テキスト要約 | llama-3.1-8b ($0.0001) | claude-sonnet-4 ($0.015) | **99.3%** |
| TypeScript生成 | claude-3.5-haiku ($0.0012) | claude-sonnet-4 ($0.015) | **92.0%** |
| 数式証明 | claude-sonnet-4 ($0.015) | claude-sonnet-4 ($0.015) | **0%** (必要) |
| 英日翻訳 | llama-3.1-8b ($0.0001) | gpt-4o ($0.01) | **99.0%** |

## 学習演習

### 演習1: 複雑度閾値の調整
`opensquilla.toml` で easy/medium/hard のモデルを入れ替え、
同じプロンプトでもモデル選択が変わることを確認してください。

### 演習2: diagnostics による分析
10回の異なるタスクを実行し、Router HUD の出力から
ルーティングパターンを分析してください。

### 演習3: コスト比較
`recommended` モードと `disabled`（ハイエンド固定）で
同じ10タスクを実行し、トークン消費量の差を測定してください。