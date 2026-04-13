# Eternal Dominion Universe Guide Website — Worklog

## 概要
Eternal Dominion Universe (EDU) の統合時空構造書 v3.0 をベースにした、包括的SFガイドウェブサイトを構築しました。すべてのコンテンツは日本語で記述されています。

## 実施日時
2026-04-12

## 技術スタック
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + カスタムCSS（cosmic theme）
- **Components**: shadcn/ui (Accordion, Badge, etc.)
- **Icons**: Lucide React
- **Font**: Noto Sans JP (Google Fonts)
- **Animations**: CSS keyframes + IntersectionObserver scroll reveals
- **Images**: AI生成 (z-ai-generate CLI)

## 生成画像
1. **edu-hero.png** (1344x768) — ヒーローセクション背景: 二元星系の宇宙風景
2. **edu-auralis.png** (1024x1024) — AURALISセクション用: 光と音の宇宙的エネルギー
3. **edu-mina.png** (768x1344) — ミナ・エウレカ・エルンストのポートレート
4. **edu-liminal.png** (1024x1024) — リミナル・フォージ用: 時空ワームホール

## セクション構成
1. **Hero** — フルスクリーンの宇宙背景、タイトル、バッジ
2. **宇宙・星系構造** — E16連星系データ + シンフォニー・オブ・スターズ地理
3. **統合年表** — 5期間のインタラクティブアコーディオンタイムライン
4. **AURALIS Collective** — 第一世代・第二世代の並列カード
5. **ミナ・エウレカ・エルンスト** — キャラクタープロフィール（ポートレート付き）
6. **リミナル・フォージ** — 時相放送メカニズム + プラットフォーム一覧
7. **整合性ノート** — 発光するグラデーションボーダーの特別セクション
8. **キャラクターTier表** — 3層のTier表示 + IRISランキング
9. **勢力系譜** — 3つの系譜ツリー（テクロサス、Alpha Venom、政体）

## デザイン特徴
- ダークテーマ（宇宙的カラーパレット: 紫/青/金）
- ガラスモーフィズムカード（backdrop-blur + 半透明背景）
- 星のフィールドアニメーション（120個のランダムな星）
- スクロールリビールアニメーション（IntersectionObserver）
- 整合性ノート特別スタイリング（発光するアニメーションボーダー）
- レスポンシブデザイン（モバイルファースト）
- フローティングナビゲーションバー（アクティブセクション追跡）
- カスタムスクロールバー

## ファイル変更
- `src/app/layout.tsx` — Noto Sans JP フォント、ダークモード、日本語lang
- `src/app/globals.css` — 完全なカスタムcosmicテーマCSS
- `src/app/page.tsx` — 全ページのコンテンツ（1400+ 行）
- `public/edu-hero.png` — AI生成ヒーロー画像
- `public/edu-mina.png` — AI生成ミナポートレート
- `public/edu-auralis.png` — AI生成AURALIS画像
- `public/edu-liminal.png` — AI生成リミナルフォージ画像
