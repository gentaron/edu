# EDU 実装プロンプト集 — yuimarudev テックスタック応用

> このファイルは yuimarudev の技術スタックを EDU（Eternal Dominion Universe）に適用するための
> **即時実行可能なプロンプト指示文集**です。各プロンプトは独立しており、Claude に丸ごと投げれば実装できます。

---

## 実装ロードマップ

| # | 技術 | 効果 | 難易度 |
|---|------|------|--------|
| 1 | `next/og` OG画像自動生成 | wiki 204件・story 20件の SNS シェア品質が劇的向上 | ★★☆ |
| 2 | `remark-gfm` パイプライン強化 | Wiki 説明・Story テキストで GFM 記法が使用可能に | ★☆☆ |
| 3 | `smol-toml` ストーリーメタデータ分離 | stories.ts の TypeScript ベタ書きを TOML で宣言的管理 | ★★☆ |
| 4 | `@glypht` 日本語フォントサブセット | Noto Sans JP の転送量を 90%+ 削減 | ★★★ |

---

## Prompt 1: OG画像自動生成（`next/og` + `ImageResponse`）

```
あなたは Next.js 16 App Router の専門家です。
以下の仕様で EDU（Eternal Dominion Universe）プロジェクトに
OG画像自動生成を実装してください。

## プロジェクト構造

- フレームワーク: Next.js 16 (App Router), TypeScript 5, Bun
- ルート: src/app/wiki/[id]/page.tsx, src/app/story/[slug]/page.tsx
- Wikiデータ: src/lib/wiki-data.ts (ALL_ENTRIES 配列, WikiEntry 型)
  - フィールド: id, name, nameEn?, category, subCategory?, description, era?, affiliation?, tier?
  - category は "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史"
- Storyデータ: src/lib/stories.ts (ALL_STORIES 配列, StoryMeta 型)
  - フィールド: slug, title, titleJa, chapter, era?, label
  - CHAPTERS 配列で chapter id → titleJa/titleEn/gradient が引ける
- カラートークン(globals.css/tailwind): cosmic-dark (#0a0a0f), nebula-purple (#7c3aed),
  electric-blue (#38bdf8), gold-accent (#f59e0b)

## やること

### 1. src/app/wiki/[id]/opengraph-image.tsx を新規作成

- Next.js の `ImageResponse` を `next/og` からインポート
- `generateStaticParams()` は `ALL_ENTRIES.map(e => ({ id: e.id }))` で静的生成
- `size`: 1200×630
- デザイン仕様:
  - 背景: 暗い宇宙色 (#0a0a0f) にラジアルグラデーション (nebula-purple 10%透明度)
  - 左上: "EDU" ロゴ文字（小さめ、gold-accent #f59e0b）
  - 中央やや上: entry.name（大文字・白・bold）、その右に entry.nameEn（小さめ・グレー）
  - entry.name の下: category バッジ（category に応じた色、小さいpill）
  - 下部: era と affiliation（あれば）、tier（あれば）をグレーの小文字で
  - 右下: "Eternal Dominion Universe" テキスト（極小・薄グレー）
  - category カラーマップ:
    - "キャラクター": #f59e0b (gold)
    - "組織": #7c3aed (purple)
    - "技術": #38bdf8 (blue)
    - "歴史": #ef4444 (red)
    - "地理": #10b981 (green)
    - "用語": #6b7280 (gray)
- フォント: Noto Sans JP を以下で取得して satori に渡す
  ```ts
  const font = await fetch(
    new URL('https://fonts.gstatic.com/s/notosansjp/v52/-F62fjtqLzI2JPCgQBnWkZU.woff2')
  ).then(r => r.arrayBuffer())
  ```
  fonts 配列に `{ name: 'Noto Sans JP', data: font, weight: 700 }` を渡す

### 2. src/app/story/[slug]/opengraph-image.tsx を新規作成

- `generateStaticParams()` は `ALL_STORIES.map(s => ({ slug: s.slug }))`
- size: 1200×630
- デザイン仕様:
  - 背景: #0a0a0f に対応する chapter の gradient カラーをオーバーレイ
    （CHAPTERS.find(ch => ch.id === story.chapter)?.gradient 相当の色を右側に薄くかける）
  - 上部: chapter の titleJa + " — " + titleEn（小さめ・グレー）
  - 中央: story.titleJa（大・白・bold）
  - titleJa の下: story.title（英語・中サイズ・グレー）
  - 下部左: story.era（あれば）
  - 下部右: "Eternal Dominion Universe"（極小・薄グレー）
- フォントは wiki と同様に Noto Sans JP を fetch

### 3. 重要: wiki/[id]/page.tsx はクライアントコンポーネントへの対応

`src/app/wiki/[id]/page.tsx` の先頭には `"use client"` があり、
`useParams()` でルートパラメータを取得している。
`generateMetadata` は**サーバーコンポーネントでのみ**使用できるため、以下のリファクタが必要:

**推奨アプローチ: ページをサーバーコンポーネントに変換**
- `useParams()` → `params` プロップ（`{ params: Promise<{ id: string }> }`）に置き換え
- `"use client"` ディレクティブを削除
- ページ内で利用している状態や副作用が**ない**ことを確認（現状は static データルックアップのみのはず）

```tsx
// src/app/wiki/[id]/page.tsx — サーバーコンポーネント化後
// "use client" を削除

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = ALL_ENTRIES.find(e => e.id === decodeURIComponent(id))
  const ogPath = `/og/wiki/${encodeURIComponent(id)}.png`
  return {
    title: entry ? `${entry.name} — EDU Wiki` : "EDU Wiki",
    openGraph: { images: [{ url: ogPath, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: [ogPath] },
  }
}

export default async function WikiEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = ALL_ENTRIES.find(e => e.id === decodeURIComponent(id))
  if (!entry) return notFound()
  // ... 以降は既存のレンダリングロジック
}
```

子コンポーネント（WikiDescription など）に `"use client"` が必要な場合は
それぞれのファイルに移動する（コンポーネント単位のクライアント境界）。

### 4. 注意事項

- `next/og` の ImageResponse は Edge runtime 対応。`export const runtime = 'edge'` は付けない
  （Netlify での Edge Functions は別設定が必要なため、デフォルト Node.js ランタイムで動かす）
- ImageResponse 内の JSX は tailwind 不可。すべてインライン style で記述
- fetch で外部フォントを取得するため、ネットワーク不可環境では fallback なしで失敗することに注意
- TypeScript の型エラーが出ないよう、存在チェックを入れること（story/entry が undefined の場合 notFound() を返す）

### 5. 検証方法

実装後:
```bash
bun dev
```
で起動し、ブラウザで以下を確認:
- http://localhost:3000/wiki/Diana/opengraph-image
- http://localhost:3000/story/diana-world/opengraph-image

1200×630 の画像が表示されれば成功。
また `bun build` が通ることも確認してください。
```

