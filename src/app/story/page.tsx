"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, ArrowLeft, Clock, Users, ChevronDown, Library, Feather } from "lucide-react"
import { ALL_STORIES, CHAPTERS, ENTRY_IMAGE_MAP, getStoriesByChapter, getStoryTitle } from "@/lib/stories"
import { type Lang, tl } from "@/lib/lang"
import { StarField } from "@/components/edu/star-field"

/* ─── Roman numerals ─── */
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

/* ─── Lang Toggle ─── */
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center border border-edu-border rounded-full overflow-hidden shrink-0 bg-edu-surface">
      <button
        type="button"
        onClick={() => setLang("ja")}
        className={`px-3 py-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
          lang === "ja"
            ? "bg-edu-accent/15 text-edu-accent"
            : "text-edu-muted hover:text-edu-text"
        }`}
      >
        JP
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
          lang === "en"
            ? "bg-edu-accent/15 text-edu-accent"
            : "text-edu-muted hover:text-edu-text"
        }`}
      >
        EN
      </button>
    </div>
  )
}

/* ─── Story Card ─── */
function StoryCard({
  story,
  chapter,
  index,
  lang,
}: {
  story: (typeof ALL_STORIES)[0]
  chapter: (typeof CHAPTERS)[0]
  index: number
  lang: Lang
}) {
  return (
    <Link
      href={`/story/${story.slug}`}
      className="block group relative rounded-xl overflow-hidden transition-all duration-500 border border-edu-border bg-edu-card hover:bg-edu-surface"
    >
      <div className="p-5 sm:p-6">
        {/* Number + Title */}
        <div className="flex items-start gap-3 mb-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-edu-surface border border-edu-border flex items-center justify-center text-[10px] font-light text-edu-muted tabular-nums">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-light text-edu-text group-hover:text-edu-accent transition-colors mb-0.5 leading-snug">
              {getStoryTitle(story, lang)}
            </h4>
            {story.label !== story.title && (
              <p className="text-[10px] text-edu-muted truncate">{story.label}</p>
            )}
          </div>
        </div>

        {/* Era */}
        {story.era && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full border border-edu-border bg-edu-surface text-edu-muted">
              <Clock className="w-2.5 h-2.5" />
              {story.era}
            </span>
          </div>
        )}

        {/* Characters */}
        {story.relatedEntries.length > 0 && (
          <div className="mb-4 flex items-center gap-1.5 flex-wrap">
            <Users className="w-3 h-3 text-edu-muted shrink-0" />
            {story.relatedEntries.map((entry) => (
              <Link
                key={entry}
                href={`/wiki#${entry}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] text-edu-muted bg-edu-surface border border-edu-border rounded-full px-2 py-0.5 hover:text-edu-accent hover:border-edu-accent/30 transition-all duration-300"
              >
                {ENTRY_IMAGE_MAP[entry] && (
                  <Image
                    src={ENTRY_IMAGE_MAP[entry]}
                    alt={entry}
                    width={12}
                    height={12}
                    className="rounded-full"
                  />
                )}
                {entry}
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-end">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-light text-edu-muted group-hover:text-edu-accent group-hover:gap-2.5 transition-all duration-300">
            {tl("読む", "Read", lang)}
            <span className="text-[10px]">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Chapter Section ─── */
