import React from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
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
import {
  ALL_STORIES,
  CHAPTERS,
  getStoryBySlug,
  getStoryUrl,
  getStoriesForEntry,
  getStoriesByChapter,
  getAdjacentStories,
} from "@/lib/stories"
import { ALL_ENTRIES } from "@/lib/wiki-data"

export function generateStaticParams() {
  return ALL_STORIES.map((s) => ({ slug: s.slug }))
}

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

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
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

function StarField() {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
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

function ReadingProgressBar() {
  return (
    <div
      id="reading-progress"
      className="fixed top-[56px] left-0 right-0 z-50 h-0.5 bg-cosmic-border/30"
    >
      <div
        id="reading-progress-bar"
        className="h-full bg-gradient-to-r from-nebula-purple via-electric-blue to-nebula-purple w-0 transition-[width] duration-100"
      />
    </div>
  )
}

function RelatedStoriesSection({
  currentSlug,
  entryIds,
}: {
  currentSlug: string
  entryIds: string[]
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
        関連作品
      </h3>
      <div className="flex flex-col gap-2">
        {stories.map((s) =>
          s ? (
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
          ) : null
        )}
      </div>
    </div>
  )
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) notFound()

  let text = ""
  try {
    const res = await fetch(getStoryUrl(story.fileName), {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
    text = await res.text()
  } catch {
    text = "この作品は現在読み込みできません。後ほど再度お試しください。"
  }

  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0)
  const relatedEntries = ALL_ENTRIES.filter((e) => story.relatedEntries.includes(e.id))

  const chapter = CHAPTERS.find((ch) => ch.id === story.chapter)
  const chapterStories = getStoriesByChapter(story.chapter)
  const { prev, next } = getAdjacentStories(story)
  const storyIndex = chapterStories.findIndex((s) => s.slug === story.slug)

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <ReadingProgressBar />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 min-w-0">
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
                <span className="text-xs text-cosmic-muted truncate">{chapter?.titleJa}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
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
                <Library className="w-3 h-3" />第{toRoman(chapter.id)}章 {chapter.titleJa}
              </Link>
              <span className="text-[10px] text-cosmic-muted">
                {storyIndex + 1} / {chapterStories.length}
              </span>
            </div>
          )}

          {/* Story Header */}
          <header className="mb-12">
            {/* Chapter gradient accent */}
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

            {/* Related Characters — Fancy chips */}
            <div className="flex flex-wrap gap-2">
              {relatedEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/wiki/${encodeURIComponent(entry.id)}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-nebula-purple/20 bg-nebula-purple/5 text-nebula-purple/80 hover:bg-nebula-purple/15 hover:border-nebula-purple/40 transition-all duration-200 group"
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
            {paragraphs.map((p, i) => (
              <div key={i} className="mb-6">
                {/* Scene break indicator */}
                {p.trim().startsWith("─") ||
                p.trim().startsWith("==") ||
                p.trim().startsWith("**") ||
                p.trim().startsWith("##") ? (
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
            ))}
          </article>

          {/* Story footer */}
          <div className="mt-12 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-border/40 to-transparent" />
            <BookOpen className="w-3 h-3 text-cosmic-border/50" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-border/40 to-transparent" />
          </div>

          {/* Related Stories */}
          <RelatedStoriesSection currentSlug={slug} entryIds={story.relatedEntries} />

          {/* Chapter Navigation — Prev/Next within chapter */}
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
                      前の作品
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
                      次の作品
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

          {/* Back to archive */}
          <div className="mt-10 text-center">
            <Link
              href="/story"
              className="inline-flex items-center gap-2 text-xs text-electric-blue hover:underline transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Story Archive に戻る
            </Link>
            {relatedEntries.length > 0 && (
              <>
                <span className="text-cosmic-border mx-3">|</span>
                <Link
                  href={`/wiki/${encodeURIComponent(relatedEntries[0].id)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-cosmic-muted hover:text-electric-blue hover:underline transition-colors"
                >
                  「{relatedEntries[0].name}」のWiki
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
            Story Archive に戻る
          </Link>
        </div>
      </footer>

      {/* Reading progress script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var bar = document.getElementById('reading-progress-bar');
              if (!bar) return;
              function update() {
                var scrollTop = window.scrollY || document.documentElement.scrollTop;
                var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width = progress + '%';
              }
              window.addEventListener('scroll', update, { passive: true });
              update();
            })();
          `,
        }}
      />
    </div>
  )
}
