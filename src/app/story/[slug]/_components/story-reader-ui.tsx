"use client"

import React, { useState, useEffect } from "react"
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
} from "lucide-react"
import { type StoryMeta, type ChapterMeta, getStoriesForEntry, getStoryBySlug } from "@/lib/stories"
import { type Lang, tl } from "@/lib/lang"
import ReadingProgress from "./reading-progress"
import StarField from "./star-field"

/* ─── Wiki name to image mapping ─── */
const entryImageMap: Record<string, string> = {
  アイリス: "/edu-iris.png",
  Diana: "/edu-diana.png",
  "Kate Claudia": "/edu-kate-claudia.png",
  "Lily Steiner": "/edu-lillie-steiner.png",
  "レイラ・ヴィレル・ノヴァ": "/edu-fiona.png",
  "カステリア・グレンヴェルト": "/edu-diana.png",
  "シトラ・セレス": "/edu-iris.png",
  ミュー: "/edu-diana.png",
  Jen: "/edu-iris.png",
  "Tina/Gue": "/edu-diana.png",
  "アルファ・ケイン": "/edu-hero.png",
  "セリア・ドミニクス": "/edu-celia.png",
  弦太郎: "/edu-auralis.png",
  Slime_Woman: "/edu-diana.png",
  ジュン: "/edu-hero.png",
  "Kate Patton": "/edu-kate-claudia.png",
  "Lillie Ardent": "/edu-lillie-steiner.png",
  "ミナ・エウレカ・エルンスト": "/edu-diana.png",
  "Ninny Offenbach": "/edu-fiona.png",
}

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

function isSceneBreak(text: string): boolean {
  const t = text.trim()
  return (
    t.startsWith("─") ||
    t.startsWith("─") ||
    t.startsWith("==") ||
    t.startsWith("**") ||
    t.startsWith("##") ||
    t.startsWith("＊") ||
    t.length < 5
  )
}