function ChapterSection({
  chapter,
  stories,
  lang,
  sectionRef,
}: {
  chapter: (typeof CHAPTERS)[0]
  stories: (typeof ALL_STORIES)[0][]
  lang: Lang
  sectionRef: React.RefObject<HTMLElement | null>
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <section ref={sectionRef} id={`chapter-${chapter.id}`} className="mb-16 scroll-mt-20">
      {/* Chapter Header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full text-left rounded-2xl p-6 sm:p-8 mb-6 transition-all duration-500 hover:bg-edu-surface group cursor-pointer border border-edu-border bg-edu-card"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <span
                className={`text-4xl sm:text-5xl font-extralight bg-gradient-to-br ${chapter.color} bg-clip-text text-transparent leading-none`}
              >
                {toRoman(chapter.id)}
              </span>
              <div>
                <h2 className={`text-base sm:text-lg font-light text-edu-text`}>
                  {tl(chapter.titleJa, chapter.titleEn, lang)}
                </h2>
                <p className="text-[10px] text-edu-muted tracking-[0.2em] uppercase">
                  {tl(chapter.titleEn, chapter.titleJa, lang)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 mb-3">
              <span className="inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full border border-edu-border bg-edu-surface text-edu-muted">
                {chapter.era}
              </span>
              <span className="text-[10px] text-edu-muted tracking-wider">
                {stories.length} {tl("作品", "stories", lang)}
              </span>
            </div>
            <p className="text-xs text-edu-muted leading-relaxed max-w-2xl font-light">
              {tl(chapter.description, chapter.descriptionEn, lang)}
            </p>
          </div>
          <div
            className={`shrink-0 w-8 h-8 rounded-full bg-edu-surface border border-edu-border flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown className="w-4 h-4 text-edu-muted" />
          </div>
        </div>
      </button>

      {/* Story Cards Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-all duration-500 ${
          isOpen
            ? "max-h-[9999px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
        }`}
      >
        {stories.map((story, i) => (
          <StoryCard key={story.slug} story={story} chapter={chapter} index={i} lang={lang} />
        ))}
      </div>
    </section>
  )
}

/* ─── Pre-compute stats ─── */
const uniqueCharacters = new Set<string>()
for (const s of ALL_STORIES) {
  for (const e of s.relatedEntries) uniqueCharacters.add(e)
}

const chapterData = CHAPTERS.map((ch) => ({
  chapter: ch,
  stories: getStoriesByChapter(ch.id),
})).filter((d) => d.stories.length > 0)

/* ─── Main Page ─── */
export default function StoryArchivePage() {
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

  /* Refs for chapter scroll-jump */
  const chapterRefs = useMemo(() => {
    const refs: Record<number, React.RefObject<HTMLElement | null>> = {}
    for (const { chapter } of chapterData) {
      refs[chapter.id] = React.createRef<HTMLElement>()
    }
    return refs
  }, [])

  function scrollToChapter(id: number) {
    chapterRefs[id]?.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />

      <main className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-edu-border to-transparent mb-10" />
            <div className="flex items-center justify-center gap-3 mb-5">
              <Feather className="w-6 h-6 text-edu-muted" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-edu-text mb-5 tracking-wider">
              Story Archive
            </h1>
            <p className="text-sm text-edu-muted max-w-lg mx-auto leading-relaxed font-light">
              Eternal Dominion Universe — <br className="sm:hidden" />
              {tl("全五章にわたる物語全集", "A Complete Collection Across Five Chapters", lang)}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex flex-col items-center">
                <span className="text-xl font-extralight text-edu-text tabular-nums">
                  {CHAPTERS.length}
                </span>
                <span className="text-[9px] text-edu-muted uppercase tracking-[0.2em] mt-1">
                  {tl("章", "Chapters", lang)}
                </span>
              </div>
              <div className="w-px h-8 bg-edu-border" />
              <div className="flex flex-col items-center">
                <span className="text-xl font-extralight text-edu-text tabular-nums">
                  {ALL_STORIES.length}
                </span>
                <span className="text-[9px] text-edu-muted uppercase tracking-[0.2em] mt-1">
                  {tl("作品", "Stories", lang)}
                </span>
              </div>
              <div className="w-px h-8 bg-edu-border" />
              <div className="flex flex-col items-center">
                <span className="text-xl font-extralight text-edu-text tabular-nums">
                  {uniqueCharacters.size}
                </span>
                <span className="text-[9px] text-edu-muted uppercase tracking-[0.2em] mt-1">
                  {tl("キャラ", "Characters", lang)}
                </span>
              </div>
            </div>

            <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-edu-border to-transparent mt-10" />
          </div>

          {/* ─── Chapter Quick Navigation ─── */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-edu-border" />
              <span className="text-[9px] text-edu-muted uppercase tracking-[0.25em] font-medium">
                {tl("章一覧", "Chapter Index", lang)}
              </span>
              <div className="h-px flex-1 bg-edu-border" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {chapterData.map(({ chapter, stories }) => {
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => scrollToChapter(chapter.id)}
                    className="text-left p-5 rounded-xl border border-edu-border bg-edu-card hover:bg-edu-surface transition-all duration-300 group"
                  >
                    <span
                      className={`text-3xl font-extralight bg-gradient-to-br ${chapter.color} bg-clip-text text-transparent leading-none block mb-2.5`}
                    >
                      {toRoman(chapter.id)}
                    </span>
                    <p className="text-xs font-light text-edu-text leading-tight mb-1.5">
                      {tl(chapter.titleJa, chapter.titleEn, lang)}
                    </p>
                    <p className="text-[10px] text-edu-muted font-light">{chapter.era}</p>
                    <p className="text-[10px] mt-2 text-edu-muted tabular-nums">
                      {stories.length} {tl("作品", "stories", lang)}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chapter Sections */}
          {chapterData.map((data) => (
            <ChapterSection
              key={data.chapter.id}
              chapter={data.chapter}
              stories={data.stories}
              lang={lang}
              sectionRef={chapterRefs[data.chapter.id]}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-edu-border py-10 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-edu-border to-transparent" />
          <p className="text-[10px] text-edu-muted tracking-[0.15em] uppercase">
            EDU Stories — Eternal Dominion Universe
          </p>
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 text-[10px] text-edu-muted hover:text-edu-accent transition-colors tracking-wider uppercase"
          >
            <ArrowLeft className="w-2.5 h-2.5" />
            {tl("EDU 百科事典に戻る", "Back to EDU Encyclopedia", lang)}
          </Link>
        </div>
      </footer>
    </div>
  )
}
