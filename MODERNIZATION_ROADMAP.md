# EDU 現代化ロードマップ — ona.la / yuimarudev 分析に基づく

> **現状認識**: edu は機能的には完成している（227 wiki、20 stories、card game、全セクション）。しかし技術的には 2024 年の Next.js パラダイムで止まっており、ona.la や yuimarudev が体現する「2025-2026 年の最先端」から見ると、複数の改善余地がある。
>
> **方針**: 破壊的変更ではなく、現状を洗練させる方向。ona.la のミニマリズム哲学と yuimarudev のビルド時最適化哲学を、Next.js 16 の制約内で取り入れる。

---

## 0. ona.la / yuimarudev 技術調査結果

### ona.la の技術的特徴（ブラウザ調査済み）

| 特徴 | 実装 |
|------|------|
| **フレームワーク** | Qwik（resumability — ゼロJSハイドレーション） |
| **View Transitions API** | `view-transition-name: none` でネイティブ対応 |
| **色空間** | oklch（知覚的均一色 — `oklch(0.929 0.013 255.508)`） |
| **フォント** | IBM Plex Sans JP（外部サブセットCSS `fonts/Lw.css`） |
| **CSS 変数** | `--acc`, `--fg`, `--link`, `--link-visited`, `--code-fg`, `--code-bg` |
| **ナビゲーション** | `<a>` + `data-prefetch` のみ — JS ランタイムゼロ |
| **レイアウト** | テキストファースト、`border-bottom` でセクション分離 |
| **デザイン** | 極限ミニマリズム — 装飾ゼロ、余白で構成 |
| **ホスティング** | Cloudflare Pages |

### yuimarudev の技術スタック