/* ─── Lang Toggle ─── */
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center border border-cosmic-border/40 rounded-lg overflow-hidden shrink-0">
      <button
        type="button"
        onClick={() => setLang("ja")}
        className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
          lang === "ja"
            ? "bg-nebula-purple text-white"
            : "text-cosmic-muted hover:text-cosmic-text"
        }`}
      >
        JP
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
          lang === "en"
            ? "bg-nebula-purple text-white"
            : "text-cosmic-muted hover:text-cosmic-text"
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
    <div className="mt-12 pt-8 border-t border-cosmic-border/30">
      <h3 className="text-sm font-bold text-cosmic-muted uppercase tracking-wider mb-5 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-nebula-purple" />
        {tl("関連作品", "Related Stories", lang)}
      </h3>
      <div className="flex flex-col gap-2">
        {stories.map(
          (s) =>
            s && (
              <Link
                key={s.slug}
                href={`/story/${s.slug}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-nebula-purple/15 bg-nebula-purple/5 text-sm text-nebula-purple/90 hover:bg-nebula-purple/10 hover:border-nebula-purple/30 transition-all duration-200 group"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="truncate block group-hover:text-electric-blue transition-colors">
                    {s.title}
                  </span>
                  {s.era && <span className="text-[10px] text-cosmic-muted">{s.era}</span>}
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
  paragraphs: string[]
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
  paragraphs,
  fetchFailed,
  chapter,
  chapterStories,
  storyIndex,
  prev,
  next,
  relatedEntries,
}: StoryReaderUIProps) {
  const [lang, setLangState] = useState<Lang>("ja")

  useEffect(() => {
    const saved = localStorage.getItem("edu-lang") as Lang | null
    if (saved === "en" || saved === "ja") setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem("edu-lang", l)
  }

  const chapterLabel =
    chapter
      ? tl(
          `第${toRoman(chapter.id)}章 ${chapter.titleJa}`,
          `Chapter ${toRoman(chapter.id)} · ${chapter.titleEn}`,
          lang
        )
      : ""

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <ReadingProgress />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 gap-3">
            {/* Left: breadcrumb */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href="/story"
                className="flex items-center gap-2 text-cosmic-muted hover:text-electric-blue transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Story</span>
              </Link>
              <span className="text-cosmic-border">/</span>
              <div className="flex items-center gap-1.5 min-w-0">
                {chapter && (
                  <span className="text-[10px] text-cosmic-muted shrink-0">
                    {toRoman(chapter.id)}
                  </span>
                )}
                <span className="text-xs text-cosmic-muted truncate">
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
                  className="w-7 h-7 rounded-lg bg-cosmic-surface/50 border border-cosmic-border/30 flex items-center justify-center text-cosmic-muted hover:text-electric-blue hover:border-electric-blue/30 transition-colors"
                  title={prev.title}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              )}
              {next && (
                <Link
                  href={`/story/${next.slug}`}
                  className="w-7 h-7 rounded-lg bg-cosmic-surface/50 border border-cosmic-border/30 flex items-center justify-center text-cosmic-muted hover:text-electric-blue hover:border-electric-blue/30 transition-colors"
                  title={next.title}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Chapter Indicator */}
          {chapter && (
            <div className="mb-8 flex items-center gap-2">
              <Link
                href="/story"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-cosmic-muted bg-cosmic-surface/50 border border-cosmic-border/30 rounded-full px-3 py-1 hover:text-electric-blue hover:border-electric-blue/30 transition-colors"
              >
                <Library className="w-3 h-3" />
                {chapterLabel}
              </Link>
              <span className="text-[10px] text-cosmic-muted">
                {storyIndex + 1} / {chapterStories.length}
              </span>
            </div>
          )}

          {/* Story Header */}
          <header className="mb-12">
            {chapter && (
              <div className={`h-0.5 w-16 mb-6 bg-gradient-to-r ${chapter.color} rounded-full`} />
            )}

            <h1 className="text-2xl sm:text-3xl font-black text-cosmic-text mb-3 leading-tight tracking-tight">
              {story.title}
            </h1>

            {story.label !== story.title && (
              <p className="text-xs text-cosmic-muted mb-4">{story.label}</p>
            )}

            {story.era && (
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-3.5 h-3.5 text-cosmic-muted" />
                <span className="text-xs text-cosmic-muted">{story.era}</span>
              </div>
            )}

            {/* Related Characters */}
            <div className="flex flex-wrap gap-2">
              {relatedEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/wiki/${encodeURIComponent(entry.id)}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-nebula-purple/20 bg-nebula-purple/5 text-nebula-purple/80 hover:bg-nebula-purple/15 hover:border-nebula-purple/40 transition-all duration-200"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-nebula-purple/30 bg-cosmic-dark/60 flex items-center justify-center shrink-0">
                    {entryImageMap[entry.name] ? (
                      <Image
                        src={entryImageMap[entry.name]}
                        alt={entry.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-3 h-3 text-nebula-purple/60" />
                    )}
                  </div>
                  {entry.name}
                </Link>
              ))}
            </div>

            {/* Decorative divider */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-border/40 to-transparent" />
              <BookOpen className="w-3 h-3 text-cosmic-border/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-border/40 to-transparent" />
            </div>
          </header>

          {/* Story Body */}
          <article className="prose-story">
            {fetchFailed ? (
              <p className="text-sm text-cosmic-muted/70 text-center py-12">
                {tl(
                  "この作品は現在読み込みできません。後ほど再度お試しください。",
                  "This story is currently unavailable. Please try again later.",
                  lang
                )}
              </p>
            ) : (
              paragraphs.map((p, i) => (
                <div key={i} className="mb-6">
                  {isSceneBreak(p) ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-12 h-px bg-nebula-purple/30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-nebula-purple/40 mx-3" />
                      <div className="w-12 h-px bg-nebula-purple/30" />
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-cosmic-text/85 leading-[2] text-justify indent-4">
                      {p.trim()}
                    </p>
                  )}
                </div>
              ))
            )}
          </article>

          {/* Story footer divider */}
          <div className="mt-12 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-border/40 to-transparent" />
            <BookOpen className="w-3 h-3 text-cosmic-border/50" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-border/40 to-transparent" />
          </div>

          {/* Related Stories */}
          <RelatedStoriesSection
            currentSlug={story.slug}
            entryIds={story.relatedEntries}
            lang={lang}
          />

          {/* Chapter Navigation */}
          <div className="mt-12 pt-8 border-t border-cosmic-border/30">
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link
                  href={`/story/${prev.slug}`}
                  className="flex-1 group p-4 rounded-xl border border-cosmic-border/20 bg-cosmic-surface/30 hover:bg-cosmic-surface/60 hover:border-nebula-purple/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowLeft className="w-3 h-3 text-cosmic-muted group-hover:text-electric-blue transition-colors" />
                    <span className="text-[10px] text-cosmic-muted uppercase tracking-wider">
                      {tl("前の作品", "Previous", lang)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-cosmic-text group-hover:text-electric-blue transition-colors line-clamp-2">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {next ? (
                <Link
                  href={`/story/${next.slug}`}
                  className="flex-1 group p-4 rounded-xl border border-cosmic-border/20 bg-cosmic-surface/30 hover:bg-cosmic-surface/60 hover:border-nebula-purple/30 transition-all duration-200 text-right"
                >
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-[10px] text-cosmic-muted uppercase tracking-wider">
                      {tl("次の作品", "Next", lang)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-cosmic-muted group-hover:text-electric-blue transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-cosmic-text group-hover:text-electric-blue transition-colors line-clamp-2">
                    {next.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>

          {/* Back links */}
          <div className="mt-10 text-center">
            <Link
              href="/story"
              className="inline-flex items-center gap-2 text-xs text-electric-blue hover:underline transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              {tl("Story Archive に戻る", "Back to Story Archive", lang)}
            </Link>
            {relatedEntries.length > 0 && (
              <>
                <span className="text-cosmic-border mx-3">|</span>
                <Link
                  href={`/wiki/${encodeURIComponent(relatedEntries[0].id)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-cosmic-muted hover:text-electric-blue hover:underline transition-colors"
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
      <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent" />
          <p className="text-xs text-cosmic-muted">EDU Stories — Eternal Dominion Universe</p>
          <Link
            href="/story"
            className="inline-flex items-center gap-1.5 text-xs text-electric-blue hover:underline transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            {tl("Story Archive に戻る", "Back to Story Archive", lang)}
          </Link>
        </div>
      </footer>
    </div>
  )
}
