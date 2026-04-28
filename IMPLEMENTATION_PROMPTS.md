# EDU Technical Implementation Prompts

> **Purpose**: Actionable implementation instructions derived from yuimarudev tech stack analysis, applied to the `gentaron/edu` codebase.
>
> **How to use**: Each section is a self-contained prompt. Copy the entire section and paste it into Claude — it contains enough context, file paths, and code to execute without ambiguity.
>
> **Current state** (as of 2026-04-28):
> - Next.js 16.1 (App Router, `output: "standalone"`)
> - 227 wiki entries in `src/lib/wiki-data.ts`
> - 20 stories in `src/lib/stories.ts` (5 chapters)
> - Noto Sans JP via `next/font/google` (`subsets: ["latin"]` only)
> - `react-markdown` v10 (no remark plugins)
> - Story files: raw `.txt` from `gentaron/edutext` (GitHub raw, ISR 1h)
> - No OG images for any page

---

## 1. OG Image Auto-Generation (next/og ImageResponse)

### Background

The wiki has 227 entries and stories has 20 entries, yet none produce `<meta property="og:image">` tags. Next.js App Router supports file-convention-based OG image generation via `next/og` (`ImageResponse`), which internally uses Satori + resvg-js. This avoids the complexity of `@napi-rs/canvas` for server-side rendering while maintaining the yuimarudev philosophy of "build-time generation with zero runtime cost."

### Install

```bash
# No additional packages needed — next/og is built into Next.js 13.3+
# Verify it resolves:
node -e "const { ImageResponse } = require('next/og'); console.log('OK')"
```

### Files to Create / Modify

#### A. `src/app/wiki/[id]/opengraph-image.tsx` (NEW)

```tsx
import { ImageResponse } from "next/og"
import { ALL_ENTRIES } from "@/lib/wiki-data"

// Route segment config — static generation
export const runtime = "edge"
export const alt = "EDU Wiki Entry"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const entry = ALL_ENTRIES.find((e) => e.id === decodedId)

  const name = entry?.name ?? decodedId
  const nameEn = entry?.nameEn ?? ""
  const category = entry?.subCategory ?? entry?.category ?? ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a1a",
          padding: "60px",
        }}
      >
        {/* Top brand bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            display: "flex",
          }}
        >
          <div style={{ flex: 1, background: "#7c3aed" }} />
          <div style={{ flex: 1, background: "#38bdf8" }} />
          <div style={{ flex: 1, background: "#f59e0b" }} />
        </div>

        {/* Category */}
        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          {category} — EDU Wiki
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 300,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: "12px",
          }}
        >
          {name}
        </div>

        {/* English name */}
        {nameEn && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 300,
              color: "rgba(56,189,248,0.6)",
              letterSpacing: "0.05em",
              marginBottom: "30px",
            }}
          >
            {nameEn}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#7c3aed",
            }}
          />
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
            Eternal Dominion Universe
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
```

#### B. `src/app/story/[slug]/opengraph-image.tsx` (NEW)