| 特徴 | 実装 |
|------|------|
| **言語** | Rust（WASM派生ツールチェーン） |
| **ビルド最適化** | @napi-rs/canvas, @glypht/* でビルド時生成 |
| **コンテンツ** | smol-toml frontmatter + remark パイプライン |
| **ランタイム** | Cloudflare Workers（Edge） |
| **思想** | 「ランタイムJSをゼロに近づける」「ビルド時に全部決める」 |

---

## 1. View Transitions API 導入（効果: 高 / 工数: 低）

**ona.la はすでにこれを使っている。Next.js 14+ は `<ViewTransitions />` でこれをネイティブにサポートしている。**

### 現状の問題
- ページ遷移時にフルリロード感 — フェードアウト/インがない
- ブラウザのデフォルトの硬い遷移

### 実装
`src/app/layout.tsx` に1行追加するだけ:

```tsx
import { ViewTransitions } from "next-view-transitions"

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className="dark">
      <body>
        <ViewTransitions>
          <Navigation />
          {children}
          <Toaster />
        </ViewTransitions>
      </body>
    </html>
  )
}
```

```bash
bun add next-view-transitions
```

**効果**: ページ間遷移がブラウザネイティブのスムーズアニメーションになる。CSS でカスタムも可能:

```css
::view-transition-old(root) {
  animation: 150ms ease-out fade-out;
}
::view-transition-new(root) {
  animation: 150ms ease-in fade-in;
}
```

---

## 2. oklch カラー空間への移行（効果: 中 / 工数: 中）

**ona.la は oklch を使用。知覚的に均一な明度/彩度で、暗色テーマでの視認性が劇的に向上する。**

### 現状の問題
- `rgba(255,255,255,0.65)` などの不透明度ベース — テーマ変更時に一貫性がない
- `#0a0a1a`, `#7c3aed` などの固定 hex — 暗色モード特化で明色モード対応不可
- Tailwind CSS v4 は oklch をネイティブにサポート

### 移行マップ
```
現在の hex/rgba          →  oklch
#0a0a1a (background)    →  oklch(0.15 0.02 270)
#e2e8f0 (text)          →  oklch(0.93 0.01 255)
#7c3aed (primary)       →  oklch(0.55 0.25 295)
#38bdf8 (accent blue)   →  oklch(0.75 0.15 230)
#f59e0b (accent gold)   →  oklch(0.80 0.17 85)
#94a3b8 (muted)         →  oklch(0.70 0.02 255)
#2a2a5e (border)        →  oklch(0.25 0.05 280)
#ef4444 (destructive)    →  oklch(0.65 0.22 25)
```

### globals.css への統合
```css
:root {
  --color-bg: oklch(0.15 0.02 270);
  --color-fg: oklch(0.93 0.01 255);
  --color-muted: oklch(0.70 0.02 255);
  --color-accent: oklch(0.55 0.25 295);
  --color-border: oklch(0.25 0.05 280);
  --color-link: oklch(0.75 0.15 230);
  --color-link-visited: oklch(0.65 0.12 300);
}
```

**効果**: すべての色が知覚的に一貫した明度勾配になる。暗色テーマでの可読性が向上。

---

## 3. Navigation のサーバーコンポーネント化（効果: 中 / 工数: 低）

### 現状の問題
- `navigation.tsx` は `"use client"` — 14 個の Link をレンダリングするだけなのにクライアント JS を消費
- モバイルメニューの `useState` のみがクライアント要件

### 実装
1. ナビ本体はサーバーコンポーネント（JS ゼロ）
2. モバイルメニューだけを `<MobileNavToggle />` クライアントコンポーネントに分離

```tsx
// navigation.tsx — "use client" を削除
// Link を next/link のまま使える（サーバーコンポーネント対応）

// mobile-nav-toggle.tsx (NEW) — "use client"
"use client"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { SECTIONS } from "@/lib/nav-data"

export function MobileNavToggle() {
  const [open, setOpen] = useState(false)
  // ... mobile menu only
}
```

**効果**: ナビゲーション配信の JS サイズが ~2KB に削減。ona.la の `<a data-prefetch>` 哲学に近づく。

---

## 4. Wiki/[id] のサーバー/クライアント分離（効果: 中 / 工数: 中）

### 現状の問題
- `wiki/[id]/page.tsx` 全体が `"use client"` — `generateMetadata` が使えない
- OG画像、メタタグが設定不可能

### 実装
既に `IMPLEMENTATION_PROMPTS.md` Section 1 で詳細を設計済み:
- `WikiEntryContent.tsx` にクライアント側ロジックを移動
- `page.tsx` をサーバーコンポーネント化して `generateMetadata` + OG画像生成

---

## 5. Streaming SSR / Suspense 導入（効果: 高 / 工数: 中）

### 現状の問題
- 全ページが single chunk — above-the-fold 表示が遅い
- `loading.tsx` がどのページにも存在しない

### 実装
各セクションに `loading.tsx` を追加:

```
src/app/
├── wiki/loading.tsx          ← Skeleton grid
├── story/loading.tsx         ← Chapter list skeleton
├── wiki/[id]/loading.tsx     ← Entry detail skeleton
└── story/[slug]/loading.tsx  ← Story reader skeleton
```

メインページ（`page.tsx`）の `ConsistencySection` などを `Suspense` でラップ:

```tsx
import { Suspense } from "react"

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<ConsistencySkeleton />}>
        <ConsistencySection />
      </Suspense>
      <FooterSection />
    </div>
  )
}
```

**効果**: First Contentful Paint が大幅改善。ona.la の「即座にテキストが見える」体験に近づく。

---

## 6. RevealSection の CSS animation-timeline 化（効果: 低 / 工数: 低）

### 現状の問題
- `reveal-section.tsx` が IntersectionObserver を使ったクライアント JS 実装
- すべてのセクション表示で JS イベントリスナーが登録される

### 実装
CSS Scroll-Driven Animations は Chrome 115+ でサポート。Tailwind v4 でも使える:

```css
.reveal-section {
  animation: reveal-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**効果**: RevealSection コンポーネントが完全にサーバーコンポーネント化可能。JS ランタイムゼロでスクロールアニメーション。

**注意**: Firefox / Safari の対応状況を確認。フォールバックとして `@supports (animation-timeline: view())` で分岐可能。

---

## 7. デザイン洗練 — ona.la 的ミニマリズムの導入（効果: 高 / 工数: 高）

### 現状の問題
- Hero セクションに 11 個の Badge が横並び — 視覚ノイズ過多
- `glass-card`, `glow-*`, `pulse-glow` などの装飾効果が多用 — モダンだが重い
- カードごとに異なる gradient が指定 — 統一感がない
- 背景画像（`edu-hero.png`）がヒーローセクションで使われているが、低解像度でボケている

### ona.la から学ぶべきデザイン原則
1. **テキストファースト**: アイコンや装飾よりもテキストの可読性を最優先
2. **余白で構成**: カード間のスペースでセクションを区切る（ボーダーや背景色ではなく）
3. **単一アクセントカラー**: 全ページで1つの `--acc` のみを使用
4. **境界線で分離**: `border-bottom: 1px solid var(--acc)` のように、背景色ではなく線で区切る

### 具体的な変更案

#### A. Hero セクションの簡素化
```
現在: タイトル + 11バッジ + 装飾グラデーション + 星フィールド + 背景画像
→  改: タイトル + サブタイトル + 3-4キーワードのみ
```

#### B. カードの統一
```
現在: 各カードに固有 gradient + icon + hover:scale + shadow
→  改: border + 単一背景色 + hover 時に border-color のみ変化
```

#### C. セクション分離
```
現在: グラデーション hr (`from-transparent via-nebula-purple/40`)
→  改: 単色 border-top/bottom（ona.la 風）
```

---

## 8. Edge Runtime 拡張（効果: 中 / 工数: 低）

### 現状の問題
- 大部分のページが Node.js Runtime に依存
- Netlify デプロイだが Edge 対応していないページが多い

### 実装可能なページ
| ページ | Edge 化 | 理由 |
|--------|---------|------|
| `wiki/page.tsx` | 即可能 | データは全て静的 import |
| `wiki/[id]/page.tsx` | 即可能 | 同上 + generateStaticParams |
| `story/page.tsx` | 即可能 | 同上 |
| `story/[slug]/page.tsx` | 要検討 | ISR (fetch from GitHub raw) は edge 対応済み |
| `page.tsx` (home) | 即可能 | 全て静的データ |

```tsx
// 各ページの export に追加
export const runtime = "edge"
```

**効果**: Cold Start が ~50ms に短縮（Node.js Runtime の ~250ms から）。

---

## 9. 不要な Client JS の削減（効果: 高 / 工数: 中）

### 現状の Client JS 肥大化の要因

| コンポーネント | "use client" | 必要性 |
|--------------|-------------|--------|
| `navigation.tsx` | はい | 不要 — useState のみ |
| `wiki/page.tsx` | はい | 不要 — 検索/フィルターは URL params で代替可能 |
| `wiki/[id]/page.tsx` | はい | 不要 — prev/next ナビは静的 |
| `page.tsx` (home) | はい | 不要 — RevealSection は CSS で代替可能 |
| `star-field.tsx` (wiki) | はい | 保留 — アニメーションはJS必須だが、CSS版も検討可 |
| `story-reader-ui.tsx` | はい | 必須 — 言語切替 + スクロール追跡 |

### Server Components 化の優先順位
1. `page.tsx` (home) — RevealSection を CSS に置き換えれば完全サーバー化
2. `navigation.tsx` — MobileNavToggle 分離で即サーバー化
3. `wiki/page.tsx` — 検索を URL-based に変更（ona.la 風: `/?tags=モバイルネットワーク`）

---

## 10. Next.js PPR (Partial Prerendering) 対応（効果: 高 / 工数: 低）

### Next.js 15+ / 16 の最も強力な新機能
- Static Shell + Dynamic Holes — 静的部分は即座に表示、動的部分はストリーミング
- `Suspense` 境界が自動的に "dynamic hole" になる

### 現状ですでに PPR の恩恵を受けられる構造
```
wiki/page.tsx の Suspense wrapping →
  Static Shell: ヘッダー、カテゴリフィルター
  Dynamic Hole: 検索結果（ただし今回は静的データなので SSR と同義）
```

### 必要な作業
```tsx
// next.config.ts に追加
const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
}
```

---

## 優先度マトリクス

```
即効性（1セッションで可能）
├── 1. View Translations API          ← bun add + 1行
├── 3. Navigation サーバー化          ← ファイル分割のみ
└── 8. Edge Runtime 拡張               ← export 追加のみ

中期的（1-2セッション）
├── 4. Wiki/[id] サーバー/クライアント分離
├── 5. Streaming SSR / Suspense
├── 6. RevealSection CSS 化
└── 10. PPR 有効化

大規模（デザイン刷新）
├── 2. oklch カラー移行
├── 7. ona.la 的ミニマリズム導入
└── 9. Client JS 全面削減
```

| # | 項目 | 効果 | 工数 | リスク | ona.la由来 |
|---|------|------|------|------|-----------|
| 1 | View Transitions | ★★★★ | 極低 | 極低 | ★ |
| 2 | oklch カラー | ★★★ | 中 | 低 | ★ |
| 3 | Nav サーバー化 | ★★★ | 低 | 低 | ★ |
| 4 | Wiki/[id] 分離 | ★★★ | 中 | 中 | — |
| 5 | Streaming SSR | ★★★★ | 中 | 低 | ★ |
| 6 | RevealSection CSS | ★★ | 低 | 低 | — |
| 7 | デザイン洗練 | ★★★★ | 高 | 中 | ★★★ |
| 8 | Edge Runtime | ★★★ | 極低 | 低 | ★★ |
| 9 | Client JS 削減 | ★★★★ | 中 | 中 | ★★ |
| 10 | PPR | ★★★★ | 低 | 低 | — |

---

##ona.la から直接学べる「思想」のまとめ

> **「装飾を削れ。テキストだけで美しく作れ。遷移はブラウザに任せろ。ビルド時に全部決めろ。ランタイム JS は最小限にしろ。」**

これを edu に翻訳すると:

1. **glass-card, glow, pulse-glow を全部削る** → `border` と `background-color` のみ
2. **アイコンの乱用をやめる** → テキストのみのリンク（ona.la 風）
3. **星フィールド アニメーションをやめる** → CSS gradient のみの静的背景
4. **hover:scale をやめる** → hover は `color` と `border-color` のみ変化
5. **View Transitions に任せる** → 自前のフェードイン/アウト削除

これらは「見た目の問題」ではなく「パフォーマンスと体感速度の問題」である。ona.la の体感速度の速さは、装飾が少ないからではなく、**JS がほぼゼロだから**である。
