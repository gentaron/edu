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
import { StarField } from "@/components/edu/star-field"

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
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />

      <main className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-edu-text mb-4 tracking-wider">
              EDU 百科事典
            </h1>
            <p className="text-sm text-edu-muted font-light max-w-xl mx-auto leading-relaxed">
              Eternal Dominion Universe — キャラクター・用語・組織・地理の全データ
            </p>
            <div className="flex justify-center gap-4 mt-5 text-xs text-edu-muted font-light tracking-wide">
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-edu-muted" />
                キャラクター {charCount}
              </span>
              <span className="text-edu-border">|</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-edu-muted" />
                用語・その他 {termCount}
              </span>
              <span className="text-edu-border">|</span>
              <span>計 {totalEntries}項目</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-edu-card border border-edu-border rounded-xl flex items-center gap-3 px-4 py-3 transition-all duration-300 focus-within:border-edu-accent/40 focus-within:bg-edu-card">
              <Search className="w-4 h-4 text-edu-muted shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索…（名前、英語名、説明文など）"
                className="flex-1 bg-transparent text-sm text-edu-text placeholder:text-edu-muted outline-none font-light"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("")
                    searchRef.current?.focus()
                  }}
                  className="text-edu-muted hover:text-edu-text transition-colors"
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
                      ? "bg-edu-accent/15 text-edu-accent border-edu-accent/30"
                      : "bg-edu-card border-edu-border text-edu-muted hover:bg-edu-surface hover:text-edu-text hover:border-edu-accent/20"
                  }`}
                >
                  {cat === "全て" ? <Sparkles className="w-3 h-3" /> : config?.icon}
                  {cat === "全て" ? `全て (${count})` : `${cat} (${count})`}
                </button>
              )
            })}
          </div>

          {/* Results info */}
          <div className="mb-6 text-xs text-edu-muted font-light tracking-wide">
            {search || activeCategory !== "全て" ? (
              <span>
                {filteredEntries.length} 件の結果
                {search && (
                  <span>
                    {" "}
                    — 「<span className="text-edu-accent">{search}</span>」で検索中
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
                const catConfig = CATEGORY_CONFIG[entry.category] ?? CATEGORY_CONFIG["用語"]!
                const preview =
                  entry.description.length > 80
                    ? entry.description.slice(0, 80) + "…"
                    : entry.description
                return (
                  <Link
                    key={entry.id}
                    href={`/wiki/${encodeURIComponent(entry.id)}`}
                    className="edu-card rounded-xl overflow-hidden transition-all duration-300 group block"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-3.5 mb-3.5">
                        <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-edu-border bg-edu-surface flex items-center justify-center">
                          {entry.image ? (
                            <Image
                              src={entry.image}
                              alt={entry.name}
                              width={48}
                              height={48}
                              sizes="(max-width: 768px) 50vw, 25vw"
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-edu-muted" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span className="edu-tag text-edu-muted">
                              {catConfig.icon}
                              {entry.subCategory || catConfig.label}
                            </span>
                            {entry.tier && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-edu-surface text-edu-muted border border-edu-border font-light">
                                {entry.tier}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-light text-edu-text leading-tight group-hover:text-edu-accent transition-colors">
                            {entry.name}
                            {entry.nameEn && (
                              <span className="text-[11px] font-light text-edu-muted ml-1.5">
                                {entry.nameEn}
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-edu-muted font-light leading-relaxed line-clamp-2">
                        {preview}
                      </p>
                      {(entry.era || entry.affiliation) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {entry.era && (
                            <span className="text-[10px] text-edu-muted bg-edu-surface px-1.5 py-0.5 rounded font-light">
                              {entry.era}
                            </span>
                          )}
                          {entry.affiliation && (
                            <span className="text-[10px] text-edu-muted bg-edu-surface px-1.5 py-0.5 rounded truncate max-w-[180px] font-light">
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
              <Search className="w-12 h-12 text-edu-muted mx-auto mb-4" />
              <p className="text-edu-muted text-sm font-light">該当する項目が見つかりません</p>
              <button
                onClick={() => {
                  setSearch("")
                  setActiveCategory("全て")
                }}
                className="mt-4 text-xs text-edu-muted hover:text-edu-accent transition-colors font-light"
              >
                フィルターをリセット
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-edu-border py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-edu-border to-transparent" />
          <p className="text-xs text-edu-muted font-light tracking-wide">
            EDU 百科事典 — Eternal Dominion Universe 統合時空構造書 v3.0
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-edu-muted hover:text-edu-accent transition-colors font-light"
          >
            <ArrowLeft className="w-3 h-3" />
            メインページに戻る
          </Link>
        </div>
      </footer>
    </div>
  )
}
