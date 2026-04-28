"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Library,
  Feather,
} from "lucide-react"
import {
  type StoryMeta,
  type ChapterMeta,
  ENTRY_IMAGE_MAP,
  getStoriesForEntry,
  getStoryBySlug,
  getStoryTitle,
} from "@/lib/stories"
import { type Lang, tl } from "@/lib/lang"
import ReadingProgress from "./reading-progress"
import { StarField } from "@/components/edu/star-field"

function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ]
  let result = ""
  for (const [value, numeral] of map) {
    while (n >= value) {
      result += numeral
      n -= value
    }
  }
  return result
}

/* ─── Detect scene breaks / section markers ─── */
function isSceneBreak(text: string): boolean {
  const t = text.trim()
  return (
    t.startsWith("─") ||
    t.startsWith("━") ||
    t.startsWith("==") ||
    t.startsWith("**") ||
    t.startsWith("##") ||
    t.startsWith("＊") ||
    (t.length < 5 && !t.match(/[a-zA-Z\u3040-\u30ff\u4e00-\u9faf]/))
  )
}

/* ─── Detect chapter-like headings within text ─── */
function isChapterHeading(text: string): boolean {
  const t = text.trim()
  // Very short lines (1-15 chars) that don't end with typical sentence punctuation
  return (
    t.length > 0 &&
    t.length <= 20 &&
    !t.endsWith("。") &&
    !t.endsWith(".") &&
    !t.endsWith("！") &&
    !t.endsWith("？") &&
    !t.endsWith("!") &&
    !t.endsWith("?") &&
    !t.endsWith("」") &&
    !t.endsWith("'") &&
    !t.endsWith('"') &&
    !t.endsWith(")") &&
    !t.startsWith("「") &&
    !t.startsWith('"') &&
    !t.startsWith("(") &&
    !t.startsWith("「") &&
    t !== ""
  )
}

/* ─── Lang Toggle ─── */
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center border border-white/10 rounded-full overflow-hidden shrink-0 backdrop-blur-md bg-white/5">
      <button
        type="button"
        onClick={() => setLang("ja")}
        className={`px-3 py-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
          lang === "ja"
            ? "bg-white/15 text-white shadow-inner"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        JP
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
          lang === "en"
            ? "bg-white/15 text-white shadow-inner"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        EN
      </button>
    </div>
  )
}

/* ─── Related Stories Section ─── */
function RelatedStoriesSection({
  currentSlug,
  entryIds,
  lang,
}: {
  currentSlug: string
  entryIds: string[]
  lang: Lang
}) {
  const relatedSlugs = new Set<string>()
  entryIds.forEach((eid) => {
    getStoriesForEntry(eid).forEach((s) => {
      if (s.slug !== currentSlug) relatedSlugs.add(s.slug)
    })
  })
  const stories = Array.from(relatedSlugs)
    .map((slug) => getStoryBySlug(slug))
    .filter(Boolean)

  if (stories.length === 0) return null
  return (
    <div className="mt-16 pt-10 border-t border-white/8">
      <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5" />
        {tl("関連作品", "Related Stories", lang)}
      </h3>
      <div className="flex flex-col gap-1.5">
        {stories.map(
          (s) =>
            s && (
              <Link
                key={s.slug}
                href={`/story/${s.slug}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-300 group"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-40" />
                <div className="flex-1 min-w-0">
                  <span className="truncate block">{getStoryTitle(s, lang)}</span>
                  {s.era && <span className="text-[10px] text-white/25">{s.era}</span>}
                </div>
                <ChevronRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
        )}
      </div>
    </div>
  )
}

/* ─── Props ─── */
export type StoryReaderUIProps = {
  story: StoryMeta
  paragraphsJa: string[]
  paragraphsEn: string[]
  fetchFailed: boolean
  chapter: ChapterMeta | undefined
  chapterStories: StoryMeta[]
  storyIndex: number
  prev: StoryMeta | null
  next: StoryMeta | null
  relatedEntries: Array<{ id: string; name: string }>
}

