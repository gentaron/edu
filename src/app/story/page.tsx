"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Clock, Users } from "lucide-react";
import { ALL_STORIES } from "@/lib/stories";

/* ─── Era Sort Helper ─── */
function eraSortValue(era?: string): number {
  if (!era) return Infinity;
  const match = era.match(/E(\d+)/);
  if (!match) return Infinity;
  return parseInt(match[1], 10);
}

function groupByEra(stories: typeof ALL_STORIES) {
  const sorted = [...stories].sort((a, b) => eraSortValue(a.era) - eraSortValue(b.era));
  const groups: { era: string; stories: typeof ALL_STORIES }[] = [];
  let current: typeof ALL_STORIES = [];
  let currentEra = "";

  for (const s of sorted) {
    const era = s.era || "時代不明";
    if (era !== currentEra) {
      if (current.length > 0) {
        groups.push({ era: currentEra, stories: current });
      }
      currentEra = era;
      current = [s];
    } else {
      current.push(s);
    }
  }
  if (current.length > 0) {
    groups.push({ era: currentEra, stories: current });
  }
  return groups;
}

/* ─── Wiki name to image mapping ─── */
const entryImageMap: Record<string, string> = {
  "アイリス": "/edu-iris.png",
  "Diana": "/edu-diana.png",
  "Kate Claudia": "/edu-kate-claudia.png",
  "Lily Steiner": "/edu-lillie-steiner.png",
  "レイラ・ヴィレル・ノヴァ": "/edu-fiona.png",
  "カステリア・グレンヴェルト": "/edu-diana.png",
  "シトラ・セレス": "/edu-iris.png",
  "ミュー": "/edu-diana.png",
  "Jen": "/edu-iris.png",
  "Tina/Gue": "/edu-diana.png",
  "アルファ・ケイン": "/edu-hero.png",
  "セリア・ドミニクス": "/edu-celia.png",
  "弦太郎": "/edu-auralis.png",
  "Slime_Woman": "/edu-diana.png",
  "ジュン": "/edu-hero.png",
  "Kate Patton": "/edu-kate-claudia.png",
  "Lillie Ardent": "/edu-lillie-steiner.png",
  "ミナ・エウレカ・エルンスト": "/edu-diana.png",
  "Ninny Offenbach": "/edu-fiona.png",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StoryArchivePage() {
  const groups = groupByEra(ALL_STORIES);

  return (
    <div className="min-h-screen bg-cosmic-dark">
      {/* Header */}
      <div className="glass-card border-b border-cosmic-border/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-cosmic-muted hover:text-cosmic-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline" /> ホーム
          </Link>
          <span className="text-cosmic-border">|</span>
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h1 className="text-sm font-bold text-cosmic-gradient">
            EDU Story Archive
          </h1>
        </div>
      </div>

      {/* Title Section */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-cosmic-gradient mb-3">
            EDU Story Archive
          </h2>
          <p className="text-sm text-cosmic-muted max-w-lg mx-auto">
            Eternal Dominion Universe — 物語全集
          </p>
          <p className="text-xs text-cosmic-muted mt-2">
            {ALL_STORIES.length} 作品を収録
          </p>
        </motion.div>
      </div>

      {/* Story Groups */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        {groups.map((group, gi) => (
          <motion.div
            key={group.era}
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-10"
          >
            {/* Era Header */}
            <motion.div variants={item} className="mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-nebula-purple" />
              <h3 className="text-xs font-bold text-nebula-purple uppercase tracking-widest">
                {group.era}
              </h3>
              <div className="flex-1 h-px bg-nebula-purple/20" />
              <span className="text-[10px] text-cosmic-muted">
                {group.stories.length}作品
              </span>
            </motion.div>

            {/* Story Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.stories.map((story) => (
                <motion.div key={story.slug} variants={item}>
                  <Link
                    href={`/story/${story.slug}`}
                    className="block group glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="p-5">
                      {/* Title & Label */}
                      <div className="mb-3">
                        <h4 className="text-sm font-bold text-cosmic-text group-hover:text-electric-blue transition-colors mb-1">
                          {story.title}
                        </h4>
                        {story.label !== story.title && (
                          <p className="text-[10px] text-cosmic-muted">
                            {story.label}
                          </p>
                        )}
                      </div>

                      {/* Era Badge */}
                      {story.era && (
                        <div className="mb-3">
                          <span className="inline-flex items-center gap-1 text-[10px] text-nebula-purple bg-nebula-purple/10 border border-nebula-purple/20 rounded px-2 py-0.5">
                            <Clock className="w-3 h-3" />
                            {story.era}
                          </span>
                        </div>
                      )}

                      {/* Related Character Badges */}
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

                      {/* Read Button */}
                      <div className="flex items-center justify-end">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-electric-blue group-hover:gap-2 transition-all">
                          読む
                          <span className="text-electric-blue">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
