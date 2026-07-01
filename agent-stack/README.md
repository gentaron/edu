# AI Agent Stack 統合教育環境

> 5つのオープンソースAIエージェントツールを統合した、実践的学習・開発環境です。
> すべてのコンポーネントが docker-compose で一括起動可能。

## 🏗️ アーキテクチャ概要

```
[ai-rules-sync] ──symlinks──▶ CLAUDE.md, .cursorrules, AGENTS.md
                                     │
                                     ▼
[OmniRoute /v1] ◀── HTTPS_PROXY ── [Agent Vault :14322]
     │                                      │
     │  auto-routes to cheapest model       │  substitutes real keys
     ▼                                      ▼
[OpenSquilla agent] or [Claude Code]     [Infisical / local vault]
     │
     ▼
[HelixNotes] ── AI writing via Ollama/OpenAI
```

## 📦 構成ツール一覧

| ツール | 役割 | ポート |
|--------|------|--------|
| **Agent Vault** | 認証プロキシ・ヴォールト（236プロバイダー対応） | 14321 (UI), 14322 (Proxy) |
| **OmniRoute** | AIゲートウェイ（RTK+Caveman圧縮, 17ルーティング戦略） | 20128 |
| **OpenSquilla** | トークン効率マイクロカーネルAIエージェント（SquillaRouter） | 18791 |
| **ai-rules-sync** | CLAUDE.md → AGENTS.md/.cursorrules 自動同期 | CLI |
| **HelixNotes** | ローカルファーストWiki・ナレッジベース（LLM記述支援） | デスクトップアプリ |

---

## 🗺️ 5ステップ学習パス

### Step 1: 環境構築と起動（30分）

**目標**: 全コンポーネントを docker-compose で起動し、動作確認する。

1. `cp .env.example .env` して各ツールのAPIキーを設定
2. `docker compose up -d` で全サービス起動
3. 各ダッシュボードにアクセスして動作確認:
   - Agent Vault UI: `http://localhost:14321`
   - OmniRoute Dashboard: `http://localhost:20128`
   - OpenSquilla Gateway: `http://localhost:18791`