```tsx
import { ImageResponse } from "next/og"
import { ALL_STORIES, CHAPTERS, getStoryBySlug, getStoryTitle } from "@/lib/stories"

export const runtime = "edge"
export const alt = "EDU Story"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const CHAPTER_COLORS: Record<number, string> = {
  1: "#f59e0b", // Amber — 黎明編
  2: "#7c3aed", // Purple — 覚醒編
  3: "#ef4444", // Red — 闘争編
  4: "#38bdf8", // Blue — 星霜編
  5: "#10b981", // Emerald — 新世界編
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  const chapter = story ? CHAPTERS.find((ch) => ch.id === story.chapter) : null
  const accentColor = story ? (CHAPTER_COLORS[story.chapter] ?? "#7c3aed") : "#7c3aed"

  const title = story ? getStoryTitle(story, "ja") : slug
  const titleEn = story ? getStoryTitle(story, "en") : ""
  const chapterLabel = chapter
    ? `第${chapter.id}章 ${chapter.titleJa}`
    : ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a1a",
          padding: "60px",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: accentColor,
          }}
        />

        {/* Chapter label */}
        {chapterLabel && (
          <div
            style={{
              fontSize: 16,
              color: accentColor,
              opacity: 0.7,
              letterSpacing: "0.15em",
              marginBottom: "20px",
            }}
          >
            {chapterLabel}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: 46,
            fontWeight: 300,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: "12px",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        {/* English title */}
        {titleEn && titleEn !== title && (
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.04em",
              marginBottom: "30px",
            }}
          >
            {titleEn}
          </div>
        )}

        {/* Story label */}
        {story?.label && (
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "6px 16px",
              borderRadius: "999px",
            }}
          >
            {story.label}
          </div>
        )}

        {/* Bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: accentColor,
            }}
          />
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
            EDU Story — Eternal Dominion Universe
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
```

#### C. `src/app/wiki/[id]/page.tsx` — Add metadata export

In the existing file, add this **server-side metadata** export at the top (before the component). The file is currently `"use client"`, so you need to either:
- **Option A**: Extract metadata into a separate `layout.tsx` or keep the client component and add `generateMetadata` via a sibling `metadata.ts` approach
- **Option B** (recommended): Create `src/app/wiki/[id]/metadata.ts` as a shared module, then use `generateMetadata` in a thin server wrapper

**Recommended approach — convert to server component with client island:**

1. Create `src/app/wiki/[id]/_components/wiki-entry-content.tsx` — move ALL the current `WikiEntryPage` JSX into this client component
2. Rewrite `src/app/wiki/[id]/page.tsx` as a server component:

```tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ALL_ENTRIES } from "@/lib/wiki-data"
import WikiEntryContent from "./_components/wiki-entry-content"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const entry = ALL_ENTRIES.find((e) => e.id === decodedId)
  if (!entry) return { title: "Not Found" }

  return {
    title: `${entry.name}${entry.nameEn ? ` (${entry.nameEn})` : ""} — EDU Wiki`,
    description: entry.description.slice(0, 160),
    openGraph: {
      title: `${entry.name} — EDU Wiki`,
      description: entry.description.slice(0, 160),
      images: [`/wiki/${encodeURIComponent(decodedId)}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.name} — EDU Wiki`,
      description: entry.description.slice(0, 160),
    },
  }
}

export default async function WikiEntryPage({ params }: Props) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const entry = ALL_ENTRIES.find((e) => e.id === decodedId)
  if (!entry) return notFound()

  return <WikiEntryContent entryId={decodedId} />
}
```

3. Similarly, add `generateMetadata` to `src/app/story/[slug]/page.tsx` (this file is already a server component):

```tsx
// Add to src/app/story/[slug]/page.tsx
import type { Metadata } from "next"

// ... existing imports and generateStaticParams ...

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) return { title: "Not Found" }

  const titleJa = getStoryTitle(story, "ja")
  const titleEn = getStoryTitle(story, "en")

  return {
    title: `${titleJa} — EDU Story`,
    description: `「${titleJa}」(${titleEn}) — Eternal Dominion Universe`,
    openGraph: {
      title: `${titleJa} — EDU Story`,
      description: `${titleEn} — Eternal Dominion Universe`,
      images: [`/story/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleJa} — EDU Story`,
    },
  }
}
```

### Verification

```bash
bun build
bun dev
# Visit http://localhost:3000/wiki/Diana — check <head> for og:image
# Visit http://localhost:3000/story/diana-world — check <head> for og:image
# Direct OG image URLs:
#   http://localhost:3000/wiki/Diana/opengraph-image
#   http://localhost:3000/story/diana-world/opengraph-image
```

---

## 2. Remark Pipeline Enhancement (remark-gfm + remark-frontmatter)

### Background

