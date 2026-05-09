<div align="center">

# EDU — Eternal Dominion Universe

**E16 連星系を舞台とするオリジナル SF ユニバース · 技術と物語の深い統合**

</div>

[![CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg)](https://github.com/gentaron/edu/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Rust](https://img.shields.io/badge/Rust-no__std-CE422B?style=flat-square&logo=rust)](https://www.rust-lang.org)
[![Lean 4](https://img.shields.io/badge/Lean_4-Formal_Verification-2D6B4E?style=flat-square)]()
[![Tests](https://img.shields.io/badge/Tests-873_%2B_161_Rust-22C55E?style=flat-square)]()
[![Coverage](https://img.shields.io/badge/Coverage-91.72%25-4CAF50?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)]()

---

## TL;DR

**EDU** は E16 連星系を舞台に 500 年以上の宇宙史を描くオリジナル SF ユニバースプロジェクト。285+ 項目の百科事典、22 話の小説、76 枚のカードゲームを、Rust `no_std` WASM エンジン・Lean 4 形式検証・ZK 証明・ブラウザネイティブ RAG チャットボットといった研究級技術スタックで表現している。技術は世界観内の概念として物語に根付いており、両者は分離不可能に統合されている。

---

## Quick Start

```bash
git clone https://github.com/gentaron/edu.git && cd edu
bun install
bun dev            # http://localhost:3000
bun run build      # production build
bun test           # 873 TS tests + 161 Rust tests
bun run lint       # eslint --max-warnings=0
```

> **Runtime**: Bun · **Framework**: Next.js 16 App Router · **Deploy**: Netlify

---

## Features

| Feature               | 説明                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| **Wiki 百科事典**     | 285+ 項目、7 カテゴリ（キャラクター・組織・地理・技術・用語・歴史）、EN/JP bilingual、BM25 全文検索 |
| **Story 小説集**      | 5 章 22 話の連作小説、EN/JP 言語切替、SSG + ISR                                                     |
| **Card Game PvP**     | 76 キャラクターカード (C/R/SR) · Rust WASM バトルエンジン (148KB) · ZK-Verified Replays             |
| **Timeline 統合年表** | AD3500 〜 E528 の 500 年宇宙史、キャラクター個別年表付き                                            |
| **Character Pages**   | AURALIS、Mina、Iris 等の詳細キャラクターページ、ファクション別 tier list                            |
| **RAG Chatbot**       | ブラウザネイティブ EDU 質問箱 — WebGPU LLM + E5 embeddings + cosine RAG、ゼロ継続コスト             |
| **Card Forge**        | Apolon DSL カード作成 — Tree-sitter 構文検査 + Lean 4 型検証 (UGC)                                  |
| **CRDT Multi-user**   | デッキ同期・リプレイ注釈・Lore Wiki のサーバーレス協調                                              |

---

## Tech Stack

| Layer                   | Technology                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **Frontend**            | Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Framer Motion                    |
| **Language**            | TypeScript 5 (strict) · Zustand · Prisma                                           |
| **WASM Engine**         | Rust `no_std` — 13 crates, 22,400+ 行, 148KB .wasm                                 |
| **Formal Verification** | Lean 4 (8 modules) · Kani (6 proofs) — Lean 証明は Rust エンジンのコンパイル時依存 |
| **ZK / Crypto**         | Merkle commitment replays · Post-Quantum (ML-KEM/ML-DSA) · BuildHash provenance    |
| **Quantum**             | Qiskit 8-qubit entanglement circuit + Rust PMF (byte-identical)                    |
| **AI / RAG**            | Browser-native WebGPU LLM · E5 embeddings (WASM) · zero API cost                   |
| **Hermeticity**         | Nix flake · SLSA L3 provenance · cross-arch (x86_64/aarch64/RISC-V)                |
| **Runtime**             | Bun · Vitest · ESLint --max-warnings=0 · GitHub Actions (8 workflows)              |

---

## Universe

**E16 連星系** — M104 ソンブレロ銀河ハローに位置する連星系。人類は 4 つの銀河団を経由して定住し、独自の文明を築いてきた。

### 主要ファクション

| Faction                | Era                      | 概要                                                                    |
| ---------------------- | ------------------------ | ----------------------------------------------------------------------- |
| **AURALIS Collective** | E290–E400 → E522–present | 「光と音を永遠にする」芸術・文化組織。E400 弾圧で解体後、第二世代が再興 |
| **Trinity Alliance**   | E510–present             | Iris 率いる同盟 (Vermillion, Mieltinga, Bogdas Javelin)                 |
| **V7 (Vital Seven)**   | E515–present             | Fiona 率いる 7 カ国連合                                                 |
| **Alpha Venom**        | E318–present             | Izumi 率いる暗黒組織                                                    |
| **Liminal Forge**      | E528–present             | E528 → AD2026 時空放送プロジェクト。地球との交信ゲートウェイ            |

### Key Timeline

| Era  | Event                                                   |
| ---- | ------------------------------------------------------- |
| E0   | Timur Shah の Horasm 理論、Persephone 設計              |
| E270 | AURALIS 創設                                            |
| E400 | エヴァトロン弾圧、AURALIS 解体                          |
| E522 | AURALIS 第二世代始動 (Kate, Lillie, Layla, Mina, Ninny) |
| E528 | 現在。Liminal Forge 運用中。地球 AD2026 へ交信          |

---

## Repository Network

EDU ユニバースは 11 のクロスリンクされたサイトで構成されている：

| Site                 | URL                                                                            |
| -------------------- | ------------------------------------------------------------------------------ |
| **AURALIS**          | [auralis-eternal-light.lovable.app](https://auralis-eternal-light.lovable.app) |
| **Kate Patton**      | [katepatton.lovable.app](https://katepatton.lovable.app)                       |
| **Lillie Ardent**    | [lillieardentsuper.lovable.app](https://lillieardentsuper.lovable.app)         |
| **Ninny Offenbach**  | [ninnyoffenbach.lovable.app](https://ninnyoffenbach.lovable.app)               |
| **Kate Claudia**     | [kate1st.netlify.app](https://kate1st.netlify.app)                             |
| **E16 Portal**       | [e16super.netlify.app](https://e16super.netlify.app)                           |
| **Eureka Space**     | [eurekaspace.netlify.app](https://eurekaspace.netlify.app)                     |
| **Iris Worlds**      | [irisworlds.netlify.app](https://irisworlds.netlify.app)                       |
| **Layla Land**       | [laylaland.netlify.app](https://laylaland.netlify.app)                         |
| **Game of Mina**     | [game-of-mina.netlify.app](https://game-of-mina.netlify.app)                   |
| **Orbital Eternity** | [orbital-eternity.netlify.app](https://orbital-eternity.netlify.app)           |

### GitHub Repositories

| Repo                                                    | 役割                         |
| ------------------------------------------------------- | ---------------------------- |
| [gentaron/edu](https://github.com/gentaron/edu)         | Main application (this repo) |
| [gentaron/edutext](https://github.com/gentaron/edutext) | Story texts (JP/EN)          |
| [gentaron/image](https://github.com/gentaron/image)     | Character artwork            |
| [gentaron/edunft](https://github.com/gentaron/edunft)   | NFT card metadata            |
| [gentaron/edu-agi](https://github.com/gentaron/edu-agi) | AGENTS.md management         |

---

## Development

```bash
# TypeScript / Next.js
bun dev              # Dev server :3000
bun run build        # Production build
bun test             # 873 TS tests (vitest)
bun run test:coverage
bun run lint         # ESLint --max-warnings=0
bun run bench        # TS + Rust benchmarks
bun run db:push      # Prisma DB sync

# Rust (13 crates)
cd crates && cargo build                 # Build all
cd crates && cargo test                  # 161 tests
cd crates && cargo clippy -- -D warnings # Zero warnings

# Lean 4
cd lean && lake build                    # Build proofs
cd lean && lake exe balance_gate         # Balance verification
```

### Contributing

- **Wiki**: Edit data files in `src/domains/wiki/` (characters, organizations, geography, technology, terms, history)
- **Stories**: Add JP/EN `.txt` to [gentaron/edutext](https://github.com/gentaron/edutext), register in `src/domains/stories/stories.meta.ts`
- **Artwork**: Push PNG to [gentaron/image](https://github.com/gentaron/image) (400x400px+, PascalCase naming)

---

## License

[MIT](LICENSE)
