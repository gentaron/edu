"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Clock, Users, ChevronDown, Library } from "lucide-react"
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

/* ─── Chapter color configs ─── */
const CHAPTER_COLORS: Record<
  number,
  { border: string; bg: string; text: string; glow: string; badge: string }
> = {
  1: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  2: {
    border: "border-nebula-purple/30",
    bg: "bg-nebula-purple/10",
    text: "text-violet-400",
    glow: "shadow-nebula-purple/20",
    badge: "bg-nebula-purple/15 text-violet-400 border-nebula-purple/30",
  },
  3: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-400",
    glow: "shadow-red-500/20",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  4: {
    border: "border-electric-blue/30",
    bg: "bg-electric-blue/10",
    text: "text-sky-400",
    glow: "shadow-electric-blue/20",
    badge: "bg-electric-blue/15 text-sky-400 border-electric-blue/30",
  },
  5: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
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
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: seededRandom(i * 7 + 1)() * 100,
        top: seededRandom(i * 13 + 3)() * 100,
        size: seededRandom(i * 17 + 5)() * 2 + 0.5,
        delay: seededRandom(i * 23 + 7)() * 5,
        duration: seededRandom(i * 29 + 11)() * 3 + 2,
        opacity: seededRandom(i * 31 + 13)() * 0.5 + 0.2,
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
  const colors = CHAPTER_COLORS[chapter.id]
  return (
    <Link
      href={`/story/${story.slug}`}
      className="block group relative glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Top accent line */}
      <div
        className={`h-0.5 bg-gradient-to-r ${chapter.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="p-5">
        {/* Number + Title */}
        <div className="flex items-start gap-3 mb-3">
          <span
            className={`shrink-0 w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center text-[10px] font-bold ${colors.text} border ${colors.border}`}
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-cosmic-text group-hover:text-electric-blue transition-colors mb-0.5 leading-snug">
              {getStoryTitle(story, lang)}
            </h4>
            {story.label !== story.title && (
              <p className="text-[10px] text-cosmic-muted truncate">{story.label}</p>
            )}
          </div>
        </div>

        {/* Era */}
        {story.era && (
          <div className="mb-3">
            <span
              className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${colors.badge}`}
            >
              <Clock className="w-3 h-3" />
              {story.era}
            </span>
          </div>
        )}

        {/* Characters */}
        {story.relatedEntries.length > 0 && (
          <div className="mb-4 flex items-center gap-1.5 flex-wrap">
            <Users className="w-3 h-3 text-cosmic-muted shrink-0" />
            {story.relatedEntries.map((entry) => (
              <Link
                key={entry}
                href={`/wiki#${entry}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] text-cosmic-muted bg-cosmic-surface/50 border border-cosmic-border/30 rounded-full px-2 py-0.5 hover:text-electric-blue hover:border-electric-blue/30 transition-colors"
              >
                {entryImageMap[entry] && (
                  <Image
                    src={entryImageMap[entry]}
                    alt={entry}
                    width={14}
                    height={14}
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
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${colors.text} group-hover:gap-2 transition-all`}
          >
            {tl("読む", "Read", lang)}
            <span>→</span>
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
  const colors = CHAPTER_COLORS[chapter.id]

  return (
    <section ref={sectionRef} id={`chapter-${chapter.id}`} className="mb-14 scroll-mt-20">
      {/* Chapter Header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`w-full text-left glass-card rounded-2xl p-6 sm:p-8 mb-6 transition-all duration-300 hover:shadow-lg ${colors.glow} group cursor-pointer border ${colors.border}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`text-4xl sm:text-5xl font-black bg-gradient-to-br ${chapter.color} bg-clip-text text-transparent leading-none`}
              >
                {toRoman(chapter.id)}
              </span>
              <div>
                <h2 className={`text-lg sm:text-xl font-bold ${colors.text}`}>
                  {tl(chapter.titleJa, chapter.titleEn, lang)}
                </h2>
                <p className="text-xs text-cosmic-muted tracking-widest uppercase">
                  {tl(chapter.titleEn, chapter.titleJa, lang)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 mb-3">
              <Clock className="w-3.5 h-3.5 text-cosmic-muted" />
              <span
                className={`inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${colors.badge}`}
              >
                {chapter.era}
              </span>
              <span className="text-[11px] text-cosmic-muted">
                {stories.length} {tl("作品", "stories", lang)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cosmic-muted/80 leading-relaxed max-w-2xl">
              {tl(chapter.description, chapter.descriptionEn, lang)}
            </p>
          </div>
          <div
            className={`shrink-0 w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown className={`w-4 h-4 ${colors.text}`} />
          </div>
        </div>
      </button>

      {/* Story Cards Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-0 sm:pl-2 transition-all duration-300 ${
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
  const [lang, setLangState] = useState<Lang>("ja")

  useEffect(() => {
    const saved = localStorage.getItem("edu-lang") as Lang | null
    if (saved === "en" || saved === "ja") setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem("edu-lang", l)
  }

  /* Refs for chapter scroll-jump */
  const chapterRefs = useRef<Record<number, React.RefObject<HTMLElement | null>>>({})
  for (const { chapter } of chapterData) {
    if (!chapterRefs.current[chapter.id]) {
      chapterRefs.current[chapter.id] = React.createRef<HTMLElement>()
    }
  }

  function scrollToChapter(id: number) {
    chapterRefs.current[id]?.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 h-14">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/"
                className="flex items-center gap-2 text-cosmic-muted hover:text-electric-blue transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">EDU</span>
              </Link>
              <div className="flex items-center gap-2 min-w-0">
                <Library className="w-4 h-4 text-nebula-purple shrink-0" />
                <span className="text-sm font-bold text-cosmic-gradient truncate">
                  EDU Story Archive
                </span>
              </div>
            </div>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent mb-8" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-nebula-purple" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cosmic-gradient mb-4 tracking-wider">
              Story Archive
            </h1>
            <p className="text-sm sm:text-base text-cosmic-muted max-w-xl mx-auto leading-relaxed">
              Eternal Dominion Universe —{" "}
              <br className="sm:hidden" />
              {tl("全五章にわたる物語全集", "A Complete Collection Across Five Chapters", lang)}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-cosmic-text">{CHAPTERS.length}</span>
                <span className="text-[10px] text-cosmic-muted uppercase tracking-wider">
                  {tl("章", "Chapters", lang)}
                </span>
              </div>
              <div className="w-px h-10 bg-cosmic-border/50" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-cosmic-text">{ALL_STORIES.length}</span>
                <span className="text-[10px] text-cosmic-muted uppercase tracking-wider">
                  {tl("作品", "Stories", lang)}
                </span>
              </div>
              <div className="w-px h-10 bg-cosmic-border/50" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-cosmic-text">
                  {uniqueCharacters.size}
                </span>
                <span className="text-[10px] text-cosmic-muted uppercase tracking-wider">
                  {tl("キャラ", "Characters", lang)}
                </span>
              </div>
            </div>

            <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent mt-8" />
          </motion.div>

          {/* ─── Chapter Quick Navigation ─── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-cosmic-border/30" />
              <span className="text-[10px] text-cosmic-muted uppercase tracking-widest font-medium">
                {tl("章一覧", "Chapter Index", lang)}
              </span>
              <div className="h-px flex-1 bg-cosmic-border/30" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {chapterData.map(({ chapter, stories }) => {
                const colors = CHAPTER_COLORS[chapter.id]
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => scrollToChapter(chapter.id)}
                    className={`text-left p-4 rounded-xl border glass-card hover:scale-[1.03] hover:shadow-lg transition-all duration-200 group ${colors.border} ${colors.glow}`}
                  >
                    <span
                      className={`text-3xl font-black bg-gradient-to-br ${chapter.color} bg-clip-text text-transparent leading-none block mb-2`}
                    >
                      {toRoman(chapter.id)}
                    </span>
                    <p className={`text-xs font-bold ${colors.text} leading-tight mb-1`}>
                      {tl(chapter.titleJa, chapter.titleEn, lang)}
                    </p>
                    <p className="text-[10px] text-cosmic-muted">
                      {chapter.era}
                    </p>
                    <p className={`text-[10px] mt-1.5 ${colors.text} opacity-70`}>
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
              sectionRef={chapterRefs.current[data.chapter.id]}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-2">
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent" />
          <p className="text-xs text-cosmic-muted">EDU Stories — Eternal Dominion Universe</p>
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 text-xs text-electric-blue hover:underline transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            {tl("EDU 百科事典に戻る", "Back to EDU Encyclopedia", lang)}
          </Link>
        </div>
      </footer>
    </div>
  )
}