The app uses `react-markdown` v10 for rendering wiki descriptions and story text, but without `remark-gfm` (GitHub Flavored Markdown) support. While the current story content is plain text, enabling GFM prepares the content pipeline for future `.md` migration and allows table/footnote/strikethrough support in any markdown-rendered field.

Additionally, `remark-frontmatter` enables TOML frontmatter parsing (`+++` delimiters), which is a prerequisite for the smol-toml migration in Section 3.

### Install

```bash
bun add remark-gfm remark-frontmatter
```

### Files to Modify

#### A. Story viewer — `src/app/story/[slug]/_components/story-reader-ui.tsx`

Find the current `ReactMarkdown` usage (or `dangerouslySetInnerHTML` if present) and wrap it with GFM support:

```tsx
// Add to imports at top
import remarkGfm from "remark-gfm"

// Where ReactMarkdown is used (for any markdown-rendered section):
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {markdownContent}
</ReactMarkdown>
```

If the story viewer currently renders plain text paragraphs without ReactMarkdown, you can skip modifying it — the current paragraph-based rendering in `story-reader-ui.tsx` is intentional for novel prose and should remain as-is. GFM support is more relevant for wiki entries and future `.md` content.

#### B. Wiki description — `src/app/wiki/[id]/_components/wiki-description.tsx`

If wiki descriptions ever switch to markdown rendering, add:

```tsx
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// In the render:
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    p: ({ children }) => (
      <p className="text-sm sm:text-base text-white/65 leading-relaxed font-light">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <Link href={href ?? "#"} className="text-sky-400/80 hover:text-sky-300 underline decoration-sky-400/20 hover:decoration-sky-400/40 transition-colors">
        {children}
      </Link>
    ),
  }}
>
  {description}
</ReactMarkdown>
```

**Note**: The current wiki-description.tsx uses a custom name-linking tokenizer. If GFM markdown rendering is enabled, the tokenizer must run BEFORE markdown rendering to avoid breaking markdown syntax. Coordinate both systems carefully — this is a gradual migration step, not a wholesale replacement.

#### C. Global Markdown component (NEW) — `src/components/markdown-renderer.tsx`

Create a reusable component for future use across the app:

```tsx
"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={className}
      components={{
        p: ({ children }) => (
          <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
        ),
        a: ({ href, children }) => {
          if (href?.startsWith("/")) {
            return (
              <Link href={href} className="text-sky-400/80 hover:text-sky-300 underline underline-offset-2 transition-colors">
                {children}
              </Link>
            )
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-400/80 hover:text-sky-300 underline underline-offset-2 transition-colors">
              {children}
            </a>
          )
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-white/10 px-3 py-2 text-left text-xs uppercase tracking-wider text-white/50 bg-white/[0.03]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-white/[0.06] px-3 py-2 text-sm text-white/65">
            {children}
          </td>
        ),
        code: ({ children, className }) => {
          // Inline code (not a code block)
          if (!className) {
            return (
              <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-sky-300/80 text-xs font-mono">
                {children}
              </code>
            )
          }
          return <code className={className}>{children}</code>
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-nebula-purple/40 pl-4 my-4 text-white/50 italic">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
```

### Verification

```bash
bun install
bun build
# Test: Create a test wiki entry with markdown in description field
# Tables, strikethrough, footnotes should render correctly
```

---

## 3. smol-toml + Story Metadata Separation

### Background

Story metadata (slug, title, chapter, era, etc.) is currently hardcoded in `src/lib/stories.ts` as a static TypeScript array (`ALL_STORIES`). This means every new story requires editing TypeScript source code — a maintainability bottleneck. The yuimarudev approach uses `smol-toml` to parse TOML frontmatter from content files, enabling data to live alongside the content itself.

This implementation migrates `lore/*.txt` files to `lore/*.md` with TOML frontmatter (`+++` delimiters), and auto-generates the story list from file scanning at build time.

### Install

