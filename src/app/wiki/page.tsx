"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Crown,
  Sparkles,
  X,
  Scroll,
  User,
  ExternalLink,
} from "lucide-react";
import { ALL_ENTRIES } from "@/lib/wiki-data";

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  "キャラクター": {
    label: "キャラクター",
    icon: <Users className="w-3.5 h-3.5" />,
    color: "text-nebula-purple",
    bg: "bg-nebula-purple/15",
    border: "border-nebula-purple/30",
  },
  "用語": {
    label: "用語",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-cosmic-muted",
    bg: "bg-cosmic-surface",
    border: "border-cosmic-border",
  },
  "組織": {
    label: "組織",
    icon: <Crown className="w-3.5 h-3.5" />,
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
  },
  "地理": {
    label: "地理",
    icon: <Star className="w-3.5 h-3.5" />,
    color: "text-electric-blue",
    bg: "bg-electric-blue/15",
    border: "border-electric-blue/30",
  },
  "技術": {
    label: "技術",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: "text-gold-accent",
    bg: "bg-gold-accent/15",
    border: "border-gold-accent/30",
  },
  "歴史": {
    label: "歴史",
    icon: <Scroll className="w-3.5 h-3.5" />,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
  },
};

type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史";
const FILTER_CATEGORIES: ("全て" | Category)[] = [
  "全て",
  "キャラクター",
  "用語",
  "組織",
  "地理",
  "技術",
  "歴史",
];

/* Seeded PRNG */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function StarField() {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: seededRandom(i * 7 + 1)() * 100,
        top: seededRandom(i * 13 + 3)() * 100,
        size: seededRandom(i * 17 + 5)() * 2.5 + 0.5,
        delay: seededRandom(i * 23 + 7)() * 5,
        duration: seededRandom(i * 29 + 11)() * 3 + 2,
        opacity: seededRandom(i * 31 + 13)() * 0.7 + 0.3,
      })),
    []
  );
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
  );
}