/* ─── Main Client Component ─── */
export function StoryReaderUI({
  story,
  paragraphsJa,
  paragraphsEn,
  fetchFailed,
  chapter,
  chapterStories,
  storyIndex,
  prev,
  next,
  relatedEntries,
}: StoryReaderUIProps) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edu-lang") as Lang | null
      if (saved === "en" || saved === "ja") return saved
    }
    return "ja"
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem("edu-lang", l)
  }

  const paragraphs = lang === "ja" ? paragraphsJa : paragraphsEn

  /* Detect section breaks for chapter-like structure */
  const sections = useMemo(() => {
    const result: Array<{
      type: "heading" | "scene" | "paragraph"
      content: string
      index: number
    }> = []
    paragraphs.forEach((p, i) => {
      if (isSceneBreak(p)) {
        result.push({ type: "scene", content: p, index: i })
      } else if (isChapterHeading(p) && i > 0 && isSceneBreak(paragraphs[i - 1])) {
        result.push({ type: "heading", content: p, index: i })
      } else {
        result.push({ type: "paragraph", content: p, index: i })
      }
    })
    return result
  }, [paragraphs])

  const chapterLabel = chapter
    ? tl(
        `第${toRoman(chapter.id)}章 ${chapter.titleJa}`,
        `Chapter ${toRoman(chapter.id)} · ${chapter.titleEn}`,
        lang
      )
    : ""

  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <ReadingProgress />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-edu-bg/90 backdrop-blur-sm border-b border-edu-border">
        <div className="max-w-[680px] mx-auto px-6">
          <div className="flex items-center justify-between h-14 gap-3">
            {/* Left: breadcrumb */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href="/story"
                className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[11px] hidden sm:inline tracking-wider uppercase">Story</span>
              </Link>
              <span className="text-white/10">/</span>
              <div className="flex items-center gap-1.5 min-w-0">
                {chapter && (
                  <span className="text-[10px] text-white/25 shrink-0">{toRoman(chapter.id)}</span>
                )}
                <span className="text-[11px] text-white/30 truncate">
                  {chapter ? tl(chapter.titleJa, chapter.titleEn, lang) : ""}
                </span>
              </div>
            </div>

            {/* Right: lang toggle + prev/next */}
            <div className="flex items-center gap-2 shrink-0">
              <LangToggle lang={lang} setLang={setLang} />
              {prev && (
                <Link
                  href={`/story/${prev.slug}`}
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/15 transition-all duration-300"
                  title={prev.title}
                >
                  <ChevronLeft className="w-3 h-3" />
                </Link>
              )}
              {next && (
                <Link
                  href={`/story/${next.slug}`}
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/15 transition-all duration-300"
                  title={next.title}
                >
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-[680px] mx-auto">
          {/* Chapter Indicator */}
          {chapter && (
            <div className="mb-10 flex items-center gap-3">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 text-[10px] font-medium text-white/25 bg-white/3 border border-white/6 rounded-full px-4 py-1.5 hover:text-white/50 hover:border-white/12 transition-all duration-300 tracking-wider uppercase"
              >
                <Library className="w-3 h-3" />
                {chapterLabel}
              </Link>
              <span className="text-[10px] text-white/20 tabular-nums">
                {storyIndex + 1} / {chapterStories.length}
              </span>
            </div>
          )}

          {/* Story Header */}
          <header className="mb-16">
            {chapter && (
              <div
                className={`h-px w-12 mb-8 bg-gradient-to-r ${chapter.color} opacity-40 rounded-full`}
              />
            )}

            <h1 className="text-2xl sm:text-[28px] font-extralight text-white/90 mb-4 leading-[1.4] tracking-tight">
              {getStoryTitle(story, lang)}
            </h1>

            {story.era && (
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-3 h-3 text-white/20" />
                <span className="text-[11px] text-white/25 tracking-wider">{story.era}</span>
              </div>
            )}

            {/* Related Characters */}
            <div className="flex flex-wrap gap-2">
              {relatedEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/wiki/${encodeURIComponent(entry.id)}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-full border border-white/6 bg-white/3 text-white/40 hover:text-white/60 hover:border-white/12 transition-all duration-300"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-white/8 bg-white/5 flex items-center justify-center shrink-0">
                    {ENTRY_IMAGE_MAP[entry.name] ? (
                      <Image
                        src={ENTRY_IMAGE_MAP[entry.name]}
                        alt={entry.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-2.5 h-2.5 text-white/20" />
                    )}
                  </div>
                  {entry.name}
                </Link>
              ))}
            </div>

            {/* Decorative divider */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
              <Feather className="w-3 h-3 text-white/10" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            </div>
          </header>

          {/* Story Body */}
          <article className="novel-prose">
            {fetchFailed ? (
              <p className="text-sm text-white/30 text-center py-16">
                {tl(
                  "この作品は現在読み込みできません。後ほど再度お試しください。",
                  "This story is currently unavailable. Please try again later.",
                  lang
                )}
              </p>
            ) : (
              sections.map((section) => {
                if (section.type === "scene") {
                  return (
                    <div key={section.index} className="flex items-center justify-center py-10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/10" />
                        <div className="w-1 h-1 rounded-full bg-white/15" />
                        <div className="w-24 h-px bg-white/10" />
                        <div className="w-1 h-1 rounded-full bg-white/15" />
                        <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/10" />
                      </div>
                    </div>
                  )
                }
                if (section.type === "heading") {
                  return (
                    <h2
                      key={section.index}
                      className="text-base sm:text-lg font-extralight text-white/70 mt-12 mb-6 tracking-wide text-center"
                    >
                      {section.content.trim()}
                    </h2>
                  )
                }
                return (
                  <p key={section.index} className="novel-paragraph">
                    {section.content.trim()}
                  </p>
                )
              })
            )}
          </article>

          {/* Story footer divider */}
          <div className="mt-16 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            <Feather className="w-3 h-3 text-white/10" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          </div>

          {/* Related Stories */}
          <RelatedStoriesSection
            currentSlug={story.slug}
            entryIds={story.relatedEntries}
            lang={lang}
          />

          {/* Chapter Navigation */}
          <div className="mt-16 pt-10 border-t border-white/8">
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link
                  href={`/story/${prev.slug}`}
                  className="flex-1 group p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowLeft className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.15em]">
                      {tl("前の作品", "Previous", lang)}
                    </span>
                  </div>
                  <p className="text-xs font-light text-white/50 group-hover:text-white/70 transition-colors line-clamp-2 leading-relaxed">
                    {getStoryTitle(prev, lang)}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {next ? (
                <Link
                  href={`/story/${next.slug}`}
                  className="flex-1 group p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all duration-300 text-right"
                >
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.15em]">
                      {tl("次の作品", "Next", lang)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                  <p className="text-xs font-light text-white/50 group-hover:text-white/70 transition-colors line-clamp-2 leading-relaxed">
                    {getStoryTitle(next, lang)}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>

          {/* Back links */}
          <div className="mt-12 text-center">
            <Link
              href="/story"
              className="inline-flex items-center gap-2 text-[11px] text-white/20 hover:text-white/40 transition-colors tracking-wider uppercase"
            >
              <ArrowLeft className="w-3 h-3" />
              {tl("Story Archive に戻る", "Back to Story Archive", lang)}
            </Link>
            {relatedEntries.length > 0 && (
              <>
                <span className="text-white/8 mx-3">|</span>
                <Link
                  href={`/wiki/${encodeURIComponent(relatedEntries[0].id)}`}
                  className="inline-flex items-center gap-1.5 text-[11px] text-white/15 hover:text-white/35 transition-colors"
                >
                  {tl(
                    `「${relatedEntries[0].name}」のWiki`,
                    `${relatedEntries[0].name} Wiki`,
                    lang
                  )}
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-10 px-6">
        <div className="max-w-[680px] mx-auto text-center space-y-3">
          <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <p className="text-[10px] text-white/15 tracking-[0.15em] uppercase">
            EDU Stories — Eternal Dominion Universe
          </p>
          <Link
            href="/story"
            className="inline-flex items-center gap-1.5 text-[10px] text-white/15 hover:text-white/30 transition-colors tracking-wider uppercase"
          >
            <ArrowLeft className="w-2.5 h-2.5" />
            {tl("Story Archive に戻る", "Back to Story Archive", lang)}
          </Link>
        </div>
      </footer>
    </div>
  )
}