```bash
bun add smol-toml
```

### Migration Plan

#### Phase 1: Convert lore files to frontmatter markdown

For each `lore/*.txt`, prepend TOML frontmatter. Example — `lore/DianaWorld.txt` becomes `lore/DianaWorld.md`:

```markdown
+++
slug = "diana-world"
title = "Diana's World"
title_ja = "ダイアナの世界"
label = "Diana's Story"
chapter = 1
chapter_order = 1
era = "E260〜E280"
is_en_source = false
related_entries = ["Diana"]
+++

（既存の物語テキストがそのまま続く）
```

#### Phase 2: Build script — `scripts/generate-stories.ts` (NEW)

```typescript
import { parse as parseToml } from "smol-toml"
import { readFileSync, readdirSync, writeFileSync } from "fs"
import { join } from "path"

const LORE_DIR = join(process.cwd(), "lore")
const OUTPUT_PATH = join(process.cwd(), "src/lib/stories.generated.ts")

interface StoryFrontmatter {
  slug: string
  title: string
  title_ja: string
  label: string
  chapter: number
  chapter_order: number
  era?: string
  is_en_source: boolean
  related_entries: string[]
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

const CHAPTERS: ChapterMeta[] = [
  {
    id: 1,
    titleJa: "黎明編",
    titleEn: "The Dawn",
    era: "E260〜E300",
    description: "E16星系への移住から始まる、新天地での最初の物語。",
    descriptionEn: "The first stories of humanity's new home in the E16 star system.",
    color: "from-amber-500 to-orange-600",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(249,115,22,0.08) 100%)",
  },
  {
    id: 2,
    titleJa: "覚醒編",
    titleEn: "The Awakening",
    era: "E300〜E400",
    description: "英雄たちが次々と覚醒し、ギガポリスの舞台に立つ時代。",
    descriptionEn: "Heroes rise one by one to take the stage of Gigapolis.",
    color: "from-nebula-purple to-violet-600",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(139,92,246,0.08) 100%)",
  },
  {
    id: 3,
    titleJa: "闘争編",
    titleEn: "Age of Strife",
    era: "E400〜",
    description: "世界の均衡が崩れ、新たな争いが始まる時代。",
    descriptionEn: "The balance of the world fractures as new conflicts erupt.",
    color: "from-red-500 to-rose-600",
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(244,63,94,0.08) 100%)",
  },
  {
    id: 4,
    titleJa: "星霜編",
    titleEn: "Passage of Stars",
    era: "E480〜",
    description: "新世代の英雄が、星々の歴史を受け継ぎ新たな章を開く。",
    descriptionEn: "A new generation inherits the history of the stars.",
    color: "from-electric-blue to-cyan-500",
    gradient: "linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(6,182,212,0.08) 100%)",
  },
  {
    id: 5,
    titleJa: "新世界編",
    titleEn: "New World",
    era: "E520〜",
    description: "AURALISの誕生と、最新の時代を彩る物語。",
    descriptionEn: "The birth of AURALIS and the newest era stories.",
    color: "from-emerald-500 to-teal-500",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(20,184,166,0.08) 100%)",
  },
]

function extractFrontmatter(content: string): { frontmatter: StoryFrontmatter; body: string } | null {
  const match = content.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n([\s\S]*)$/)
  if (!match) return null

  try {
    const frontmatter = parseToml(match[1]) as StoryFrontmatter
    const body = match[2].trim()
    return { frontmatter, body }
  } catch {
    return null
  }
}

function main() {
  const files = readdirSync(LORE_DIR).filter((f) => f.endsWith(".md"))

  const stories: StoryFrontmatter[] = []

  for (const file of files) {
    const content = readFileSync(join(LORE_DIR, file), "utf-8")
    const parsed = extractFrontmatter(content)
    if (parsed) {
      stories.push(parsed.frontmatter)
    }
  }

  // Sort by chapter, then chapter_order
  stories.sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter
    return a.chapter_order - b.chapter_order
  })

  const generated = `// ═══════════════════════════════════════════════════════════