4. HelixNotes はデスクトップアプリとして別途インストール（[helixnotes.com](https://helixnotes.com)）

**学習ポイント**: Docker Compose のネットワーク構成、環境変数の流れ、各サービスのヘルスチェックを理解する。

**確認コマンド**:
```bash
docker compose ps                    # 全コンテナの状態確認
curl -s http://localhost:14321/health # Agent Vault ヘルスチェック
curl -s http://localhost:20128/health # OmniRoute ヘルスチェック
```

---

### Step 2: Agent Vaultで認証をセキュアに（45分）

**目標**: AIエージェントが本物のAPIキーを持たずに外部APIを呼べる仕組みを理解する。

1. Agent Vault UI (`http://localhost:14321`) にアクセス
2. **Vault作成**: 「my-vault」という名前のヴォールトを作成
3. **Credential登録**: OpenAI APIキー、Anthropic APIキーを登録
4. **Agent作成**: エージェントを作成し、ヴォールトへのアクセス権を付与
5. **Service Rule設定**: `api.openai.com` と `api.anthropic.com` へのアクセスを許可
6. **テスト**: `agent-vault/test-proxy.sh` でダミーキーが正しく置換されることを確認

**学習ポイント**:
- MITMプロキシの仕組み（`HTTPS_PROXY`環境変数による透過的インターセプト）
- ダミーキー（`__openai_api_key__`）→ 本物キーの自動置換
- エグレスフィルタリングと `unmatched_host_policy=deny` によるゼロトラスト

**参考ファイル**: `agent-vault/sample-config.json`, `agent-vault/test-proxy.sh`

---

### Step 3: OmniRouteでマルチプロバイダールーティング（60分）

**目標**: 17のルーティング戦略を理解し、コスト最適化されたAIリクエストルーティングを構築する。

1. OmniRoute Dashboard (`http://localhost:20128`) にアクセス
2. **プロバイダー登録**: 複数のAIプロバイダー（OpenAI, Anthropic, Gemini, ローカルOllama等）を追加
3. **ティア構成**: 4ティア（Subscription → API Key → Cheap → Free）にプロバイダーを分類
4. **ルーティング戦略テスト**: 以下の戦略をそれぞれ試す:
   - `cost-optimized`: 最安プロバイダーに自動ルーティング
   - `priority`: 優先プロバイダーを最初に試行
   - `auto`: 9因子スコアリングによる自動選択
5. **RTK+Caveman圧縮**: トークン消費量の削減効果を確認
6. **フォールバックテスト**: 意図的にプライマリを落としてセカンダリに切り替わることを確認

**学習ポイント**:
- OpenAI互換エンドポイント（`/v1`）のユニバーサル性
- サーキットブレーカーパターンによる障害耐性
- RTK (Request Token Knockout) によるプロンプト圧縮アルゴリズム

**参考ファイル**: `omniroute/sample-config.json`, `omniroute/routing-strategies.md`

---

### Step 4: OpenSquillaでマイクロカーネルエージェント構築（60分）

**目標**: SquillaRouterのタスク複雑度ベース自動ルーティングを体験し、コスト効率の良いエージェントを構築する。

1. OpenSquilla Gateway (`http://localhost:18791`) に起動確認
2. **オンボーディング**: `opensquilla onboard --provider openrouter --api-key-env OPENROUTER_API_KEY`
3. **ルーター設定**: `opensquilla configure router --router recommended` で推奨ルーティングを有効化
4. **タスク実行テスト**: 以下の異なる複雑度のタスクを投入:
   - 簡単（要約、翻訳）→ 安価なモデルにルーティングされることを確認
   - 中程度（コード生成）→ 中程度のモデルにルーティング
   - 困難（複雑な推論、数式証明）→ 高性能モデルにルーティング
5. **Router HUD**: ターミナルで `opensquilla diagnostics on` でルーティング決定をリアルタイム観察
6. **記憶機能**: `opensquilla memory search` で永続記憶の動作確認

**学習ポイント**:
- マイクロカーネルアーキテクチャ（小さなコア + プラガブルなプロバイダー/ツール）
- タスク複雑度に基づく動的モデル選択のコスト最適化効果
- Markdown + SQLite によるハイブリッド永続記憶の仕組み

**参考ファイル**: `opensquilla/opensquilla.toml`, `opensquilla/router-examples.md`

---

### Step 5: 知識ベース統合とルール同期（45分）

**目標**: ai-rules-sync でエージェントルールを一元管理し、HelixNotes でナレッジベースを構築する。

#### ai-rules-sync によるルール同期

1. **インストール**: `npm install -g ai-rules-sync`
2. **ルール追加**:
   ```bash
   # Claude Code用ルールを追加
   ais claude rules add typescript-best-practices -t https://github.com/gentaron/edu.git#agent-stack/ai-rules-sync/shared-rules
   # Cursor用ルールを追加
   ais cursor rules add nextjs-patterns -t https://github.com/gentaron/edu.git#agent-stack/ai-rules-sync/shared-rules
   ```
3. **チーム共有**: `ai-rules-sync.json` をコミットして、他メンバーが `ais install` で一括復元
4. **CI/CD統合**: GitHub Actions で自動同期（`.github/workflows/sync-rules.yml`）

#### HelixNotes によるナレッジベース

1. HelixNotes をインストール（[helixnotes.com](https://helixnotes.com)）
2. ヴォールトを `agent-stack/helixnotes/vault/` に設定
3. Wikiリンク（`[[link]]`）で知識をネットワーク化
4. AI記述支援を有効化して、Ollama等のローカルモデルでプライベートな文章生成
5. WebDAVでチーム間同期（任意）

**学習ポイント**:
- シンボリックリンクによる「単一情報源（Single Source of Truth）」の実現
- 31種類のAIツールターゲットへの統一ルール配信
- ローカルファーストPKMとクラウドAIのハイブリッド活用

**参考ファイル**: `ai-rules-sync/sample-ai-rules-sync.json`, `helixnotes/vault-template/`

---

## 🚀 クイックスタート

```bash
# 1. 環境変数を設定
cp .env.example .env
# .env を編集してAPIキーを設定

# 2. 全サービス起動
docker compose up -d

# 3. ヘルスチェック
./scripts/health-check.sh

# 4. ai-rules-sync でルール同期
npm install -g ai-rules-sync
ais install
```

## 📁 ディレクトリ構成

```
agent-stack/
├── README.md                          # このファイル（学習パス）
├── docker-compose.yml                 # 全サービス一括起動
├── .env.example                       # 環境変数テンプレート
├── agent-vault/
│   ├── sample-config.json             # Agent Vault 設定例
│   └── test-proxy.sh                  # プロキシテストスクリプト
├── omniroute/
│   ├── sample-config.json             # OmniRoute 設定例
│   └── routing-strategies.md          # 17ルーティング戦略解説
├── opensquilla/
│   ├── opensquilla.toml               # OpenSquilla 設定例
│   └── router-examples.md             # ルーター設定例
├── ai-rules-sync/
│   ├── sample-ai-rules-sync.json      # ルール同期設定例
│   └── shared-rules/                  # 共有ルールファイル
│       ├── typescript-best-practices.mdc
│       └── nextjs-patterns.mdc
├── helixnotes/
│   └── vault-template/                # HelixNotes ヴォールト雛形
│       └── .obsidian
├── docs/
│   ├── architecture.md                # 統合アーキテクチャ解説
│   └── security-model.md              # セキュリティモデル解説
└── scripts/
    └── health-check.sh                # 全サービスヘルスチェック
```

## 🔗 各ツールの公式リポジトリ

| ツール | リポジトリ | ライセンス |
|--------|-----------|-----------|
| Agent Vault | [Infisical/agent-vault](https://github.com/Infisical/agent-vault) | MIT |
| OmniRoute | [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute) | MIT |
| OpenSquilla | [opensquilla/opensquilla](https://github.com/opensquilla/opensquilla) | Apache 2.0 |
| ai-rules-sync | [lbb00/ai-rules-sync](https://github.com/lbb00/ai-rules-sync) | Unlicense |
| HelixNotes | [ArkHost/HelixNotes](https://codeberg.org/ArkHost/HelixNotes) | AGPL-3.0 |