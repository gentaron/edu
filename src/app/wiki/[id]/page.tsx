"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Scroll, BookOpen } from "lucide-react";
import { ALL_ENTRIES } from "@/lib/wiki-data";
import { getStoriesForEntry } from "@/lib/stories";
import WikiDescription from "./_components/wiki-description";

const CATEGORY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  "キャラクター": { color: "text-nebula-purple", bg: "bg-nebula-purple/15", border: "border-nebula-purple/30" },
  "用語": { color: "text-cosmic-muted", bg: "bg-cosmic-surface", border: "border-cosmic-border" },
  "組織": { color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" },
  "地理": { color: "text-electric-blue", bg: "bg-electric-blue/15", border: "border-electric-blue/30" },
  "技術": { color: "text-gold-accent", bg: "bg-gold-accent/15", border: "border-gold-accent/30" },
  "歴史": { color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30" },
};

export default function WikiEntryPage() {
  const params = useParams<{ id: string }>();
  const decodedId = decodeURIComponent(params.id || "");
  const entry = ALL_ENTRIES.find((e) => e.id === decodedId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!entry) {
    return (
      <div className="relative min-h-screen bg-cosmic-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cosmic-text mb-4">エントリが見つかりません</h1>
          <Link href="/wiki" className="text-sm text-electric-blue hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Wikiに戻る
          </Link>
        </div>
      </div>
    );
  }

  const catStyle = CATEGORY_STYLES[entry.category] || CATEGORY_STYLES["用語"];

  // Find prev/next entries
  const currentIndex = ALL_ENTRIES.findIndex((e) => e.id === decodedId);
  const prevEntry = currentIndex > 0 ? ALL_ENTRIES[currentIndex - 1] : null;
  const nextEntry = currentIndex < ALL_ENTRIES.length - 1 ? ALL_ENTRIES[currentIndex + 1] : null;

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-14">
            <Link
              href="/wiki"
              className="flex items-center gap-2 text-cosmic-muted hover:text-electric-blue transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Wiki</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-cosmic-gradient">EDU Wiki</span>
            </div>
            <span className="text-xs text-cosmic-muted ml-auto">
              {currentIndex + 1} / {ALL_ENTRIES.length}
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Portrait */}
          {entry.image && (
            <div className="flex justify-center mb-8">
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-nebula-purple/40 shadow-xl shadow-nebula-purple/15">
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
          <div className="text-center mb-8">
            {/* Category badge */}
            <div className="flex justify-center gap-2 mb-4">
              <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${catStyle.color} ${catStyle.bg} ${catStyle.border}`}>
                {entry.subCategory || entry.category}
              </span>
              {entry.tier && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold-accent/15 text-gold-accent border border-gold-accent/30 font-medium">
                  {entry.tier}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-cosmic-text mb-2">
              {entry.name}
            </h1>
            {entry.nameEn && (
              <p className="text-base text-cosmic-muted">{entry.nameEn}</p>
            )}
          </div>

          {/* Meta info cards */}
          {(entry.era || entry.affiliation) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {entry.era && (
                <div className="glass-card rounded-xl p-4">
                  <p className="text-[10px] text-cosmic-muted mb-1 uppercase tracking-wider font-bold">時代</p>
                  <p className="text-sm text-electric-blue font-medium">{entry.era}</p>
                </div>
              )}
              {entry.affiliation && (
                <div className="glass-card rounded-xl p-4">
                  <p className="text-[10px] text-cosmic-muted mb-1 uppercase tracking-wider font-bold">所属</p>
                  <p className="text-sm text-cosmic-text font-medium">{entry.affiliation}</p>
                </div>
              )}
              {entry.tier && (
                <div className="glass-card rounded-xl p-4">
                  <p className="text-[10px] text-cosmic-muted mb-1 uppercase tracking-wider font-bold">Tier</p>
                  <p className="text-sm text-gold-accent font-medium">{entry.tier}</p>
                </div>
              )}
              {entry.category && (
                <div className="glass-card rounded-xl p-4">
                  <p className="text-[10px] text-cosmic-muted mb-1 uppercase tracking-wider font-bold">カテゴリ</p>
                  <p className={`text-sm font-medium ${catStyle.color}`}>{entry.category}</p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="glass-card rounded-xl p-6 sm:p-8 mb-8">
            <h2 className="text-sm font-bold text-cosmic-muted mb-4 uppercase tracking-wider flex items-center gap-2">
              <Scroll className="w-4 h-4 text-nebula-purple" />
              概要
            </h2>
            <WikiDescription description={entry.description} />
          </div>

          {/* Story links */}
          {(() => {
            const stories = getStoriesForEntry(entry.id);
            if (stories.length === 0) return null;
            return (
              <div className="glass-card rounded-xl p-6 sm:p-8 mb-8">
                <h2 className="text-sm font-bold text-cosmic-muted mb-4 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-nebula-purple" />
                  関連作品
                </h2>
                <div className="space-y-2">
                  {stories.map((story) => (
                    <Link
                      key={story.slug}
                      href={`/story/${story.slug}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-nebula-purple/15 bg-nebula-purple/5 text-sm text-nebula-purple/90 hover:bg-nebula-purple/10 hover:border-nebula-purple/30 transition-all duration-200"
                    >
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span className="truncate">{story.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Navigation between entries */}
          <div className="flex justify-between items-center gap-4">
            {prevEntry ? (
              <Link
                href={`/wiki/${encodeURIComponent(prevEntry.id)}`}
                className="glass-card glass-card-hover rounded-xl px-4 py-3 text-xs text-cosmic-muted hover:text-electric-blue transition-colors flex items-center gap-2"
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
                className="glass-card glass-card-hover rounded-xl px-4 py-3 text-xs text-cosmic-muted hover:text-electric-blue transition-colors flex items-center gap-2"
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
      <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent" />
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 text-xs text-electric-blue hover:underline transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            EDU 百科事典に戻る
          </Link>
        </div>
      </footer>
    </div>
  );
}