---

## Prompt 2: remark-gfm パイプライン強化（react-markdown 初導入）

```
あなたは Next.js + React 専門のエンジニアです。
EDU プロジェクトに remark-gfm を使った Markdown レンダリングを新規導入してください。

## 重要な現状把握（実装前に必読）

- package.json に react-markdown@10 は存在するが、src/ 内のどこにも import されていない（未使用）
- src/app/wiki/[id]/_components/wiki-description.tsx は独自の tokenize() 関数で
  description 文字列を解析し、キャラクター名を自動リンクに変換している（react-markdown 非使用）
- src/app/story/[slug]/_components/story-reader-ui.tsx はテキストを改行分割して
  段落ごとに表示している（react-markdown 非使用）
- したがって、react-markdown + remark-gfm は「既存コードの更新」ではなく「新規導入」となる

## プロジェクト概要

- Next.js 16, TypeScript 5, Bun
- src/app/wiki/[id]/_components/wiki-description.tsx: 独自 tokenize() で名前自動リンク
- src/app/story/[slug]/page.tsx: 段落配列をそのまま <p> タグで描画

## やること

### 1. remark-gfm をインストール

```bash
bun add remark-gfm
```

### 2. src/app/wiki/[id]/_components/wiki-description.tsx を拡張

このコンポーネントは現在 tokenize() でテキストを分割し、キャラ名に Link を付けている。
この既存ロジックを**壊さず**に、Markdown の基本記法も解釈できるよう拡張する。

方針: 段階的導入（後方互換を最優先）
1. description が `**text**`、`*text*`、`~~text~~` を含む場合、
   ReactMarkdown でレンダリングしてから名前リンク処理を当てる
2. ReactMarkdown の `components` prop で `p` タグを差し替え、
   その内部テキストに tokenize() を適用する形にする:

```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// 既存の tokenize() と NAME_PATTERN を活かしつつ:
export default function WikiDescription({ description }: WikiDescriptionProps) {
  // Markdown 記法を含むかチェック（含まない場合は既存 tokenize() のみ使用）
  const hasMarkdown = /[*~`#\[\]]/.test(description)

  if (!hasMarkdown) {
    // 既存ロジック（変更なし）
    const segments = useMemo(() => tokenize(description), [description])
    return (
      <p className="text-sm sm:text-base text-white/65 leading-relaxed whitespace-pre-line font-light">
        {segments.map((seg, i) => /* 既存のレンダリング */)}
      </p>
    )
  }

  // Markdown あり → ReactMarkdown + remark-gfm でレンダリング
  return (
    <div className="text-sm sm:text-base text-white/65 leading-relaxed font-light prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="whitespace-pre-line">{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-sky-400/80 hover:text-sky-300 underline transition-colors">
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-white/85 font-semibold">{children}</strong>
          ),
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  )
}
```

### 3. wiki-data.ts で Markdown 記法を使えるようにする

実装後、`src/lib/wiki-data.ts` の description フィールドで以下が使用可能になる:
- `**太字**` → 重要な組織名・技術用語の強調
- `*斜体*` → in-universe の固有名詞
- `~~打ち消し線~~` → 旧称・廃止された呼称
- GFM テーブル → キャラのステータス比較など

既存の plain text は **そのまま動作する**（後方互換）。

### 4. TypeScript 型の確認

remark-gfm は ESM モジュール。型エラーが出た場合:
```ts
// tsconfig.json の moduleResolution を確認。"bundler" or "nodenext" 推奨
// エラーが出る場合:
import remarkGfm from 'remark-gfm'
// → 以下に変更
// eslint-disable-next-line @typescript-eslint/no-require-imports
const remarkGfm = (await import('remark-gfm')).default
```

### 5. 検証

```bash
bun dev
```
で起動し、任意の wiki エントリ（例: /wiki/Diana）を開く。
description に `**AURALIS**` のような記法を一時的に追加してから、
太字レンダリングと名前リンクが**共存**することを確認。
```

---

## Prompt 3: smol-toml によるストーリーメタデータ分離

```
あなたは TypeScript と Node.js ビルドスクリプトの専門家です。
EDU プロジェクトのストーリーメタデータ管理を smol-toml を使って改善してください。

## 現状の問題

src/lib/stories.ts に ALL_STORIES 配列が TypeScript でベタ書きされており、
ストーリーを追加するたびにソースコードを編集する必要がある。
また、章（CHAPTERS）メタデータも同ファイルにハードコードされている。

## 目標

1. `lore/stories.toml` というTOMLファイルにメタデータを移行
2. `scripts/gen-stories.mjs` でそれを読んで `src/lib/stories.generated.ts` を生成
3. `src/lib/stories.ts` は generated ファイルを re-export するだけにする
4. `bun run gen:stories` コマンドで再生成できるようにする

## プロジェクト構造

- パッケージマネージャー: Bun
- src/lib/stories.ts の型定義:
  ```ts
  interface StoryMeta {
    slug: string
    title: string
    titleJa: string
    label: string
    fileName: string
    fileNameAlt: string
    relatedEntries: string[]
    era?: string
    chapter: number
    chapterOrder: number
    isEnSource: boolean
  }
  interface ChapterMeta {
    id: number
    titleJa: string
    titleEn: string
    era: string
    description: string
    descriptionEn: string
    color: string
    gradient: string
  }
  ```

## やること

### 1. smol-toml をインストール

```bash
bun add smol-toml
```

### 2. lore/stories.toml を新規作成

現在の ALL_STORIES と CHAPTERS を TOML に変換。形式例:

```toml
[meta]
base_url = "https://raw.githubusercontent.com/gentaron/edutext/main"

[[chapters]]
id = 1
title_ja = "黎明編"
title_en = "The Dawn"
era = "E260〜E300"
description = "E16星系への移住から始まる..."
description_en = "The first stories of humanity's new home..."
color = "from-amber-500 to-orange-600"
gradient = "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(249,115,22,0.08) 100%)"

[[stories]]
slug = "diana-world"
title = "Diana's World"
title_ja = "ダイアナの世界"
label = "Diana's Story"
file_name = "DianaWorld.txt"
file_name_alt = "DianaWorld_EN.txt"
related_entries = ["Diana"]
era = "E260〜E280"
chapter = 1
chapter_order = 1
is_en_source = false

# ...以降も同様のパターンで全ストーリーを列挙
```

src/lib/stories.ts から ALL_STORIES と CHAPTERS の全データを TOML に移植すること。

### 3. scripts/gen-stories.mjs を新規作成

```js
import { readFileSync, writeFileSync } from 'fs'
import { parse } from 'smol-toml'

const toml = readFileSync('lore/stories.toml', 'utf-8')
const data = parse(toml)

// TOML の snake_case を TypeScript の camelCase に変換
function toCamel(obj) { /* snake_case → camelCase 変換 */ }

const chapters = data.chapters.map(toCamel)
const stories = data.stories.map(toCamel)

const output = `// AUTO-GENERATED by scripts/gen-stories.mjs — DO NOT EDIT
// Source: lore/stories.toml
import type { ChapterMeta, StoryMeta } from './stories.types'

export const BASE = "${data.meta.base_url}"
export const CHAPTERS: ChapterMeta[] = ${JSON.stringify(chapters, null, 2)}
export const ALL_STORIES: StoryMeta[] = ${JSON.stringify(stories, null, 2)}
`

writeFileSync('src/lib/stories.generated.ts', output)
console.log(`Generated: ${stories.length} stories, ${chapters.length} chapters`)
```

### 4. src/lib/stories.ts を分割

- `src/lib/stories.types.ts` を新規作成 → StoryMeta, ChapterMeta インターフェース定義
- `src/lib/stories.ts` は型と関数（getStoryBySlug など）だけ残す
- generated ファイルの ALL_STORIES, CHAPTERS を import して使う

### 5. package.json に script 追加

```json
"gen:stories": "bun scripts/gen-stories.mjs",
```

### 6. .gitignore の確認

src/lib/stories.generated.ts は生成ファイルなので .gitignore に追加するかどうか
プロジェクトの方針に合わせて検討（CI でビルド前に gen:stories を実行する必要あり）。
今回は git 管理下に置く（コミット済みの状態を保つ）ことを推奨。

### 7. 検証

```bash
bun run gen:stories
bun run typecheck  # または bun run build でエラーなしを確認
bun dev
```
で /story/diana-world が正常に表示されれば成功。
```

---

## Prompt 4: @glypht による Noto Sans JP サブセット化

```
あなたは Web パフォーマンス最適化の専門家です。
EDU プロジェクトの日本語フォント（Noto Sans JP）をビルド時にサブセット化して
転送量を大幅削減してください。

## 現状の問題

src/app/layout.tsx で next/font/google の Noto_Sans_JP を使用:
```ts
const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
})
```
`subsets: ["latin"]` のみ指定のため、ブラウザは日本語コンテンツを表示するために
フルCJKフォントファイル（約5MB）を全件ダウンロードしてしまっている。

## 目標

1. EDU で実際に使用されている漢字・ひらがな・カタカナのみを抽出
2. @glypht でそれらを含む最小限の woff2 を生成
3. next/font/google → next/font/local に切り替えて配信量を 90%+ 削減

## プロジェクト構造

- Bun パッケージマネージャー
- コンテンツソース:
  - src/lib/wiki-data.ts（ALL_ENTRIES: 204エントリ、name/description など）
  - src/lib/stories.ts（CHAPTERS, ALL_STORIES の titleJa, description など）
  - src/lib/civilization-data.ts, src/lib/faction-data.ts など
  - public/ 内の静的テキスト
- 出力先: public/fonts/

## やること

### 1. パッケージをインストール

```bash
bun add -d @glypht/core @glypht/bundler-utils
```

もし @glypht がインストールできない場合（バージョン 0.0.x のため不安定な可能性あり）、
代替として `glyphhanger` または `pyftsubset`（Python fonttools）を使う方法に切り替えて
以下の手順を適宜読み替えること。

### 2. scripts/collectChars.mjs を新規作成

EDU のすべてのコンテンツから使用文字を収集するスクリプト:

```js
import { readFileSync } from 'fs'
import { resolve } from 'path'

// TypeScript ファイルから文字列リテラルを抽出（簡易版）
function extractStringsFromTS(content) {
  const strings = []
  // ダブルクォート・シングルクォート・バッククォート内の文字列
  const matches = content.matchAll(/["'`]([^"'`\n]{1,500})["'`]/g)
  for (const m of matches) strings.push(m[1])
  return strings.join('')
}

const files = [
  'src/lib/wiki-data.ts',
  'src/lib/stories.ts',
  'src/lib/civilization-data.ts',
  'src/lib/faction-data.ts',
  'src/lib/timeline-data.ts',
  'src/lib/card-data.ts',
]

let allText = ''
for (const f of files) {
  try {
    allText += extractStringsFromTS(readFileSync(resolve(f), 'utf-8'))
  } catch { /* skip */ }
}

// lore/*.txt も収集
import { readdirSync } from 'fs'
for (const f of readdirSync('lore')) {
  if (f.endsWith('.txt')) {
    allText += readFileSync(resolve('lore', f), 'utf-8')
  }
}

// ユニーク文字セット
const chars = [...new Set(allText.split(''))].sort().join('')
console.log(`Total unique chars: ${chars.length}`)
writeFileSync('scripts/.char-list.txt', chars)
```

### 3. scripts/subsetFont.mjs を新規作成

@glypht を使ったサブセット生成:

```js
import { subset } from '@glypht/core'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const chars = readFileSync('scripts/.char-list.txt', 'utf-8')

// Noto Sans JP のフォントファイルを取得（初回のみ）
// ローカルにない場合は事前に https://fonts.google.com/noto/specimen/Noto+Sans+JP
// からダウンロードして scripts/NotoSansJP.ttf に置く

const ttf = readFileSync('scripts/NotoSansJP.ttf')

const weights = ['300', '400', '500', '700', '900']
mkdirSync('public/fonts', { recursive: true })

for (const weight of weights) {
  const result = await subset(ttf, {
    unicodes: chars,
    format: 'woff2',
  })
  writeFileSync(`public/fonts/NotoSansJP-${weight}-subset.woff2`, result)
  console.log(`Wrote public/fonts/NotoSansJP-${weight}-subset.woff2`)
}
```

注: @glypht の API は v0.0.x であり変更される可能性がある。
インストール後に `node -e "const g = require('@glypht/core'); console.log(Object.keys(g))"` で
実際のエクスポートを確認してから実装すること。

### 4. src/app/layout.tsx を更新

next/font/google → next/font/local に切り替え:

```ts
// Before:
import { Noto_Sans_JP } from "next/font/google"
const notoSansJP = Noto_Sans_JP({ variable: "--font-sans", subsets: ["latin"], weight: [...] })

// After:
import localFont from "next/font/local"
const notoSansJP = localFont({
  variable: "--font-sans",
  src: [
    { path: "../../public/fonts/NotoSansJP-300-subset.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/NotoSansJP-400-subset.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/NotoSansJP-500-subset.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/NotoSansJP-700-subset.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/NotoSansJP-900-subset.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
})
```

### 5. package.json に scripts 追加

```json
"subset:collect": "bun scripts/collectChars.mjs",
"subset:font": "bun scripts/subsetFont.mjs",
"subset": "bun run subset:collect && bun run subset:font",
```

prebuild に組み込む場合は:
```json
"prebuild": "bun run subset",
```

### 6. .gitignore に追加

```
scripts/NotoSansJP.ttf
scripts/.char-list.txt
public/fonts/*.woff2
```

woff2 は CI でビルド時に生成するため git 管理外にする。
（もしくは初回のみ生成して git 管理下に置き、文字追加時だけ再生成する運用も可）

### 7. 検証

```bash
bun run subset
bun dev
```

Chrome DevTools の Network タブで Fonts をフィルタし、
woff2 ファイルサイズが数百KB（フルの ~5MB から削減）になっていることを確認。
日本語テキストが正常に表示されていること。
```

---

## 実装順序の推奨

```
Prompt 2 (remark-gfm)  →  最小変更・即効果
       ↓
Prompt 1 (OG画像)      →  SNSシェア品質向上・体験的インパクト大
       ↓
Prompt 3 (smol-toml)   →  コンテンツ管理改善・開発体験向上
       ↓
Prompt 4 (@glypht)     →  パフォーマンス最適化・最も技術的に複雑
```

---

## 参考: yuimarudev との技術的対応関係

| yuimarudev の実装 | EDU での応用 | ソース思想 |
|---|---|---|
| `@napi-rs/canvas` でビルド時OG生成 | `next/og` + `ImageResponse` で同等実現 | ビルド時静的生成・ゼロランタイム依存 |
| `remark` + `remark-gfm` | react-markdown に remarkGfm プラグイン追加 | unified エコシステム |
| `remark-frontmatter` + TOML | smol-toml で lore/stories.toml を parse | 設定とコードの分離 |
| `smol-toml` | stories.toml のフロントマター解析 | 軽量・高速 TOML パーサー |
| `@glypht/bundler-utils` | scripts/subsetFont.mjs で Noto Sans JP サブセット | ビルド時フォント最適化 |
