"use client"

import Link from "next/link"
import { BookOpen, ChevronRight } from "lucide-react"
import { getStoriesForEntry, getStoryBySlug, getStoryTitle } from "@/lib/stories"
import { type Lang, tl } from "@/lib/lang"

export function RelatedStoriesSection({
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
