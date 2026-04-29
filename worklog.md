# Worklog: Add `leaders` arrays to wiki-data.ts

## Date: 2025-01-01

## Task

Add `leaders` arrays to ALL organization/civilization/nation Wiki entries in `/home/z/my-project/src/lib/wiki-data.ts`.

## Changes Made

### 1. New Character Entries Added to CHARACTERS Array (7 entries)

Added before the closing `]` of the CHARACTERS array (after オメガ＝ユリシア):

| ID                     | Name          | Role                       | Affiliation          |
| ---------------------- | ------------- | -------------------------- | -------------------- |
| ファランクス           | Phalanx       | バーズ帝国初代皇帝         | バーズ帝国           |
| セルヴァ・ドーン       | Selva Dawn    | SUDOM初代医療総裁          | SUDOM                |
| ハシーム・ファティマ   | Hashim Fatima | ファティマ連邦初代連邦議長 | ファティマ連邦       |
| トリスタン・スターク   | Tristan Stark | スターク三国軍事理事長     | スターク三国         |
| オーギュスト・ゴールド | August Gold   | ゴールデン・ヴェノム創設者 | ゴールデン・ヴェノム |
| ルシア・ネオ           | Lucia Neo     | ネオクラン同盟初代代表     | ネオクラン同盟       |
| ヘクトル・ヴァン       | Hector Van    | UECO初代議長               | UECO                 |

### 2. Leaders Arrays Added to TERMINOLOGY Entries (43 entries)

**Main Organizations:**

- AURALIS (4 leaders: Kate Claudia, Lily Steiner, Kate Patton, Lillie Ardent)
- ZAMLT (6 leaders: エリオット・シュトラス + 5 CEOs)
- ネオクラン同盟 (1 leader: ルシア・ネオ)
- UECO (1 leader: ヘクトル・ヴァン)
- シャドウ・リベリオン (1 leader: アルファ・ケイン)
- コーポラタムパブリカ (1 leader: エリオット・シュトラス)
- EVILS (1 leader: オメガ＝ユリシア)

**Crescent Region Nations:**

- ヴァーミリオン (1 leader: アザゼル)
- ブルーローズ (1 leader: フィオナ)
- ミエルテンガ (1 leader: マリーナ・ボビン)
- クロセヴィア (1 leader: カスチーナ・テンペスト)
- SSレンジ (1 leader: アイク・ロペス)
- アイアン・シンジケート (1 leader: レイド・カキザキ)
- SUDOM (1 leader: セルヴァ・ドーン)
- ファティマ連邦 (1 leader: ハシーム・ファティマ)
- スターク三国 (1 leader: トリスタン・スターク)

**Military/Opposition Organizations:**

- シルバー・ヴェノム (2 leaders: マスター・ヴェノム, レオン)
- アルファ・ヴェノム (1 leader: イズミ)
- ゴールデン・ヴェノム (1 leader: オーギュスト・ゴールド)
- ボグダス・ジャベリン (1 leader: セバスチャン・ヴァレリウス)
- V7 (5 leaders: フィオナ, カスチーナ, アイク, レイド, ヨニック)
- トリニティ・アライアンス (1 leader: アイリス)
- テクロサス (1 leader: クロノ・ヴァーレント)

**Planets & Civilizations:**

- Eros-7 (3 leaders: リリス・ヴェイン, シルヴィア・クロウ, カーラ・ヴェルム)
- バーズ帝国 (1 leader: ファランクス)
- ファールージャ社 (1 leader: ミカエル・ガブリエリ)
- エヴァトロン (2 leaders: グリム・ダルゴス, ヴァイロン・デアクス)

**Space Civilizations (宇宙勢力):**

- グランベル (2 leaders: アルゼン・カーリーン, マスター・クインシアス)
- ティエリア (1 leader: グレイモンド・ハウザー)
- エレシオン (1 leader: 女王リアナ・ソリス)
- ファルージャ (1 leader: マドリス・カーネル)
- ディオクレニス (1 leader: ネイサン・コリンド)
- アポロン文明圏 (1 leader: ロナン・アーサ)
- Selinopolis (1 leader: セリア・ドミニクス)
- エレシュ (1 leader: 大司教)
- プロキオ (1 leader: 商工会議長)
- ロースター (1 leader: 通信長官)

**ZAMLT Sub-Entries:**

- トロン・コーポレーション (1 leader: ラファエル・ドレイク)
- アロエオイル・コーポレーション (1 leader: アイリス・ノヴァ)
- マモン・コーポレーション (1 leader: カルロス・ヴァンダム)
- ゼブラ・コーポレーション (1 leader: アーサー・グリム)
- ルレンツ・コーポレーション (1 leader: エリザベス・リンドバーグ)
- ストロベリー (1 leader: アレン)

### 3. Entries Intentionally NOT Given Leaders

- クレセント大地方 (geographical region)
- 企業国家 (concept/term)
- A-Registry (system)
- nトークン (currency)
- All technology entries
- All city/location entries
- All event/war entries (historical events don't have leadership)

## Verification

- `bun run lint` passes with no errors
- File grew from ~3176 lines to 3450 lines (+274 lines)
- All 43 leaders arrays properly formatted with `LeaderEntry` interface fields

---
Task ID: 1
Agent: full-stack-developer
Task: Phase 1 Core Performance Optimization

Work Log:
- Updated next.config.ts with image optimization settings (formats, deviceSizes, imageSizes, unoptimized: false, bundle analyzer integration)
- Removed modularizeImports for lucide-react due to incompatibility with shadcn/ui's ChevronDownIcon import pattern
- Converted all `<img>` tags to next/image `<Image>` components across 5 files (auralis, card-game/select, card-game/battle, wiki/page, wiki/[id])
- Added proper width/height/sizes/loading attributes to all Image components
- Optimized font loading in layout.tsx: added display:"swap" and preload:true for Noto_Sans_JP
- Created MotionProvider wrapper component using LazyMotion with domMax features for framer-motion lazy loading
- Converted all framer-motion `motion.xxx` to `m.xxx` components in 3 files (card-game/page, card-game/select, card-game/battle)
- Battle page already had Suspense boundary for useSearchParams SSR handling; kept as-is
- Created 6 loading.tsx skeleton files: root, wiki, story, card-game, characters, timeline

Stage Summary:
- All `<img>` tags eliminated in favor of next/image with proper optimization attributes
- Framer-motion lazy-loaded via LazyMotion wrapper in root layout, reducing initial JS bundle
- Font loading optimized with font-display:swap and preloading to prevent FOIT
- Build passes successfully with `npx next build` (46 static pages generated)
- 6 skeleton loading states added for major routes
- Note: modularizeImports for lucide-react removed due to shadcn/ui ChevronDownIcon incompatibility; lucide-react is already tree-shakeable by default
