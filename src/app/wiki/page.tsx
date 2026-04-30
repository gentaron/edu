"use client"

import React, { useState, useMemo, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Users,
  Crown,
  Star,
  Sparkles,
  Scroll,
  BookOpen,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { ALL_ENTRIES } from "@/lib/wiki-data"

type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史"

const CATEGORIES: {
  key: Category
  label: string
  labelEn: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}[] = [
  {
    key: "キャラクター",
    label: "キャラクター",
    labelEn: "Characters",
    icon: Users,
    color: "text-amber-400",
  },
  { key: "組織", label: "組織", labelEn: "Organizations", icon: Crown, color: "text-indigo-400" },
  { key: "地理", label: "地理", labelEn: "Geography", icon: Star, color: "text-emerald-400" },
  { key: "技術", label: "技術", labelEn: "Technology", icon: Sparkles, color: "text-cyan-400" },
  { key: "用語", label: "用語", labelEn: "Terms", icon: BookOpen, color: "text-pink-400" },
  { key: "歴史", label: "歴史", labelEn: "History", icon: Scroll, color: "text-orange-400" },
]

const BORDER_COLORS: Record<Category, string> = {
  キャラクター: "border-l-amber-400",
  組織: "border-l-indigo-400",
  地理: "border-l-emerald-400",
  技術: "border-l-cyan-400",
  用語: "border-l-pink-400",
  歴史: "border-l-orange-400",
}

function WikiLoading() {
  return (
    <main className="min-h-screen bg-edu-bg pt-16 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="animate-pulse">
          <div className="h-7 w-48 bg-edu-surface rounded mb-2" />
          <div className="h-4 w-64 bg-edu-surface rounded mb-6" />
          <div className="h-10 bg-edu-surface rounded-lg mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-edu-surface rounded-lg mb-4" />
          ))}
        </div>
      </div>
    </main>
  )
}

function WikiPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category") as Category | null
  const [search, setSearch] = useState("")

  const isSearching = search.trim().length > 0
  const showCategory = !isSearching && categoryParam

  const searchResults = useMemo(() => {
    if (!isSearching) return []
    const q = search.toLowerCase().trim()
    return ALL_ENTRIES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.nameEn && e.nameEn.toLowerCase().includes(q)) ||
        e.description.toLowerCase().includes(q)
    )
  }, [search, isSearching])

  const categoryEntries = useMemo(() => {
    if (!showCategory || !categoryParam) return []
    return ALL_ENTRIES.filter((e) => e.category === categoryParam)
  }, [showCategory, categoryParam])

  const grouped = useMemo(() => {
    const map: Partial<Record<Category, typeof ALL_ENTRIES>> = {}
    for (const cat of CATEGORIES.map((c) => c.key)) {
      map[cat] = ALL_ENTRIES.filter((e) => e.category === cat)
    }
    return map
  }, [])

  function getRepresentatives(category: Category, count: number) {
    const entries = grouped[category] || []
    const tierOrder: Record<string, number> = {
      "神格・歴史的人物": 0,
      "Tier 1": 1,
      "Tier 2": 2,
      "Tier 3": 3,
    }
    return [...entries]
      .sort((a, b) => {
        const ta = tierOrder[a.tier || ""] ?? 9
        const tb = tierOrder[b.tier || ""] ?? 9
        return ta - tb || a.name.localeCompare(b.name)
      })
      .slice(0, count)
  }

  function getTierCounts(category: Category) {
    const entries = grouped[category] || []
    const counts: Record<string, number> = {}
    for (const e of entries) {
      const tier = e.tier || "未分類"
      counts[tier] = (counts[tier] || 0) + 1
    }
    return Object.entries(counts).sort(([a], [b]) => {
      const order: Record<string, number> = {
        "神格・歴史的人物": 0,
        "Tier 1": 1,
        "Tier 2": 2,
        "Tier 3": 3,
      }
      return (order[a] ?? 9) - (order[b] ?? 9)
    })
  }

  // Find the category label for category param
  const activeCategoryConfig = categoryParam
    ? CATEGORIES.find((c) => c.key === categoryParam)
    : null

  return (
    <main className="min-h-screen bg-edu-bg pt-16 pb-20">
      {/* Header + Search */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-xl font-bold text-edu-text mb-1">EDU Wiki 百科事典</h1>
        <p className="text-xs text-edu-muted mb-6">
          {ALL_ENTRIES.length} entries — キャラクター・組織・地理・技術・用語・歴史
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-edu-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Wiki内を検索..."
            className="w-full bg-edu-surface border border-edu-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-edu-text placeholder:text-edu-muted focus:outline-none focus:border-edu-accent"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Search results */}
        {isSearching ? (
          <div>
            <p className="text-xs text-edu-muted mb-4">
              「{search}」の検索結果: {searchResults.length}件
            </p>
            {searchResults.length === 0 ? (
              <p className="text-xs text-edu-muted text-center py-12">
                該当するエントリがありません
              </p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/wiki/${encodeURIComponent(entry.id)}`}
                    className={`block edu-card p-3 border-l-[3px] ${BORDER_COLORS[entry.category] || "border-l-edu-border"} hover:border-edu-accent transition-colors`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-edu-text">{entry.name}</span>
                      {entry.nameEn && (
                        <span className="text-[10px] text-edu-muted">{entry.nameEn}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-edu-muted leading-relaxed line-clamp-2">
                      {entry.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : showCategory && activeCategoryConfig ? (
          /* Category detail view */
          <div>
            <Link
              href="/wiki"
              className="inline-flex items-center gap-1 text-xs text-edu-muted hover:text-edu-accent transition-colors mb-4"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              カテゴリ一覧に戻る
            </Link>
            <div className="flex items-center gap-2 mb-6">
              <activeCategoryConfig.icon className={`w-4 h-4 ${activeCategoryConfig.color}`} />
              <h2 className="text-sm font-bold text-edu-text">{activeCategoryConfig.label}</h2>
              <span className="text-[10px] text-edu-muted">{categoryEntries.length}件</span>
            </div>
            {categoryEntries.length === 0 ? (
              <p className="text-xs text-edu-muted text-center py-12">
                該当するエントリがありません
              </p>
            ) : (
              <div className="space-y-2">
                {categoryEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/wiki/${encodeURIComponent(entry.id)}`}
                    className={`block edu-card p-3 border-l-[3px] ${BORDER_COLORS[entry.category] || "border-l-edu-border"} hover:border-edu-accent transition-colors`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-edu-text">{entry.name}</span>
                      {entry.nameEn && (
                        <span className="text-[10px] text-edu-muted">{entry.nameEn}</span>
                      )}
                      {entry.tier && (
                        <span className="text-[10px] text-edu-muted bg-edu-surface px-1.5 py-0.5 rounded">
                          {entry.tier}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-edu-muted leading-relaxed line-clamp-2">
                      {entry.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Default: category summaries */
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const entries = grouped[cat.key] || []
              if (entries.length === 0) return null
              const representatives = getRepresentatives(cat.key, 8)
              const tierCounts = getTierCounts(cat.key)
              const Icon = cat.icon

              return (
                <section key={cat.key} className="edu-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                      <h2 className="text-sm font-bold text-edu-text">{cat.label}</h2>
                      <span className="text-[10px] text-edu-muted">{entries.length}</span>
                    </div>
                  </div>

                  {tierCounts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tierCounts.map(([tier, count]) => (
                        <span
                          key={tier}
                          className="text-[10px] text-edu-muted bg-edu-surface px-2 py-0.5 rounded"
                        >
                          {tier}: {count}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                    {representatives.map((entry) => (
                      <Link
                        key={entry.id}
                        href={`/wiki/${encodeURIComponent(entry.id)}`}
                        className="text-xs text-edu-accent hover:text-edu-accent2 transition-colors"
                      >
                        {entry.name}
                      </Link>
                    ))}
                    <span className="text-xs text-edu-muted">...</span>
                  </div>

                  <Link
                    href={`/wiki?category=${encodeURIComponent(cat.key)}`}
                    className="inline-flex items-center gap-1 text-[10px] text-edu-muted hover:text-edu-accent transition-colors"
                  >
                    全{entries.length}件を見る <ChevronRight className="w-3 h-3" />
                  </Link>
                </section>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-edu-border mt-12 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-edu-muted hover:text-edu-accent transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            メインページに戻る
          </Link>
        </div>
      </footer>
    </main>
  )
}

export default function WikiPageWrapper() {
  return (
    <Suspense fallback={<WikiLoading />}>
      <WikiPage />
    </Suspense>
  )
}
