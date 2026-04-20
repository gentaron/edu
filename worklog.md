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
---
Task ID: 1
Agent: Main Agent
Task: Integrate Iris story into EDU guide website with timeline consistency

Work Log:
- Read full page.tsx (~1700 lines) to understand existing structure
- Added "iris" section to navigation (SECTIONS array)
- Added 3 new locColor entries for ヴァーミリオン, ブルーローズ, ミエルテンガ
- Expanded East Continent geography with 3 new nations: SUDOM, ファティマ連邦, スターク三国
- Added 4 new Iris story events to Period 4 (E480-E495 timeline: street fights, spy agency, Silver Venom, Bogdas Javelin)
- Added 8 new Iris story events to Period 5 (E495-E528: agency promotion, V7, Alpha Venom, Trinity Alliance, Fiona betrayal, cold war)
- Created full IrisSection component with: portrait, profile info, abilities (ブルーワイヤ/ウォーター・オーブ/ブラックダイス/戦略分析), key relationships, story timeline, political landscape (Trinity/V7/Alpha Venom), external link
- Added Iris Worlds link to Liminal Forge platforms
- Added "Iris Worlds" badge to Hero section
- Build passed successfully

Stage Summary:
- Iris story fully integrated into EDU timeline with consistent E-calendar dates
- New dedicated character page for Iris with comprehensive profile
- All navigation, geography, timeline, and character sections updated
- External link to irisworlds.netlify.app/story added in 2 places

---
Task ID: 2
Agent: Main Agent
Task: Expand wiki character entries and update timeline with Sub Narrative lore

Work Log:
- Read worklog.md, wiki/page.tsx (CHARACTERS array), page.tsx (TIMELINE_DATA) to understand current state

### Wiki Changes (src/app/wiki/page.tsx):

**Expanded existing character descriptions (11 characters):**
1. **Jen** — Added context about ZAMLT collapse power vacuum, Alpha Kane influence, status as oldest active Tier 1
2. **Tina/Gue** — Expanded with Eva tron era underground rule, dual identity mystery, Gue's Story core narrative reference, underground economy control
3. **弦太郎 (Gentaro)** — Expanded from 1 sentence to full description: Lv569, E325 AURALIS involvement, witnessed Celia Golden Age through AURALIS 2nd gen revival, connection to Layla's slime crisis activities
4. **エリオス・ウォルド (Elios Wald)** — Expanded with Terian rebellion context, A-Registry abolition platform, E470 execution impact on Tekrosas/Crescent politics
5. **セバスチャン・ヴァレリウス** — Expanded with Tekrosas lineage, E490 permanent stationing, rescue operations E510/E519, Trinity Alliance military pillar role
6. **フィオナ** — Expanded with E490 debut, Iris rescue E510, V7 founding E515, E520 Trinity cooperation, E523-525 Alpha Venom betrayal, Piatorino underground network
7. **マリーナ・ボビン** — Expanded with V7 founding role, Trinity Alliance duplicity, Fiona conspiracy theory, "true mastermind" possibility
8. **カスチーナ・テンペスト** — Expanded with V7 founding, independent political strategy, explicit note that Casteria Grenvelt is a different person
9. **イズミ** — Expanded with E518 Alpha Venom expansion, E519 Iris re-kidnapping, subordinate network, dual espionage with Fiona
10. **Slime Woman** — Expanded with Persephone/Timur Shah context, Tier Ω→Tier Ε dimensional origin, slime crisis indirect involvement, specific individual (Jun) interaction, 200-year existence
11. **アヤカ・リン** — Expanded with E380 slime crisis actions, E525 Matrical Reform Movement alliance with Garo and Zena

**Added sourceLinks:**
- 弦太郎: Gentaro's Story (sub)
- Tina/Gue: Gue's Story (core)
- Slime Woman: Jun's Story (sub)

**Added 4 new Sub Narrative characters:**
1. **カステリア・グレンヴェルト (Casteria Grenvelt)** — Gigapolis section, kasuteriasan.txt, explicit note about being different from Castina Tempest
2. **シトラ・セレス (Sitra Celes)** — Gigapolis section, sitra.txt
3. **ミュー (Myu)** — Gigapolis section, Myustory.txt
4. **ジュン (Jun)** — Gigapolis section, Junandslime.txt, Slime Woman connection described

All new characters have: image URLs, sourceLinks, tier "Sub Narrative"

### Main Page Timeline Changes (src/app/page.tsx):

**Period 3 (E319-E400):**
- E325: Expanded Gentaro entry with Gentaro's Story reference
- E340: Expanded Slime Woman entry with Jun interaction and Junandslime.txt reference

**Period 5 (E475-E528):**
- E522: Added Gentaro continuing AURALIS activities alongside 2nd gen founding
- E528: Added new Sub Narrative entry referencing Casteria, Sitra, Myu, Jun with importance note

### Build verification:
- `npx next build` passed successfully with no errors

Stage Summary:
- 11 existing characters expanded with richer descriptions
- 4 new Sub Narrative characters added (Casteria Grenvelt, Sitra Celes, Myu, Jun)
- 3 characters received new sourceLinks (Gentaro, Tina/Gue, Slime Woman)
- 4 timeline entries added/expanded in main page
- All existing data preserved intact, no deletions or breaking changes
- Lore consistency maintained with Core Narrative as authoritative

