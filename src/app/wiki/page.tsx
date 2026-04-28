"use client"

import React, { useState, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"
import { ALL_ENTRIES } from "@/lib/wiki-data"

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  キャラクター: {
    label: "キャラクター",
    icon: <Users className="w-3.5 h-3.5" />,
  },
  用語: {
    label: "用語",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  組織: {
    label: "組織",
    icon: <Crown className="w-3.5 h-3.5" />,
  },
  地理: {
    label: "地理",
    icon: <Star className="w-3.5 h-3.5" />,
  },
  技術: {
    label: "技術",
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  歴史: {
    label: "歴史",
    icon: <Scroll className="w-3.5 h-3.5" />,
  },
}

type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史"
const FILTER_CATEGORIES: ("全て" | Category)[] = [
  "全て",
  "キャラクター",
  "用語",
  "組織",
  "地理",
  "技術",
  "歴史",
]

/* Seeded PRNG */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function StarField() {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: seededRandom(i * 7 + 1)() * 100,
        top: seededRandom(i * 13 + 3)() * 100,
        size: seededRandom(i * 17 + 5)() * 1.5 + 0.5,
        delay: seededRandom(i * 23 + 7)() * 5,
        duration: seededRandom(i * 29 + 11)() * 3 + 2,
        opacity: seededRandom(i * 31 + 13)() * 0.12 + 0.08,
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

export default function WikiPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<"全て" | Category>("全て")
  const searchRef = useRef<HTMLInputElement>(null)

  const filteredEntries = useMemo(() => {
    let entries = ALL_ENTRIES
    if (activeCategory !== "全て") {
      entries = entries.filter((e) => e.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      entries = entries.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.nameEn && e.nameEn.toLowerCase().includes(q)) ||
          e.description.toLowerCase().includes(q) ||
          (e.subCategory && e.subCategory.toLowerCase().includes(q)) ||
          (e.affiliation && e.affiliation.toLowerCase().includes(q)) ||
          (e.era && e.era.toLowerCase().includes(q))
      )
    }
    return entries
  }, [search, activeCategory])

  const totalEntries = ALL_ENTRIES.length
  const charCount = ALL_ENTRIES.filter((e) => e.category === "キャラクター").length
  const termCount = totalEntries - charCount

  return (
    <div className="relative min-h-screen bg-[#0d0d1a]">
      <StarField />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d1a]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-14">
            <a
              href="/"
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs hidden sm:inline tracking-wider uppercase">EDU</span>
            </a>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-white/25" />
              <span className="text-sm font-light text-white/60 tracking-wide">EDU Wiki</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white/85 mb-4 tracking-wider">
              EDU 百科事典
            </h1>
            <p className="text-sm text-white/40 font-light max-w-xl mx-auto leading-relaxed">
              Eternal Dominion Universe — キャラクター・用語・組織・地理の全データ
            </p>
            <div className="flex justify-center gap-4 mt-5 text-xs text-white/25 font-light tracking-wide">
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-white/20" />
                キャラクター {charCount}
              </span>
              <span className="text-white/[0.08]">|</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-white/20" />
                用語・その他 {termCount}
              </span>
              <span className="text-white/[0.08]">|</span>
              <span>計 {totalEntries}項目</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center gap-3 px-4 py-3 transition-all duration-300 focus-within:border-white/[0.18] focus-within:bg-white/[0.04]">
              <Search className="w-4 h-4 text-white/20 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索…（名前、英語名、説明文など）"
                className="flex-1 bg-transparent text-sm text-white/75 placeholder:text-white/20 outline-none font-light"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("")
                    searchRef.current?.focus()
                  }}
                  className="text-white/25 hover:text-white/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              const config = cat !== "全て" ? CATEGORY_CONFIG[cat] : null
              const count =
                cat === "全て" ? totalEntries : ALL_ENTRIES.filter((e) => e.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-light rounded-full border transition-all duration-300 ${
                    isActive
                      ? "bg-white/10 text-white/90 border-white/[0.15]"
                      : "bg-white/[0.02] border-white/[0.06] text-white/35 hover:bg-white/[0.05] hover:text-white/55 hover:border-white/[0.1]"
                  }`}
                >
                  {cat === "全て" ? <Sparkles className="w-3 h-3" /> : config?.icon}
                  {cat === "全て" ? `全て (${count})` : `${cat} (${count})`}
                </button>
              )
            })}
          </div>

          {/* Results info */}
          <div className="mb-6 text-xs text-white/25 font-light tracking-wide">
            {search || activeCategory !== "全て" ? (
              <span>
                {filteredEntries.length} 件の結果
                {search && (
                  <span>
                    {" "}
                    — 「<span className="text-white/50">{search}</span>」で検索中
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
                const catConfig = CATEGORY_CONFIG[entry.category] || CATEGORY_CONFIG["用語"]
                const preview =
                  entry.description.length > 80
                    ? entry.description.slice(0, 80) + "…"
                    : entry.description
                return (
                  <Link
                    key={entry.id}
                    href={`/wiki/${encodeURIComponent(entry.id)}`}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:scale-[1.01] group block"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-3.5 mb-3.5">
                        <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/[0.1] bg-white/[0.02] flex items-center justify-center">
                          {entry.image ? (
                            <Image
                              src={entry.image}
                              alt={entry.name}
                              width={48}
                              height={48}
                              unoptimized
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-white/15" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-light px-2 py-0.5 rounded-full border bg-white/[0.03] text-white/40 border-white/[0.06]">
                              {catConfig.icon}
                              {entry.subCategory || catConfig.label}
                            </span>
                            {entry.tier && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/25 border border-white/[0.05] font-light">
                                {entry.tier}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-light text-white/80 leading-tight group-hover:text-white transition-colors">
                            {entry.name}
                            {entry.nameEn && (
                              <span className="text-[11px] font-light text-white/30 ml-1.5">
                                {entry.nameEn}
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-white/[0.4] font-light leading-relaxed line-clamp-2">
                        {preview}
                      </p>
                      {(entry.era || entry.affiliation) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {entry.era && (
                            <span className="text-[10px] text-white/25 bg-white/[0.02] px-1.5 py-0.5 rounded font-light">
                              {entry.era}
                            </span>
                          )}
                          {entry.affiliation && (
                            <span className="text-[10px] text-white/25 bg-white/[0.02] px-1.5 py-0.5 rounded truncate max-w-[180px] font-light">
                              {entry.affiliation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-white/[0.08] mx-auto mb-4" />
              <p className="text-white/35 text-sm font-light">該当する項目が見つかりません</p>
              <button
                onClick={() => {
                  setSearch("")
                  setActiveCategory("全て")
                }}
                className="mt-4 text-xs text-white/40 hover:text-white/60 transition-colors font-light"
              >
                フィルターをリセット
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.05] py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <p className="text-xs text-white/[0.15] font-light tracking-wide">
            EDU 百科事典 — Eternal Dominion Universe 統合時空構造書 v3.0
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/20 hover:text-white/40 transition-colors font-light"
          >
            <ArrowLeft className="w-3 h-3" />
            メインページに戻る
          </a>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 10, 26, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </div>
  )
}