// AUTO-GENERATED — do not edit manually
// Run: bun run scripts/generate-stories.ts
// ═══════════════════════════════════════════════════════════

export interface StoryMeta {
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

export interface ChapterMeta {
  id: number
  titleJa: string
  titleEn: string
  era: string
  description: string
  descriptionEn: string
  color: string
  gradient: string
}

export const CHAPTERS: ChapterMeta[] = ${JSON.stringify(CHAPTERS, null, 2)} as const

const BASE = "https://raw.githubusercontent.com/gentaron/edutext/main"

function altFileName(fileName: string, isEnSource: boolean): string {
  const base = fileName.replace(/\\.md$/, "")
  return isEnSource ? \`\${base}_JP.txt\` : \`\${base}_EN.txt\`
}

export const ALL_STORIES: StoryMeta[] = ${JSON.stringify(
    stories.map((s) => ({
      slug: s.slug,
      title: s.title,
      titleJa: s.title_ja,
      label: s.label,
      fileName: `${s.slug.replace(/-/g, "")}.txt`, // legacy .txt path
      fileNameAlt: altFileName(s.slug.replace(/-/g, "") + ".txt", s.is_en_source),
      relatedEntries: s.related_entries,
      era: s.era,
      chapter: s.chapter,
      chapterOrder: s.chapter_order,
      isEnSource: s.is_en_source,
    })),
    null,
    2
  )} as const

export function getStoryUrl(fileName: string): string {
  return \`\${BASE}/\${fileName}\`
}

export function getStoryUrlForLang(story: StoryMeta, lang: "ja" | "en"): string {
  if (story.isEnSource) {
    return lang === "ja" ? \`\${BASE}/\${story.fileNameAlt}\` : \`\${BASE}/\${story.fileName}\`
  } else {
    return lang === "en" ? \`\${BASE}/\${story.fileNameAlt}\` : \`\${BASE}/\${story.fileName}\`
  }
}

export function getStoryTitle(story: StoryMeta, lang: "ja" | "en"): string {
  return story.isEnSource
    ? (lang === "en" ? story.title : story.titleJa)
    : (lang === "ja" ? story.titleJa : story.title)
}

export function getStoryBySlug(slug: string): StoryMeta | undefined {
  return ALL_STORIES.find((s) => s.slug === slug)
}

export function getStoriesForEntry(entryId: string): StoryMeta[] {
  return ALL_STORIES.filter((s) => s.relatedEntries.includes(entryId))
}

export function getStoriesByChapter(chapterId: number): StoryMeta[] {
  return ALL_STORIES.filter((s) => s.chapter === chapterId).sort(
    (a, b) => a.chapterOrder - b.chapterOrder
  )
}

export function getAdjacentStories(story: StoryMeta): { prev?: StoryMeta; next?: StoryMeta } {
  const chapterStories = getStoriesByChapter(story.chapter)
  const idx = chapterStories.findIndex((s) => s.slug === story.slug)
  return {
    prev: idx > 0 ? chapterStories[idx - 1] : undefined,
    next: idx < chapterStories.length - 1 ? chapterStories[idx + 1] : undefined,
  }
}
`

  writeFileSync(OUTPUT_PATH, generated, "utf-8")
  console.log(`Generated ${stories.length} stories → ${OUTPUT_PATH}`)
}

main()
```

#### Phase 3: Update `package.json` scripts

```json
{
  "scripts": {
    "generate:stories": "bun run scripts/generate-stories.ts",
    "prebuild": "bun run generate:stories"
  }
}
```

#### Phase 4: Modify imports

Replace all imports from `@/lib/stories` with `@/lib/stories.generated` in:
- `src/app/story/[slug]/page.tsx`
- `src/app/story/page.tsx`
- `src/app/story/[slug]/_components/story-reader-ui.tsx`
- `src/app/wiki/[id]/page.tsx`
- `src/app/wiki/[id]/_components/wiki-entry-content.tsx` (if created in Section 1)
- `src/lib/__tests__/stories.test.ts`

### Verification

```bash
# 1. Convert a few .txt files to .md with frontmatter as a test
# 2. Run: bun run generate:stories
# 3. Verify src/lib/stories.generated.ts was created with correct entries
# 4. bun build
# 5. bun dev — verify stories still load correctly
```

---

## 4. Font Subsetting (@glypht/bundler-utils + @glypht/core)

### Background

`layout.tsx` loads Noto Sans JP via `next/font/google` with `subsets: ["latin"]` only. This means **no Japanese glyph optimization** — every request potentially downloads 16MB+ of font data. The yuimarudev approach uses `@glypht/bundler-utils` + `@glypht/core` to scan all text content at build time, extract the exact set of used glyphs, and generate a minimal woff2 subset.

This is the most complex migration and should be done last, after the content pipeline is stabilized (Sections 1-3).

### Install

```bash
bun add -d @glypht/bundler-utils @glypht/core
```

### Build Script — `scripts/subsetFont.mjs` (NEW)

```javascript
import { readFile, writeFile, readdir } from "fs/promises"
import { join } from "path"
import { createSubsetFont } from "@glypht/core"

const UNICODE_PLANE_RANGES = {
  hiragana: [0x3040, 0x309f],
  katakana: [0x30a0, 0x30ff],
  kanji_common: [0x4e00, 0x9faf],
  latin: [0x0020, 0x007e],
  latin_ext: [0x00a0, 0x00ff],
  fullwidth: [0xff01, 0xff60],
  halfwidth_katakana: [0xff61, 0xff9f],
  cj_compatibility: [0xf900, 0xfaff],
}

function extractUniqueCharacters(text) {
  return new Set([...text])
}

async function scanTextFiles(dir) {
  const chars = new Set()
  const files = await readdir(dir)

  for (const file of files) {
    if (!file.endsWith(".ts") && !file.endsWith(".tsx") && !file.endsWith(".txt") && !file.endsWith(".md")) continue
    try {
      const content = await readFile(join(dir, file), "utf-8")
      for (const ch of extractUniqueCharacters(content)) {
        const code = ch.codePointAt(0)
        // Only keep CJK + common symbols (skip ASCII control chars)
        if (code > 0x7f) {
          chars.add(ch)
        }
      }
    } catch {
      // skip unreadable files
    }
  }

  // Also scan data files that contain Japanese text
  const dataFiles = [
    "src/lib/wiki-data.ts",
    "src/lib/stories.ts",
    "src/lib/stories.generated.ts",
    "src/lib/timeline-data.ts",
    "src/lib/civilization-data.ts",
    "src/lib/tech-data.ts",
    "src/lib/liminal-data.ts",
    "src/lib/iris-data.ts",
    "src/lib/mina-data.ts",
    "src/lib/faction-data.ts",
  ]

  for (const relPath of dataFiles) {
    try {
      const content = await readFile(join(process.cwd(), relPath), "utf-8")
      for (const ch of extractUniqueCharacters(content)) {
        if (ch.codePointAt(0) > 0x7f) {
          chars.add(ch)
        }
      }
    } catch {
      // file may not exist yet (stories.generated.ts)
    }
  }

  return chars
}

async function main() {
  console.log("Scanning text content for glyph usage...")
  const usedChars = await scanTextFiles(join(process.cwd(), "lore"))

  // Also scan src/lib data files
  const libChars = await scanTextFiles(join(process.cwd(), "src/lib"))
  for (const ch of libChars) usedChars.add(ch)

  console.log(`Found ${usedChars.size} unique non-ASCII characters`)

  // Fetch Noto Sans JP font (use a local copy or download)
  // For this script, we expect the font to be already available via next/font cache
  // Alternative: download from Google Fonts API
  const FONT_URL = "https://fonts.gstatic.com/s/notosansjp/v53/Ia2H-jBFSTpSRAs_3mg28y4p8i4MHjJo4.woff2"

  console.log("Generating subset font...")
  try {
    const subsetBuffer = await createSubsetFont({
      fontUrl: FONT_URL,
      glyphs: [...usedChars].map((ch) => ch.codePointAt(0)),
      formats: ["woff2"],
    })

    const outputPath = join(process.cwd(), "public/fonts/NotoSansJP-subset.woff2")
    await writeFile(outputPath, Buffer.from(subsetBuffer))
    console.log(`Subset font written to ${outputPath} (${(subsetBuffer.byteLength / 1024).toFixed(1)} KB)`)
  } catch (err) {
    console.error("Font subsetting failed:", err.message)
    console.log("Falling back to next/font/google (no change needed)")
  }
}

main()
```

### Modify `layout.tsx`

After generating the subset font, update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next"
import type { ReactNode } from "react"
import localFont from "next/font/local"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/edu/navigation"

const notoSansJP = localFont({
  src: "../public/fonts/NotoSansJP-subset.woff2",
  variable: "--font-sans",
  weight: "400",
  display: "swap",
  fallback: ["Noto Sans JP", "sans-serif"],
})

// Fallback: if subset font doesn't exist yet, use Google Fonts
// Comment out the above and uncomment below during initial setup:
// import { Noto_Sans_JP } from "next/font/google"
// const notoSansJP = Noto_Sans_JP({
//   variable: "--font-sans",
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "700", "900"],
// })

export const metadata: Metadata = {
  title: "Eternal Dominion Universe — 統合時空構造書 v3.0",
  description: "E16連星系から地球AD2026へ — AURALIS 地球2026交信プロジェクト設定書 v2.0",
  keywords: [
    "Eternal Dominion",
    "EDU",
    "AURALIS",
    "Liminal Forge",
    "E16連星系",
    "SF",
    "ユニバース",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      <body
        className={`${notoSansJP.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-sans), 'Noto Sans JP', sans-serif" }}
      >
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### Add to `package.json`

```json
{
  "scripts": {
    "generate:fonts": "node scripts/subsetFont.mjs",
    "prebuild": "bun run generate:stories && bun run generate:fonts"
  }
}
```

### Verification

```bash
# 1. Run: node scripts/subsetFont.mjs
# 2. Check: ls -la public/fonts/NotoSansJP-subset.woff2
#    Expected: < 500KB (vs 16MB+ full Noto Sans JP)
# 3. bun build
# 4. bun dev — verify Japanese text renders correctly
# 5. Lighthouse audit — check font load time improvement
```

### Important Notes

- `localFont` in Next.js supports a single weight per file. For variable weights, you need separate subset files or use a variable font file.
- If `@glypht/core`'s `createSubsetFont` API differs from the above, check the latest `@glypht/core` docs and adjust accordingly.
- The `fallback` in `localFont` ensures the page still renders even if the subset font fails to load.
- Consider adding a CI step that re-generates the font when content changes (new stories, wiki entries, etc.).

---

## Implementation Priority & Dependencies

```
Section 1 (OG Images)     ← Independent, can start immediately
Section 2 (remark-gfm)     ← Independent, minimal risk
Section 3 (smol-toml)      ← Depends on Section 2 for frontmatter parsing
Section 4 (Font Subset)    ← Depends on Section 3 (content stabilized)
```

| Order | Section | Impact | Effort | Risk |
|-------|---------|--------|--------|------|
| 1st | OG Images | High (SEO + social sharing) | Low | Low |
| 2nd | remark-gfm | Medium (future-proofing) | Low | Very Low |
| 3rd | smol-toml | High (DX improvement) | Medium | Medium |
| 4th | Font Subset | Medium (performance) | High | Medium |