export default function WikiPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"全て" | Category>("全て");
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredEntries = useMemo(() => {
    let entries = ALL_ENTRIES;
    if (activeCategory !== "全て") {
      entries = entries.filter((e) => e.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      entries = entries.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.nameEn && e.nameEn.toLowerCase().includes(q)) ||
          e.description.toLowerCase().includes(q) ||
          (e.subCategory && e.subCategory.toLowerCase().includes(q)) ||
          (e.affiliation && e.affiliation.toLowerCase().includes(q)) ||
          (e.era && e.era.toLowerCase().includes(q))
      );
    }
    return entries;
  }, [search, activeCategory]);

  const totalEntries = ALL_ENTRIES.length;
  const charCount = ALL_ENTRIES.filter((e) => e.category === "キャラクター").length;
  const termCount = totalEntries - charCount;

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-14">
            <a
              href="/"
              className="flex items-center gap-2 text-cosmic-muted hover:text-electric-blue transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">EDU</span>
            </a>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-nebula-purple" />
              <span className="text-sm font-bold text-cosmic-gradient">EDU Wiki</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cosmic-gradient mb-3 tracking-wider">
              EDU 百科事典
            </h1>
            <p className="text-sm text-cosmic-muted max-w-xl mx-auto">
              Eternal Dominion Universe — キャラクター・用語・組織・地理の全データ
            </p>
            <div className="flex justify-center gap-4 mt-4 text-xs text-cosmic-muted">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-nebula-purple" />
                キャラクター {charCount}
              </span>
              <span className="text-cosmic-border">|</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-electric-blue" />
                用語・その他 {termCount}
              </span>
              <span className="text-cosmic-border">|</span>
              <span>計 {totalEntries}項目</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="glass-card rounded-xl flex items-center gap-3 px-4 py-3 transition-all duration-200 focus-within:ring-1 focus-within:ring-nebula-purple/50">
              <Search className="w-4 h-4 text-cosmic-muted shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索…（名前、英語名、説明文など）"
                className="flex-1 bg-transparent text-sm text-cosmic-text placeholder:text-cosmic-muted/60 outline-none"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                  className="text-cosmic-muted hover:text-cosmic-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const config = cat !== "全て" ? CATEGORY_CONFIG[cat] : null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    isActive
                      ? cat === "全て"
                        ? "bg-nebula-purple/20 border-nebula-purple/50 text-nebula-purple"
                        : `${config?.bg} ${config?.border} ${config?.color}`
                      : "bg-transparent border-cosmic-border/30 text-cosmic-muted hover:bg-cosmic-surface hover:border-cosmic-border"
                  }`}
                >
                  {cat === "全て" ? <Sparkles className="w-3 h-3" /> : config?.icon}
                  {cat === "全て" ? `全て (${totalEntries})` : `${cat} (${
                    ALL_ENTRIES.filter((e) => e.category === cat).length
                  })`}
                </button>
              );
            })}
          </div>

          {/* Results info */}
          <div className="mb-6 text-xs text-cosmic-muted">
            {search || activeCategory !== "全て" ? (
              <span>
                {filteredEntries.length} 件の結果
                {search && (
                  <span>
                    {" "}
                    — 「<span className="text-electric-blue">{search}</span>」で検索中
                  </span>
                )}
              </span>
            ) : (
              <span>全 {filteredEntries.length} 項目を表示中</span>
            )}
          </div>

          {/* Cards Grid */}
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntries.map((entry) => {
                const catConfig = CATEGORY_CONFIG[entry.category] || CATEGORY_CONFIG["用語"];
                const preview = entry.description.length > 80
                  ? entry.description.slice(0, 80) + "…"
                  : entry.description;
                return (
                  <Link
                    key={entry.id}
                    href={`/wiki/${encodeURIComponent(entry.id)}`}
                    className="glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300 group block"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-nebula-purple/40 bg-cosmic-dark/80 flex items-center justify-center">
                          {entry.image ? (
                            <Image
                              src={entry.image}
                              alt={entry.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-nebula-purple/60" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${catConfig.color} ${catConfig.bg} ${catConfig.border}`}>
                              {catConfig.icon}
                              {entry.subCategory || catConfig.label}
                            </span>
                            {entry.tier && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-accent/15 text-gold-accent border border-gold-accent/30">
                                {entry.tier}
                              </span>
                            )}
                          </div>
                          <h3 className={`text-sm font-bold ${catConfig.color} leading-tight group-hover:text-electric-blue transition-colors`}>
                            {entry.name}
                            {entry.nameEn && (
                              <span className="text-[11px] font-normal text-cosmic-muted ml-1.5">{entry.nameEn}</span>
                            )}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-cosmic-muted leading-relaxed line-clamp-2">{preview}</p>
                      {(entry.era || entry.affiliation) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {entry.era && (
                            <span className="text-[10px] text-electric-blue bg-electric-blue/10 px-1.5 py-0.5 rounded">{entry.era}</span>
                          )}
                          {entry.affiliation && (
                            <span className="text-[10px] text-cosmic-muted bg-cosmic-surface px-1.5 py-0.5 rounded truncate max-w-[180px]">{entry.affiliation}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-cosmic-border mx-auto mb-4" />
              <p className="text-cosmic-muted text-sm">該当する項目が見つかりません</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("全て"); }}
                className="mt-4 text-xs text-electric-blue hover:underline"
              >
                フィルターをリセット
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent" />
          <p className="text-xs text-cosmic-muted">
            EDU 百科事典 — Eternal Dominion Universe 統合時空構造書 v3.0
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-electric-blue hover:underline transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            メインページに戻る
          </a>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(10, 10, 26, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(42, 42, 94, 0.6); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(124, 58, 237, 0.5); }
      `}</style>
    </div>
  );
}
