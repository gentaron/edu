<div align="center">

# EDU — Eternal Dominion Universe

**Research-Grade Interactive SF Universe · Lore-Tech Deep Integration · 9-Phase Uplift Architecture**

500+ 年の宇宙史 · 285+ Wiki · 22 小説 · 76 カード · Rust WASM · Lean 4 · ZK · Quantum · PQC · CRDT · Browser-Native RAG

[![CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg)](https://github.com/gentaron/edu/actions)
[![Rust CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg?branch=main&label=Rust)](https://github.com/gentaron/edu/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Rust](https://img.shields.io/badge/Rust-no_std-CE422B?style=flat-square&logo=rust)](https://www.rust-lang.org)
[![Tests](https://img.shields.io/badge/Tests-854_%2B_161_Rust-22C55E?style=flat-square)]()
[![Coverage](https://img.shields.io/badge/Coverage-91.72%25-4CAF50?style=flat-square)]()
[![PBT](https://img.shields.io/badge/PBT-56_%2B_9_properties-F59E0B?style=flat-square)]()
[![Kani](https://img.shields.io/badge/Kani-6_proofs-9333EA?style=flat-square)]()
[![RISC-V](https://img.shields.io/badge/RISC--V-bare_metal-1DACD6?style=flat-square)]()
[![Quantum](https://img.shields.io/badge/Quantum-8_qubits-6366F1?style=flat-square)]()
[![PQC](https://img.shields.io/badge/PQC-ML--KEM_%2B_ML--DSA-EF4444?style=flat-square)]()
[![WebGPU Compute](https://img.shields.io/badge/WebGPU-Compute-4A90D9?style=flat-square)](docs/adr/0004-webgpu-compute-pipeline.md)
[![ZK-Verified Replays](https://img.shields.io/badge/ZK-Verified_Replays-Merkle-9333EA?style=flat-square)](docs/adr/0005-zk-replay-verification.md)
[![Lean 4 Theorems](https://img.shields.io/badge/Lean_4-Engine_Theorems-2D6B4E?style=flat-square)](docs/adr/0006-lean-as-engine-load-bearing.md)
[![SLSA L3](https://img.shields.io/badge/SLSA-L3_Provenance-3258C8?style=flat-square)](docs/adr/0007-hermeticity-as-zk-prerequisite.md)
[![Cross-Arch](https://img.shields.io/badge/Cross--Arch_Deterministic-1DACD6?style=flat-square)](docs/adr/0007-hermeticity-as-zk-prerequisite.md)
[![CRDT multi-user](https://img.shields.io/badge/CRDT-multi--user-4A90D9?style=flat-square)](docs/adr/0008-crdt-three-deep-integrations.md)
[![Browser RAG](https://img.shields.io/badge/RAG-Browser_Native_WebGPU-06B6D4?style=flat-square)](src/features/chatbot/)
[![Nix](https://img.shields.io/badge/Nix-Hermetic_Builds-9333EA?style=flat-square&logo=nixos)](flake.nix)
[![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)
[![Lean 4 CI](https://github.com/gentaron/edu/actions/workflows/balance-gate.yml/badge.svg)](https://github.com/gentaron/edu/actions/workflows/balance-gate.yml)

</div>

---

## TL;DR

**EDU** は単なる技術デモではありません。E16 連星系を舞台とするオリジナル SF 世界観を、Rust の `no_std` バトルエンジン、Lean 4 の機械化証明、ZK 証明、量子計算、CRDT 協調、WebGPU コンピュートシェーダー、そしてブラウザネイティブ RAG チャットボットという研究級技術スタックで表現したプロジェクトです。

各技術は汎用コンポーネントとして世界観に「 bolt-on 」されているのではなく、世界観内の概念（Apolon Execution Shrine, Dimensional Witness Forge, AURALIS Collective Consensus Protocol など）として**物語の中に根付いて**います。Lean 4 の証明は証明だけでなく Rust エンジンのコンパイル時依存（load-bearing）となっており、技術と物語は分離不可能に統合されています。

---

## Quick Start

```bash
git clone https://github.com/gentaron/edu.git && cd edu
bun install
bun dev            # http://localhost:3000
bun run build      # production build
bun test           # 873 TS tests (854 + 19 chatbot)
bun run lint       # eslint --max-warnings=0
bun run bench      # TS + Rust benchmarks
```

> **Runtime**: Bun · **Framework**: Next.js 16 App Router · **Deploy**: Netlify

---

## Technology × Lore Integration Analysis

EDU は「技術スタックを SF 世界観でラベル付けした」プロジェクトではなく、各技術が世界観の一部として設計されています。以下の分析は全ソースコード・ADR・Lean 4 証明・WGSL シェーダー・カード定義の実際の内容に基づいています。

### Integration Depth Summary

| Technology | Depth | In-Universe Identity | Key Evidence |
|---|:---:|---|---|
| **Card Game Engine** | ★★★ | Apolon Execution Shrine | `EffectType` コメント「各 variant は Thought Layer の共鳴パターン」、`.apo` カードに `affiliation` / `flavor_text` が世界観準拠 |
| **Lean 4 Proofs** | ★★★ | Life Force Axiom / Temporal Horizon Guarantee | `BoundedHp<MAX>` の構築に Lean の `HP_INVARIANT_PROVEN` マーカーが**コンパイル時必須**。削除すると Rust エンジンがビルド不能。トーナメント UI は Lean から抽出した `computeMaxTurns` を表示 |
| **ZK Prover/Verifier** | ★★★ | Dimensional Witness Forge | 全 branded type に `Canon:` ドキュメント — `ProofId` = "True Name of the Witness"、`ReplayHash` = "Timeline Fingerprint"、`WitnessDigest` = "Adversarial Seal" |
| **CRDT Bridge** | ★★★ | AURALIS Collective Consensus Protocol | Wiki ドキュメント = "Lore Codex"、デッキ同期 = "Resonance Configuration"、プレゼンス = "Observer Beacon"、モデレーション = "Consensus Guardian Council"。ADR-0008 で削除した 3 表面を世界観的理由で明記 |
| **Apolon DSL** | ★★★ | Liminal Forge Compilation Pipeline | `EffectLevel` (Pure/View/Mut) = "天界階層の Forge 操作"。branded types = "True Names"。250KB WASM 予算 = "Forge の出力制約"。文法仕様書が世界観マッピングで開始 |
| **Cross-Platform Determinism** | ★★★ | Dimension Horizon / Apolonium Seeded Cascade | `xoshiro256++` RNG = "Apolonium Seeded Cascade"、量子基質 = Qiskit 8-qubit entanglement circuit。RISC-V bare-metal (5,768 bytes) で「ランタイム依存なし」を証明 |
| **RAG Chatbot** | ★★★ | EDU Universe Lorekeeper | システムプロンプト「You are the EDU Universe lorekeeper」。コーパスは wiki データ (729 チャンク) から自動生成。引用ベース回答でハルシネーション防止 |
| **Liminal Forge (UGC)** | ★★★ | Card Creation Verification | 3 段階検証 — Tree-sitter 構文検査 ("Lexicon of the Forge")、Lean 4 型検査 ("正規カードと同一の型チェッカー")、balance 検査 ("NoInfiniteCombo 定理")。「UGC 用の別安全層は存在しない」 |
| **Story/Timeline** | ★★★ | E0–E528 統一年表 | キャラクター個別年表 (Iris, Mina)、ファクション連動叙事弧、時代特定イベント (E270 AURALIS 創設、E400 エヴァトロン弾圧、E522 第二世代) |
| **Wiki System** | ★★★ | Comprehensive Lore Database | 7 カテゴリ (キャラクター 94、組織 47、地理 49、技術 48、用語 26、歴史 21)、30+ の詳細キャラクター伝記、相互リンク |
| **Tournament** | ★★★ | Lean-derived Bounds | UI に `NoInfiniteCombo.computeMaxTurns` から抽出したターン上限と証明由来の数式を表示。"Lean-proven" バッジ |
| **Ranking** | ★★★ | E16 Economy | n-token 通貨システム、5 大文明の指導者データ |
| **Character Pages** | ★★★ | In-Universe Biographies | `/iris` (Trinity Alliance 層系列)、`/mina` (AURALIS 第二世代)、`/auralis` (第一/第二世代の完全記録) |
| **WebGPU Compute** | ★★☆ | Dimensional Script / Dimensional Isolation Wards | WGSL ヘッダーに "Epoch-12 Delta — Liminal Forge Rendering Substrate"、ADR-0004 で全コンポーネントを世界観にマッピング。シェーダーの数式自体は汎用物理 |

> **★ = Showcase Only / ★★ = Partially Integrated / ★★★ = Deeply Integrated**

**13/14 技術 (93%) が世界観と深く統合**されています。WebGPU コンピュートのみがヘッダーコメント/ADR でのマッピングに留まっており、シェーダー内の数式定数やキャラクター固有の挙動には未到達です。

### Integration Patterns — How Lore Connects to Code

EDU の技術・世界観結合は 6 つの明確なパターンに分類できます。

**1. Canon Comments (正典注釈)**
`crates/` 配下の全 Rust クレートはモジュールレベルの `## Canon Mapping (Lore-Tech)` ドキュメントコメントで開始され、技術モジュールを世界観内概念にマッピングします。これは装飾ではなくアーキテクチャドキュメントです。

**2. Branded Types as "True Names"**
Rust の newtype (`ProofId`, `ReplayHash`, `WitnessDigest`, `BuildHash`) に `Canon:` コメントを付与し、各識別子を世界観内の「True Name」（名前が魔法/同一性を持つ概念）として位置付けます。このパターンは prover、CRDT bridge、compiler に横断しています。

**3. ADR-Driven Lore Mapping**
8 件の ADR (0001–0008) それぞれに "Lore-Tech Mapping" セクションが含まれ、全技術的意思決定を正典に形式的にリンクします。ADR-0003 (Apolon DSL) は 6 エントリの最も広範なマッピングを持ちます。

**4. Load-Bearing Proof Integration**
Lean 4 証明は独立した研究成果ではなく、Rust エンジンの**コンパイル時依存**です。`BoundedHp<MAX>` は Lean の `HP_INVARIANT_PROVEN` マーカーなしでは構築不可能で、証明を削除すると Rust エンジンがコンパイルエラーになります。トーナメント UI は Lean から抽出したバウンドを表示します。

**5. Wiki as Single Source of Truth**
Wiki データファイル (`characters.data.ts`, `organizations.data.ts` 等) は正典の唯一の情報源であり、チャットボット、キャラクターページ、ファクションページ、カード `affiliation` の全てが同じ wiki データを消費します。

**6. Phased Development as Narrative**
各開発フェーズ (α–θ) は物語的に位置付けられます — Apolon Execution Shrine (α)、Quantum Substrate / Apolonium Layer (β)、Liminal Forge Pipeline (γ)、Dimension Horizon Force Projection (δ)、Dimensional Witness Forge (ε)、Load-bearing Lean Proofs (ζ)、Temporal Anchor / Hermetic Builds (η)、AURALIS Collective Consensus Protocol (θ)、Browser-Native RAG Lorekeeper (ι)。

### Lore ↔ Technology Concept Map

| In-Universe Concept | Real Technology | Location |
|---|---|---|
| Apolon Execution Shrine | `no_std` Rust battle engine | `crates/edu-engine-core/src/lib.rs` |
| Liminal Forge compilation pipeline | Apolon DSL → WASM compiler | `crates/apolon-compiler/` |
| 8 Thought Layers | Battle FSM phases / `EffectType` enum | `crates/edu-engine-core/src/types.rs` |
| Dimension Horizon | Fixed-point boundary / `MAX_FIELD_SIZE=5` | `crates/edu-engine-core/src/fsm.rs` |
| Liminal Threshold | HP clamping invariant (0 ≤ hp ≤ max_hp) | `crates/edu-engine-core/src/bounded_hp.rs` |
| Apolonium Seeded Cascade | `xoshiro256++` RNG | `crates/edu-engine-core/src/rng.rs` |
| Apolonium quantum probability layer | Qiskit 8-qubit circuit + PMF | `quantum/apolonium_field.py` |
| Dimensional Witness Forge | ZK prover (Merkle commitment) | `crates/edu-prover/` |
| Dimension Horizon Observer | ZK verifier (WASM) | `crates/edu-verifier/` |
| True Names | Branded Rust newtypes | 全 crate の types |
| Timeline Fingerprint | `ReplayHash` branded type | `crates/edu-prover/src/types.rs` |
| Adversarial Seal | `WitnessDigest` branded type | `crates/edu-prover/src/types.rs` |
| Temporal Anchor | `BuildHash` branded type (Nix-derived) | `crates/edu-prover/src/types.rs` |
| AURALIS Consensus Protocol | Automerge CRDT bridge | `crates/edu-crdt-bridge/` |
| Lore Codex | Wiki CRDT document | `crates/edu-crdt-bridge/src/wiki.rs` |
| Resonance Configuration | Deck sync schema | `crates/edu-crdt-bridge/src/deck.rs` |
| Observer Beacon | Presence system | `crates/edu-crdt-bridge/src/presence.rs` |
| Observation Echo | Replay annotation | `crates/edu-crdt-bridge/src/annotation.rs` |
| Consensus Guardian Council | Moderation queue | `crates/edu-crdt-bridge/src/moderation.rs` |
| Life Force Axiom | `HpInvariant` Lean 4 theorem | `proofs/lean/Apolon/HpInvariant.lean` |
| Temporal Horizon Guarantee | `NoInfiniteCombo` Lean 4 theorem | `proofs/lean/Apolon/NoInfiniteCombo.lean` |
| Celestial hierarchy | Effect system (Pure/View/Mut) | `crates/apolon-compiler/src/ast.rs` |
| Lexicon of the Forge | Tree-sitter-apolon grammar | `tree-sitter-apolon/` |
| Dimensional script | WGSL compute shaders | `src/metal/webgpu/shaders/` |
| Dimensional isolation wards | COOP/COEP headers | ADR-0004 |
| EDU Universe Lorekeeper | RAG chatbot system prompt | `src/features/chatbot/engine/rag.ts` |

---

## 9-Phase Uplift Roadmap

| Phase                                | Status | Description                                                                                                                                                                    | ADR                                                     |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **α** no_std Core Extraction         | ✓      | `edu-engine-core` with `#![no_std]`, SIMD damage calc, Kani verification (6 proofs), Creusot specs, RISC-V bare-metal target                                                   | [0001](docs/adr/0001-no_std-core-extraction.md)         |
| **β** Quantum Substrate              | ✓      | Qiskit AerSimulator 8-qubit, `edu-quasi` Rust crate, byte-identical PMF, PBT distribution validation                                                                           | [0002](docs/adr/0002-quantum-substrate.md)              |
| **γ** Apolon DSL Compiler            | ✓      | Full compiler: lexer → parser → AST → IR → codegen → optimizer, type system, effect system, span-based errors                                                                   | [0003](docs/adr/0003-apolon-dsl.md)                     |
| **δ** WebGPU Compute Pipeline        | ✓      | WGSL compute shaders (AoE falloff, particle integration, ring buffer), device abstraction, Playwright E2E browser tests                                                        | [0004](docs/adr/0004-webgpu-compute-pipeline.md)        |
| **ε** ZK-Verified Replays            | ✓      | `edu-prover` (Merkle commitment + hash integrity), `edu-verifier` (standalone WASM-capable), ReplayStep/FieldSnapshot/OutcomeRecord branded types, BuildHash threading (V1/V2) | [0005](docs/adr/0005-zk-replay-verification.md)         |
| **ζ** Lean 4 Engine Theorems         | ✓      | 8 modules: Syntax, Typing, Effects, Progress, HpInvariant, TlvInjective, NoInfiniteCombo — battle termination proven, computeMaxTurns extracted to Rust                        | [0006](docs/adr/0006-lean-as-engine-load-bearing.md)    |
| **η** Hermeticity as ZK Prerequisite | ✓      | Nix flake, SLSA L3 provenance, cross-arch determinism (x86_64, aarch64, RISC-V), BuildHash branded type in V2 commitments                                                      | [0007](docs/adr/0007-hermeticity-as-zk-prerequisite.md) |
| **θ** CRDT Substrate                 | ✓      | Automerge CRDT bridge (`crates/edu-crdt-bridge/`), 3+1 integration surfaces, convergence PBT, transport abstraction (WebSocket/WebRTC/broadcast)                                 | [0008](docs/adr/0008-crdt-three-deep-integrations.md)   |
| **ι** Browser-Native RAG Chatbot     | ✓      | WebGPU LLM (WebLLM) + E5 embeddings (WASM) + cosine RAG search, 729 チャンク, zero recurring cost, isolated CI workflow                                                          | —                                                       |

---

## Architecture

**Domain Cluster Architecture** — 各ドメインは独立した AGENTS.md を持ち、AI エージェントが自律的に開発・拡張可能。共有インフラは `platform/` に集約、ハードウェア最接近層は `metal/` に分離、`app/` は薄い合成層。

```
┌───────────────────────────────────────────────────────────────┐
│  domains/                                                     │
│  ├── wiki/          Wiki 百科事典 (BM25 全文検索 + 転置インデックス) │
│  ├── cards/         カードデータ + デッキストア (Zustand + CRDT)  │
│  ├── battle/        バトルエンジン (FSM + Canvas 2D + ZK)       │
│  ├── stories/       小説アーカイブ (22 話, EN/JP)                 │
│  └── civilizations/ 文明データ (5 大文明 + 指導者)                │
├───────────────────────────────────────────────────────────────┤
│  features/  独立フィーチャー (chatbot — RAG + WebLLM)            │
├───────────────────────────────────────────────────────────────┤
│  platform/  共有基盤 — event-bus, Zod schemas, shadcn/ui       │
├───────────────────────────────────────────────────────────────┤
│  metal/     WASM bridge, TLV binary protocol, Web Workers      │
├───────────────────────────────────────────────────────────────┤
│  app/       Next.js App Router — ルーティングと JSX 構成のみ    │
├───────────────────────────────────────────────────────────────┤
│  crates/    Rust エコシステム (22,424 行, 13 crates, no_std)   │
│  lean/      Lean 4 機械化証明 (8 modules, 1,818 lines)         │
│  quantum/   Qiskit 8-qubit entanglement circuit                │
└───────────────────────────────────────────────────────────────┘
```

| Layer         | Lines   | Responsibility                                                    |
| ------------- | ------- | ----------------------------------------------------------------- |
| **domains/**  | ~33K    | ビジネスドメイン (wiki, cards, battle, stories, civilizations)    |
| **features/** | ~3.4K   | 独立フィーチャー (chatbot — RAG engine, WebLLM, UI)               |
| **app/**      | ~9K     | Next.js ルーティング + ページコンポジション (23 routes)           |
| **metal/**    | ~2.3K   | WASM bridge, TLV binary protocol, Service Worker, Web Workers     |
| **platform/** | ~863    | Event bus, Zod schemas, shadcn/ui, validators, invariants         |
| **lib/**      | ~3K     | 後方互換ユーティリティ                                            |
| **crates/**   | 22,424  | Rust → WASM/native/RISC-V/Quantum/PQC/ZK/CRDT (13 crates, no_std) |
| **lean/**     | 1,818   | Lean 4 機械化証明 (Syntax, Typing, Effects, Progress, etc.)       |
| **quantum/**  | ~200    | Qiskit 8-qubit circuit, PMF generation                            |

### Dependency Rules

| Rule                 | Implementation                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------- |
| **Domain isolation** | 各ドメインは独立 AGENTS.md に従い開発。ドメイン間は `@/platform/event-bus` (typed pub/sub)    |
| **Feature isolation** | `features/` は他ドメインに依存せず独立動作。chatbot は `public/rag/` の静的アセットのみ消費         |
| **Metal separation** | WASM/Binary/Worker は `@/metal/` に隔離。app 層からは `wasm-bridge` 経由                      |
| **Thin composition** | `app/` はロジックを持たず、domains からデータを取得して JSX を構成                            |
| **Branded Types**    | CardId, EnemyId, WikiId, ReplayStep, FieldSnapshot, OutcomeRecord, BuildHash で型安全性を保証 |

---

## Rust Crate Map

| Crate                 | In-Universe Identity              | Description                                                              |
| --------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `edu-engine-core`     | Apolon Execution Shrine           | `#![no_std]` バトルエンジン中核 — SIMD ダメージ計算, FSM, タイプシステム |
| `edu-engine-wasm`     | —                                 | WASM バインディング — `wasm-bindgen` でブラウザから Rust エンジンを呼出  |
| `edu-engine-native`   | —                                 | ネイティブ CLI ターゲット — benchmark, replay シミュレーション           |
| `edu-engine-embedded` | —                                 | RISC-V bare-metal ターゲット — `riscv64gc`, no_std                       |
| `edu-battle-engine`   | —                                 | バトルロジック層 — 敵 AI, フェーズ遷移, ターン管理                       |
| `edu-prover`          | Dimensional Witness Forge         | ZK 証明生成 — Merkle commitment, hash-based integrity proofs (V1/V2)     |
| `edu-verifier`        | Dimension Horizon Observer        | ZK 検証 — standalone verification, WASM-capable                          |
| `edu-pqc`             | —                                 | Post-Quantum Cryptography — ML-KEM-768, ML-DSA-44, PBT 検証              |
| `edu-quasi`           | Apolonium Field Interpreter       | 量子回路シミュレータ — Qiskit と byte-identical PMF, 8-qubit             |
| `apolon-compiler`     | Liminal Forge Compilation Pipeline | Apolon DSL コンパイラ — lexer → parser → AST → IR → codegen → optimizer  |
| `edu-crdt-bridge`     | AURALIS Consensus Protocol        | CRDT 統合ブリッジ — Automerge, 3+1 統合面, convergence PBT, transport 層 |
| **Cargo workspace**   | —                                 | 全 crate を統括する workspace (`crates/Cargo.toml`)                      |

---

## CI/CD Pipeline

| Workflow                     | Purpose                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `balance-gate`               | Lean 4 バトルバランス検証 — `computeMaxTurns` 定理チェック |
| `cross-platform-determinism` | x86_64 / aarch64 / RISC-V クロスアーキテクチャ決定性検証   |
| `crdt-convergence`           | CRDT 収束テスト — 複数ノードでの状態一致 PBT               |
| `reproducibility`            | ビルド再現性検証 — 同一 commit → 同一 binary hash          |
| `slsa-provenance`            | SLSA L3 ビルド出所証明 — supply chain integrity            |
| `wasm-hash-lock`             | WASM binary hash ロック — 意図しない変更の検出             |
| `zk-prove-verify`            | ZK 証明/検証パイプライン — prover × verifier 整合性テスト  |
| `chatbot-build`              | Chatbot RAG パイプライン + unit tests + build              |

---

## Universe Setting

**E16 連星系** (M104 ソンブレロ銀河ハロー)。人類は 4 つの銀河団を経由して定住。AD2026 現在、E16 連星系の AURALIS 第二世代が地球との交信プロジェクト「Liminal Forge」を運用中。

### Major Factions

| Faction | Era | Description |
|---|---|---|
| **AURALIS Collective** | E290–E400 (第一世代) → E522–present (第二世代) | 芸術・文化組織「光と音を永遠にする」。E400 エヴァトロン弾圧で解体後、E522 に第二世代 (Kate Patton, Lillie Ardent, Layla Virell Nova, Mina Eureka Ernst, Ninny Offenbach) が再興 |
| **Trinity Alliance** | E510–present | Iris 率いる同盟 (Vermillion, Mieltinga, Bogdas Javelin) |
| **V7 (Vital Seven)** | E515–present | Fiona 率いる 7 カ国連合 |
| **Alpha Venom** | E318–present | Izumi 率いる暗黒組織 (Silver Venom の後継) |
| **Liminal Forge** | E528–present | E528→AD2026 時空放送プロジェクト。Persephone 仮想宇宙 → Dimension Horizon → 地球インターネット |

### Key Timeline

| Era | Event |
|---|---|
| E0 | Timur Shah の第10次元 Horasm 理論、Persephone 設計 |
| E270 | Kate Claudia が Lily Steiner と出会う、AURALIS 創設 |
| E290 | AURALIS 正式組織化 |
| E318 | Alpha Kane 覚醒、Shadow Rebellion |
| E325 | Layla Virell Nova が AURALIS に参加 |
| E335–E370 | セリア・ドミニクス黄金期、AURALIS 最盛期 |
| E400 | エヴァトロン弾圧、AURALIS 解体、Kate/Lily 逮捕 |
| E499 | Mina Eureka Ernst 誕生 |
| E522 | AURALIS 第二世代始動 |
| E528 | 現在。Liminal Forge 運用中。地球 AD2026 へ交信 |

### 8 Thought Layers (Epoch 9)

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

| Category                | Technology                                                                   |
| ----------------------- | ---------------------------------------------------------------------------- |
| **Framework**           | Next.js 16 (App Router, Turbopack)                                           |
| **Language**            | TypeScript 5 (strict, noUncheckedIndexedAccess)                              |
| **Styling**             | Tailwind CSS v4 + tw-animate-css                                             |
| **UI Components**       | shadcn/ui (Radix primitives)                                                 |
| **Animation**           | Framer Motion 12                                                             |
| **State Management**    | Zustand 5                                                                    |
| **Validation**          | Zod 4                                                                        |
| **ORM**                 | Prisma 6                                                                     |
| **WASM Engine**         | Rust (wasm-pack, 148KB .wasm)                                                |
| **Formal Verification** | Lean 4 (8 modules, 1,818 lines — battle theorems) + Kani (6 proofs)          |
| **Quantum**             | Qiskit AerSimulator (8-qubit) + edu-quasi (Rust)                             |
| **Hermeticity**         | Nix flake — reproducible builds across x86_64/aarch64/RISC-V                 |
| **Browser LLM**         | @mlc-ai/web-llm (WebGPU — Qwen2.5/Llama 3.2)                                |
| **Embeddings**          | @xenova/transformers (WASM — multilingual-e5-small, 384-dim)                 |
| **RAG Pipeline**        | Build-time embedding + runtime cosine similarity (zero API cost)              |
| **Testing**             | Vitest 4 + Testing Library + fast-check (PBT) + Lean 4 CI                    |
| **Linting**             | ESLint 9 (custom: no-cross-domain-import, require-jsdoc) + SonarJS + Unicorn |
| **Git Hooks**           | Husky + lint-staged                                                          |
| **CI/CD**               | GitHub Actions (8 workflows)                                                 |
| **Deployment**          | Netlify (@netlify/plugin-nextjs)                                             |
| **Runtime**             | Bun                                                                          |

---

## Features

| Category             | Content                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Wiki**             | 285+ 項目 (キャラクター 94, 組織 47, 地理 49, 技術 48, 用語 26, 歴史 21) — BM25 全文検索 + 自動リンク |
| **Story**            | 5 章 22 話の連作小説。EN/JP 言語切替。SSG + ISR 1h                                                    |
| **Card Game**        | 76 キャラクターカード (C/R/SR) + 10 種敵による PvE ターン制バトル。Rust WASM エンジン                 |
| **Civilizations**    | 宇宙 5 大文明 + その他文明 + 指導者データ                                                             |
| **Timeline**         | AD3500 ~ E528 の統合年表                                                                              |
| **RAG Chatbot**      | ブラウザネイティブ EDU 質問箱 — WebGPU LLM + E5 埋め込み + コサイン類似度検索、ゼロ継続コスト          |
| **Card Forge**       | Apolon DSL カード作成 — Lean 4 型チェッカーで検証 (UGC)                                                |
| **ZK Replays**       | Merkle commitment + hash integrity によるリプレイ検証。WASM-verifier でブラウザ検証                   |
| **CRDT Multi-user**  | デッキ同期・リプレイ注釈・Lore Wiki・UGC 審査のサーバーレス協調                                         |
| **Tournament**       | Lean 4 から抽出したターン上限を表示するトーナメント管理                                                |
| **Ranking**          | E16 連星系経済 n-token ランキング                                                                      |

### Pages (23 routes)

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
| `/chatbot`              | EDU 質問箱 (RAG chatbot info + panel)      | CSR          |
| `/replay/[id]`          | Replay viewer with annotation layer       | CSR          |
| `/decks`                | Deck sync (CRDT multi-user)               | CSR          |
| `/lore/wiki`            | Lore wiki (CRDT collaborative)            | CSR          |
| `/lore/wiki/[slug]`     | Wiki article detail                       | CSR          |
| `/admin/moderation`     | UGC moderation queue                      | CSR          |
| `/forge`                | Card forge (golden card editor)           | CSR          |
| `/forge/editor`         | Card editor with live preview             | CSR          |
| `/forge/gallery`        | Golden card gallery                       | CSR          |
| `/tournament`           | Tournament admin                          | CSR          |

> 💬 全ページにフローティングチャットボタン (`ChatbotPortal`) が表示され、どこからでも EDU 世界観について質問できます。

---

## Card Game System

PvE ターン制カードバトル。76 枚のキャラクターカードから 5 枚を選択し、4 階級 10 種の敵と戦う。バトルエンジンは Rust 実装 → WASM (148KB) でブラウザ上で高速動作。全カードの `affiliation` と `flavor_text` は世界観準拠。

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
| **ZK Replay**   | Merkle commitment + BuildHash (V1/V2), WASM verifier            |

### EffectType System

9 値の enum (HEAL, DAMAGE, SHIELD, HEAL_DAMAGE, DAMAGE_SHIELD, HEAL_SHIELD, HEAL_DAMAGE_SHIELD, ATTACK_REDUCTION, SPECIAL_PANDICT)。コメントで「各 variant は Thought Layer の共鳴パターンに対応」と明記。全 case が exhaustive check で網羅性をコンパイル時保証。

---

## Development

### Commands

```bash
# TypeScript / Next.js
bun dev              # Dev server :3000
bun run build        # Production build (tsc + prebuild validation + SSG)
bun start            # Production server
bun test             # 873 TS tests (vitest run)
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

# Rust
cd crates && cargo build                 # Build all crates
cd crates && cargo test                  # 161 Rust tests (306 test functions)
cd crates && cargo clippy -- -D warnings  # Zero warnings
cd crates && cargo fmt                   # Format check
cd crates/edu-engine-embedded && cargo build --target riscv64gc-unknown-none-elf  # RISC-V bare-metal
cd crates && cargo run -p edu-prover     # ZK proof generation

# Lean 4
cd lean && lake build                    # Build Lean 4 proofs
cd lean && lake exe balance_gate         # Run balance verification
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

| Metric                    | Status                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| TypeScript strict mode    | noUncheckedIndexedAccess                                                                             |
| `any` type count          | 0 (enforced by ESLint)                                                                               |
| `eslint-disable`          | 0 (enforced)                                                                                         |
| Zod build-time validation | validate-data.ts (285 Wiki ID uniqueness, etc.)                                                      |
| Test suite                | 873 TS tests + 161 Rust tests (306 test functions, 775 `#[test]`), all passing                       |
| Coverage                  | 91.72% (V8 provider)                                                                                 |
| PBT properties            | 56 (fast-check) + 9 (Rust)                                                                           |
| Formal verification       | 6 Kani proofs + Lean 4 8 modules (1,818 lines) — battle termination, upper bound, format injectivity |
| Hermeticity               | Nix flake + SLSA L3 provenance + cross-arch determinism                                              |
| Build hash                | BuildHash branded type in all V2 proof commitments                                                   |
| ESLint                    | --max-warnings=0 (custom: no-cross-domain-import, require-jsdoc)                                     |
| Bundle size (gzip)        | Max chunk 158KB                                                                                      |
| WASM                      | 148KB .wasm (no_std core)                                                                            |
| Rust targets              | x86_64, wasm32, riscv64gc (bare-metal)                                                               |
| Clippy                    | -D warnings (zero warnings)                                                                          |
| Lean 4 CI                 | balance-gate workflow — `computeMaxTurns` 定理チェック                                               |
| CRDT convergence          | PBT convergence tests in CI                                                                          |
| Chatbot tests             | 19 unit tests (cosine similarity, RAG prompt assembly, embedding encode/decode)                       |
| Build                     | 23 route directories, 0 errors                                                                       |

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

| Metric                  | Value                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **TypeScript**          | ~70K lines (domains + features + app + platform + metal)                                                                                                                                                                 |
| **Rust**                | 22,424 lines, 13 crates (edu-engine-core, edu-engine-wasm, edu-engine-native, edu-engine-embedded, edu-battle-engine, edu-prover, edu-verifier, edu-pqc, edu-quasi, apolon-compiler, edu-crdt-bridge, + Cargo workspace) |
| **Lean 4**              | 8 modules (Syntax, Typing, Effects, Progress, HpInvariant, TlvInjective, NoInfiniteCombo), 1,818 lines                                                                                                                   |
| **Test suite**          | 873 TS + 161 Rust (306 test functions, 775 `#[test]` annotations)                                                                                                                                                        |
| **CI Workflows**        | 8 (balance-gate, cross-platform-determinism, crdt-convergence, reproducibility, slsa-provenance, wasm-hash-lock, zk-prove-verify, chatbot-build)                                                                          |
| **ADR documents**       | 8                                                                                                                                                                                                                        |
| **Hermeticity**         | Nix flake + SLSA L3 + reproducibility + cross-arch determinism (x86_64/aarch64/RISC-V)                                                                                                                                   |
| **Formal verification** | 6 Kani proofs + Lean 4 theorems (8 modules, 1,818 lines — battle termination proven, computeMaxTurns extracted)                                                                                                          |
| **Quantum**             | 8-qubit AerSimulator, byte-identical PMF (Qiskit + edu-quasi)                                                                                                                                                            |
| **PQC**                 | ML-KEM-768 + ML-DSA-44                                                                                                                                                                                                   |
| **CRDT Bridge**         | 3,163 lines (`crates/edu-crdt-bridge/`), 3+1 integration surfaces                                                                                                                                                        |
| **RAG Chatbot**         | 16 files, 729-chunk corpus, 384-dim embeddings, zero recurring cost                                                                                                                                                      |
| **Benchmarks**          | 27 (TS) + 16 (Rust criterion.rs)                                                                                                                                                                                         |
| **App routes**          | 23 directories                                                                                                                                                                                                           |
| **Wiki entries**        | 285+ (6 categories)                                                                                                                                                                                                      |
| **Cards**               | 76 player cards, 10 enemies                                                                                                                                                                                              |
| **Stories**             | 22 chapters, EN/JP                                                                                                                                                                                                       |
| **Domains**             | 5 (wiki, cards, battle, stories, civilizations)                                                                                                                                                                          |
| **Features**            | 1 (chatbot)                                                                                                                                                                                                              |
| **Lore-Tech Integration** | 93% deeply integrated (13/14 technologies)                                                                                                                                                                              |
