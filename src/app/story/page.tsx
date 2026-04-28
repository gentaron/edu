"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Clock, Users, ChevronDown, Library, Feather } from "lucide-react"
import { ALL_STORIES, CHAPTERS, getStoriesByChapter, getStoryTitle } from "@/lib/stories"
import { type Lang, tl } from "@/lib/lang"

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

/* ─── Seeded PRNG ─── */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: seededRandom(i * 7 + 1)() * 100,
        top: seededRandom(i * 13 + 3)() * 100,
        size: seededRandom(i * 17 + 5)() * 1.5 + 0.3,
        delay: seededRandom(i * 23 + 7)() * 5,
        duration: seededRandom(i * 29 + 11)() * 3 + 2,
        opacity: seededRandom(i * 31 + 13)() * 0.3 + 0.1,
      })),
    []
  )
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Lang Toggle ─── */
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center border border-white/8 rounded-full overflow-hidden shrink-0 backdrop-blur-md bg-white/5">
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
      className="block group relative rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.01] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
    >
      <div className="p-5 sm:p-6">
        {/* Number + Title */}
        <div className="flex items-start gap-3 mb-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-[10px] font-light text-white/30 tabular-nums">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-light text-white/70 group-hover:text-white/90 transition-colors mb-0.5 leading-snug">
              {getStoryTitle(story, lang)}
            </h4>
            {story.label !== story.title && (
              <p className="text-[10px] text-white/20 truncate">{story.label}</p>
            )}
          </div>
        </div>

        {/* Era */}
        {story.era && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full border border-white/6 bg-white/3 text-white/25">
              <Clock className="w-2.5 h-2.5" />
              {story.era}
            </span>
          </div>
        )}

        {/* Characters */}
        {story.relatedEntries.length > 0 && (
          <div className="mb-4 flex items-center gap-1.5 flex-wrap">
            <Users className="w-3 h-3 text-white/15 shrink-0" />
            {story.relatedEntries.map((entry) => (
              <Link
                key={entry}
                href={`/wiki#${entry}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] text-white/25 bg-white/3 border border-white/6 rounded-full px-2 py-0.5 hover:text-white/50 hover:border-white/12 transition-all duration-300"
              >
                {entryImageMap[entry] && (
                  <Image
                    src={entryImageMap[entry]}
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
          <span className="inline-flex items-center gap-1.5 text-[11px] font-light text-white/20 group-hover:text-white/40 group-hover:gap-2.5 transition-all duration-300">
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
        className="w-full text-left rounded-2xl p-6 sm:p-8 mb-6 transition-all duration-500 hover:bg-white/[0.03] group cursor-pointer border border-white/5 bg-white/[0.01]"
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
                <h2 className={`text-base sm:text-lg font-light text-white/60`}>
                  {tl(chapter.titleJa, chapter.titleEn, lang)}
                </h2>
                <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase">
                  {tl(chapter.titleEn, chapter.titleJa, lang)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 mb-3">
              <span className="inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full border border-white/6 bg-white/3 text-white/20">
                {chapter.era}
              </span>
              <span className="text-[10px] text-white/15 tracking-wider">
                {stories.length} {tl("作品", "stories", lang)}
              </span>
            </div>
            <p className="text-xs text-white/25 leading-relaxed max-w-2xl font-light">
              {tl(chapter.description, chapter.descriptionEn, lang)}
            </p>
          </div>
          <div
            className={`shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown className="w-4 h-4 text-white/30" />
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
    <div className="relative min-h-screen bg-[#0c0c0c]">
      <StarField />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 h-14">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/"
                className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[11px] hidden sm:inline tracking-wider uppercase">EDU</span>
              </Link>
              <div className="flex items-center gap-2 min-w-0">
                <Library className="w-3.5 h-3.5 text-white/20 shrink-0" />
                <span className="text-xs font-light text-white/50 tracking-wide truncate">
                  Story Archive
                </span>
              </div>
            </div>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />
            <div className="flex items-center justify-center gap-3 mb-5">
              <Feather className="w-6 h-6 text-white/15" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white/80 mb-5 tracking-wider">
              Story Archive
            </h1>
            <p className="text-sm text-white/25 max-w-lg mx-auto leading-relaxed font-light">
              Eternal Dominion Universe — <br className="sm:hidden" />
              {tl("全五章にわたる物語全集", "A Complete Collection Across Five Chapters", lang)}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex flex-col items-center">
                <span className="text-xl font-extralight text-white/50 tabular-nums">
                  {CHAPTERS.length}
                </span>
                <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] mt-1">
                  {tl("章", "Chapters", lang)}
                </span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex flex-col items-center">
                <span className="text-xl font-extralight text-white/50 tabular-nums">
                  {ALL_STORIES.length}
                </span>
                <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] mt-1">
                  {tl("作品", "Stories", lang)}
                </span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex flex-col items-center">
                <span className="text-xl font-extralight text-white/50 tabular-nums">
                  {uniqueCharacters.size}
                </span>
                <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] mt-1">
                  {tl("キャラ", "Characters", lang)}
                </span>
              </div>
            </div>

            <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent mt-10" />
          </motion.div>

          {/* ─── Chapter Quick Navigation ─── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[9px] text-white/20 uppercase tracking-[0.25em] font-medium">
                {tl("章一覧", "Chapter Index", lang)}
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {chapterData.map(({ chapter, stories }) => {
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => scrollToChapter(chapter.id)}
                    className="text-left p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group"
                  >
                    <span
                      className={`text-3xl font-extralight bg-gradient-to-br ${chapter.color} bg-clip-text text-transparent leading-none block mb-2.5`}
                    >
                      {toRoman(chapter.id)}
                    </span>
                    <p className="text-xs font-light text-white/40 leading-tight mb-1.5">
                      {tl(chapter.titleJa, chapter.titleEn, lang)}
                    </p>
                    <p className="text-[10px] text-white/15 font-light">{chapter.era}</p>
                    <p className="text-[10px] mt-2 text-white/20 tabular-nums">
                      {stories.length} {tl("作品", "stories", lang)}
                    </p>
                  </button>
                )
              })}
            </div>
          </motion.div>

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
      <footer className="relative border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <p className="text-[10px] text-white/15 tracking-[0.15em] uppercase">
            EDU Stories — Eternal Dominion Universe
          </p>
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 text-[10px] text-white/15 hover:text-white/30 transition-colors tracking-wider uppercase"
          >
            <ArrowLeft className="w-2.5 h-2.5" />
            {tl("EDU 百科事典に戻る", "Back to EDU Encyclopedia", lang)}
          </Link>
        </div>
      </footer>
    </div>
  )
}
