"use client"

import React from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Scroll, BookOpen, Star } from "lucide-react"
import { ALL_ENTRIES } from "@/lib/wiki-data"
import { getStoriesForEntry } from "@/lib/stories"
import WikiDescription from "./_components/wiki-description"

export default function WikiEntryPage() {
  const params = useParams<{ id: string }>()
  const decodedId = decodeURIComponent(params.id || "")
  const entry = ALL_ENTRIES.find((e) => e.id === decodedId)

  if (!entry) {
    return (
      <div className="relative min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white/80 mb-4">エントリが見つかりません</h1>
          <Link
            href="/wiki"
            className="text-sm text-white/40 hover:text-white/60 hover:underline inline-flex items-center gap-1 transition-colors font-light"
          >
            <ArrowLeft className="w-4 h-4" /> Wikiに戻る
          </Link>
        </div>
      </div>
    )
  }

  // Find prev/next entries
  const currentIndex = ALL_ENTRIES.findIndex((e) => e.id === decodedId)
  const prevEntry = currentIndex > 0 ? ALL_ENTRIES[currentIndex - 1] : null
  const nextEntry = currentIndex < ALL_ENTRIES.length - 1 ? ALL_ENTRIES[currentIndex + 1] : null

  return (
    <div className="relative min-h-screen bg-[#0d0d1a]">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d1a]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-14">
            <Link
              href="/wiki"
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs hidden sm:inline tracking-wider uppercase font-light">
                Wiki
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-white/20" />
              <span className="text-sm font-light text-white/50 tracking-wide">EDU Wiki</span>
            </div>
            <span className="text-xs text-white/20 ml-auto font-light tracking-wide">
              {currentIndex + 1} / {ALL_ENTRIES.length}
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Portrait */}
          {entry.image && (
            <div className="flex justify-center mb-10">
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/30">
                <Image
                  src={entry.image}
                  alt={entry.name}
                  width={208}
                  height={208}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div className="text-center mb-10">
            {/* Category badge */}
            <div className="flex justify-center gap-2 mb-5">
              <span className="inline-flex items-center text-[10px] font-light px-3 py-1 rounded-full border bg-white/[0.03] text-white/35 border-white/[0.06] tracking-wider uppercase">
                {entry.subCategory || entry.category}
              </span>
              {entry.tier && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] text-white/25 border border-white/[0.05] font-light">
                  {entry.tier}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extralight text-white/90 mb-2 tracking-wide">
              {entry.name}
            </h1>
            {entry.nameEn && (
              <p className="text-base text-white/30 font-light tracking-wide">{entry.nameEn}</p>
            )}
          </div>

          {/* Meta info cards */}
          {(entry.era || entry.affiliation) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {entry.era && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[10px] text-white/25 mb-1.5 uppercase tracking-widest font-light">
                    時代
                  </p>
                  <p className="text-sm text-white/65 font-light">{entry.era}</p>
                </div>
              )}
              {entry.affiliation && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[10px] text-white/25 mb-1.5 uppercase tracking-widest font-light">
                    所属
                  </p>
                  <p className="text-sm text-white/65 font-light">{entry.affiliation}</p>
                </div>
              )}
              {entry.tier && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[10px] text-white/25 mb-1.5 uppercase tracking-widest font-light">
                    Tier
                  </p>
                  <p className="text-sm text-white/65 font-light">{entry.tier}</p>
                </div>
              )}
              {entry.category && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[10px] text-white/25 mb-1.5 uppercase tracking-widest font-light">
                    カテゴリ
                  </p>
                  <p className="text-sm text-white/65 font-light">{entry.category}</p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 sm:p-8 mb-8">
            <h2 className="text-[11px] font-light text-white/25 mb-5 uppercase tracking-widest flex items-center gap-2">
              <Scroll className="w-3.5 h-3.5 text-white/15" />
              概要
            </h2>
            <WikiDescription description={entry.description} entryId={entry.id} />
          </div>

          {/* Story links */}
          {(() => {
            const stories = getStoriesForEntry(entry.id)
            if (stories.length === 0) return null
            return (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 sm:p-8 mb-8">
                <h2 className="text-[11px] font-light text-white/25 mb-5 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-white/15" />
                  関連作品
                </h2>
                <div className="space-y-2">
                  {stories.map((story) => (
                    <Link
                      key={story.slug}
                      href={`/story/${story.slug}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.01] text-sm text-white/45 hover:text-white/65 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 font-light"
                    >
                      <BookOpen className="w-4 h-4 shrink-0 text-white/20" />
                      <span className="truncate">{story.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Navigation between entries */}
          <div className="flex justify-between items-center gap-4 mt-10">
            {prevEntry ? (
              <Link
                href={`/wiki/${encodeURIComponent(prevEntry.id)}`}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white/30 hover:text-white/55 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 flex items-center gap-2 font-light"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{prevEntry.name}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextEntry ? (
              <Link
                href={`/wiki/${encodeURIComponent(nextEntry.id)}`}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white/30 hover:text-white/55 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 flex items-center gap-2 font-light"
              >
                <span className="truncate max-w-[120px]">{nextEntry.name}</span>
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.05] py-8 px-4 mt-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 text-xs text-white/20 hover:text-white/35 transition-colors font-light"
          >
            <ArrowLeft className="w-3 h-3" />
            EDU 百科事典に戻る
          </Link>
        </div>
      </footer>
    </div>
  )
}
