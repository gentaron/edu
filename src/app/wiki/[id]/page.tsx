"use client"

import React from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Scroll, BookOpen, Crown } from "lucide-react"
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data"
import { getStoriesForEntry } from "@/domains/stories/stories.meta"
import WikiDescription from "./_components/wiki-description"
import { RevealSection } from "@/platform/reveal-section"
import { PageHeader } from "@/platform/page-header"

export default function WikiEntryPage() {
  const params = useParams<{ id: string }>()
  const decodedId = decodeURIComponent(params.id || "")
  const entry = ALL_ENTRIES.find((e) => e.id === decodedId)

  if (!entry) {
    return (
      <div className="min-h-screen bg-edu-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-edu-text/80 mb-4">エントリが見つかりません</h1>
          <Link
            href="/wiki"
            className="text-sm text-edu-muted hover:text-edu-accent hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Wikiに戻る
          </Link>
        </div>
      </div>
    )
  }

  const currentIndex = ALL_ENTRIES.findIndex((e) => e.id === decodedId)
  const prevEntry = currentIndex > 0 ? ALL_ENTRIES[currentIndex - 1] : null
  const nextEntry = currentIndex < ALL_ENTRIES.length - 1 ? ALL_ENTRIES[currentIndex + 1] : null

  const relatedEntries = ALL_ENTRIES.filter(
    (e) => e.category === entry.category && e.id !== entry.id
  ).slice(0, 4)

  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<BookOpen className="w-5 h-5" />}
        title={entry.name}
        subtitle={entry.nameEn}
        wikiHref="/wiki"
      />

      <main className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Portrait */}
          {entry.image && (
            <RevealSection className="flex justify-center mb-10">
              <div className="wiki-portrait w-48 h-48 sm:w-64 sm:h-64 border border-edu-border">
                <Image
                  src={entry.image}
                  alt={entry.name}
                  width={256}
                  height={256}
                  sizes="(max-width: 768px) 80vw, 400px"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </RevealSection>
          )}

          {/* Category badges */}
          <RevealSection className="text-center mb-10" delay={100}>
            <div className="flex justify-center gap-2 mb-5">
              <span className="wiki-badge">{entry.subCategory || entry.category}</span>
              {entry.tier && <span className="wiki-badge">{entry.tier}</span>}
              {entry.era && <span className="wiki-badge">{entry.era}</span>}
              {entry.category && <span className="wiki-badge">{entry.category}</span>}
            </div>
          </RevealSection>

          {/* Meta info */}
          {(entry.era || entry.affiliation) && (
            <RevealSection delay={200}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {entry.era && (
                  <div className="edu-card p-4">
                    <p className="text-[10px] text-edu-muted mb-1.5 uppercase tracking-widest">
                      時代
                    </p>
                    <p className="text-sm text-edu-text">{entry.era}</p>
                  </div>
                )}
                {entry.affiliation && (
                  <div className="edu-card p-4">
                    <p className="text-[10px] text-edu-muted mb-1.5 uppercase tracking-widest">
                      所属
                    </p>
                    <p className="text-sm text-edu-text">{entry.affiliation}</p>
                  </div>
                )}
              </div>
            </RevealSection>
          )}

          {/* Leaders */}
          {entry.leaders && entry.leaders.length > 0 && (
            <RevealSection delay={250}>
              <div className="edu-card p-6 sm:p-8 mb-8">
                <h2 className="text-[11px] text-edu-muted mb-5 uppercase tracking-widest flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-edu-accent/60" />
                  歴代指導者
                </h2>
                <div className="space-y-2">
                  {entry.leaders.map((leader) => {
                    const leaderEntry = ALL_ENTRIES.find((e) => e.id === leader.id)
                    return (
                      <Link
                        key={leader.id}
                        href={`/wiki/${encodeURIComponent(leader.id)}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-edu-border bg-edu-surface/50 hover:bg-edu-surface hover:border-edu-border-bright transition-all duration-300 group"
                      >
                        <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden border border-edu-border bg-edu-bg flex items-center justify-center">
                          {leaderEntry?.image ? (
                            <Image
                              src={leaderEntry.image}
                              alt={leader.name}
                              width={36}
                              height={36}
                              sizes="36px"
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-edu-muted" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-edu-text group-hover:text-edu-accent transition-colors truncate">
                            {leader.name}
                          </p>
                          <p className="text-[10px] text-edu-muted truncate">
                            {leader.role}
                            {leader.era ? ` (${leader.era})` : ""}
                          </p>
                        </div>
                        {leaderEntry && (
                          <span className="shrink-0 text-[9px] text-edu-muted">
                            {leaderEntry.category === "キャラクター"
                              ? leaderEntry.tier || ""
                              : leaderEntry.category}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </RevealSection>
          )}

          {/* Description */}
          <RevealSection delay={300}>
            <div className="edu-card p-6 sm:p-8 mb-8">
              <h2 className="text-[11px] text-edu-muted mb-5 uppercase tracking-widest flex items-center gap-2">
                <Scroll className="w-3.5 h-3.5 text-edu-accent/60" />
                概要
              </h2>
              <div className="wiki-body">
                <WikiDescription description={entry.description} entryId={entry.id} />
              </div>
            </div>
          </RevealSection>

          {/* Story links */}
          {(() => {
            const stories = getStoriesForEntry(entry.id)
            if (stories.length === 0) return null
            return (
              <RevealSection delay={350}>
                <div className="edu-card p-6 sm:p-8 mb-8">
                  <h2 className="text-[11px] text-edu-muted mb-5 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-edu-accent/60" />
                    関連作品
                  </h2>
                  <div className="space-y-2">
                    {stories.map((story) => (
                      <Link
                        key={story.slug}
                        href={`/story/${story.slug}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-edu-border bg-edu-surface/50 text-sm text-edu-text-dim hover:text-edu-text hover:bg-edu-surface hover:border-edu-border-bright transition-all duration-300"
                      >
                        <BookOpen className="w-4 h-4 shrink-0 text-edu-muted" />
                        <span className="truncate">{story.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </RevealSection>
            )
          })()}

          {/* Related entries */}
          {relatedEntries.length > 0 && (
            <RevealSection delay={400}>
              <div className="mb-8">
                <h2 className="text-[11px] text-edu-muted mb-4 uppercase tracking-widest">
                  関連エントリ
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedEntries.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/wiki/${encodeURIComponent(rel.id)}`}
                      className="edu-card p-3 text-center group"
                    >
                      <div className="w-10 h-10 rounded-full mx-auto mb-2 overflow-hidden border border-edu-border bg-edu-surface flex items-center justify-center">
                        {rel.image ? (
                          <Image
                            src={rel.image}
                            alt={rel.name}
                            width={40}
                            height={40}
                            sizes="40px"
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5 text-edu-muted" />
                        )}
                      </div>
                      <p className="text-xs text-edu-text group-hover:text-edu-accent transition-colors truncate">
                        {rel.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}

          {/* Prev/Next navigation */}
          <div className="flex justify-between py-8 border-t border-edu-border">
            {prevEntry ? (
              <Link
                href={`/wiki/${encodeURIComponent(prevEntry.id)}`}
                className="text-xs text-edu-muted hover:text-edu-accent transition-colors"
              >
                ← {prevEntry.name}
              </Link>
            ) : (
              <span />
            )}
            {nextEntry ? (
              <Link
                href={`/wiki/${encodeURIComponent(nextEntry.id)}`}
                className="text-xs text-edu-muted hover:text-edu-accent transition-colors"
              >
                {nextEntry.name} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-edu-border py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 text-xs text-edu-muted hover:text-edu-accent transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            EDU 百科事典に戻る
          </Link>
        </div>
      </footer>
    </div>
  )
}
