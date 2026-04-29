"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  X,
  Sparkles,
  ChevronRight,
  User,
  Building2,
  Globe,
  ArrowLeftRight,
  Shield,
  Swords,
  Link2,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

import {
  getRelationNodes,
  getRelationEdges,
  getEntityById,
  getRelationsForEntity,
  type RelationNode,
  type RelationEdge,
} from "@/lib/relation-data"

/* ── 定数・ヘルパー ── */

const EDGE_TYPE_CONFIG: Record<
  RelationEdge["type"],
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  所属: {
    label: "所属",
    color: "text-cyan-400",
    bg: "bg-cyan-400/15 border-cyan-400/30",
    icon: User,
  },
  指導: {
    label: "指導",
    color: "text-amber-400",
    bg: "bg-amber-400/15 border-amber-400/30",
    icon: Building2,
  },
  同盟: {
    label: "同盟",
    color: "text-emerald-400",
    bg: "bg-emerald-400/15 border-emerald-400/30",
    icon: Shield,
  },
  対立: {
    label: "対立",
    color: "text-red-400",
    bg: "bg-red-400/15 border-red-400/30",
    icon: Swords,
  },
  関連: {
    label: "関連",
    color: "text-violet-400",
    bg: "bg-violet-400/15 border-violet-400/30",
    icon: Link2,
  },
  歴史的: {
    label: "歴史",
    color: "text-orange-400",
    bg: "bg-orange-400/15 border-orange-400/30",
    icon: Clock,
  },
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  キャラクター: {
    label: "キャラ",
    color: "text-cyan-300",
    bg: "bg-cyan-400/15 border-cyan-400/25",
    icon: User,
  },
  組織: {
    label: "組織",
    color: "text-amber-300",
    bg: "bg-amber-400/15 border-amber-400/25",
    icon: Building2,
  },
  文明: {
    label: "文明",
    color: "text-emerald-300",
    bg: "bg-emerald-400/15 border-emerald-400/25",
    icon: Globe,
  },
}

const TIER_BADGES: Record<string, { color: string; bg: string }> = {
  "Tier 1": { color: "text-amber-300", bg: "bg-amber-400/20" },
  "Tier 2": { color: "text-blue-300", bg: "bg-blue-400/20" },
  "神格・歴史的人物": { color: "text-yellow-300", bg: "bg-yellow-400/20" },
  歴史的人物: { color: "text-orange-300", bg: "bg-orange-400/20" },
}

type CategoryFilter = "all" | "キャラクター" | "組織" | "文明"

/* ── メインコンポーネント ── */

export default function NexusPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set())
  const [analysis, setAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const nodes = useMemo(() => getRelationNodes(), [])

  const filteredNodes = useMemo(() => {
    let filtered = nodes
    if (categoryFilter !== "all") {
      filtered = filtered.filter((n) => n.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          (n.nameEn && n.nameEn.toLowerCase().includes(q)) ||
          n.description.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [nodes, categoryFilter, search])

  const selectedNode = useMemo(
    () => (selectedId ? getEntityById(selectedId) : undefined),
    [selectedId]
  )

  const relations = useMemo(
    () => (selectedId ? getRelationsForEntity(selectedId) : []),
    [selectedId]
  )

  const categoryCounts = useMemo(() => {
    const counts = { all: nodes.length, キャラクター: 0, 組織: 0, 文明: 0 }
    for (const n of nodes) {
      if (n.category === "キャラクター") counts.キャラクター++
      else if (n.category === "組織") counts.組織++
      else if (n.category === "文明") counts.文明++
    }
    return counts
  }, [nodes])

  const edgeCounts = useMemo(() => {
    const edges = getRelationEdges()
    const counts: Record<string, number> = {}
    for (const e of edges) {
      counts[e.type] = (counts[e.type] || 0) + 1
    }
    return counts
  }, [])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setSidebarOpen(false)
    setAnalysis("")
    setAnalysisError("")
  }, [])

  const handleMultiSelect = useCallback((id: string) => {
    setMultiSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setAnalysis("")
    setAnalysisError("")
  }, [])

  const handleAnalyze = useCallback(async () => {
    const entityIds =
      multiSelected.size > 0 ? Array.from(multiSelected) : selectedId ? [selectedId] : []
    if (entityIds.length === 0) return

    setIsAnalyzing(true)
    setAnalysis("")
    setAnalysisError("")

    try {
      const res = await fetch("/api/analyze-relations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityIds }),
      })
      const data = await res.json()
      if (data.error) {
        setAnalysisError(data.error)
      } else {
        setAnalysis(data.analysis)
      }
    } catch {
      setAnalysisError("通信エラーが発生しました。もう一度お試しください。")
    } finally {
      setIsAnalyzing(false)
    }
  }, [multiSelected, selectedId])

  const analysisTargetIds =
    multiSelected.size > 0 ? Array.from(multiSelected) : selectedId ? [selectedId] : []

  return (
    <main className="min-h-screen bg-edu-bg pt-12">
      {/* Header */}
      <header className="border-b border-edu-border bg-edu-surface/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
                <span className="text-edu-accent">NEXUS</span>
                <span className="text-edu-muted mx-2 text-sm">—</span>
                <span className="text-edu-text text-base sm:text-lg">組織・人物相関解析</span>
              </h1>
              <p className="text-edu-muted text-xs mt-1">
                EDU宇宙のエンティティ間関係を可視化し、AIが相関を解析
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-edu-muted">
              <span>{nodes.length} エンティティ</span>
              <span className="text-edu-border">|</span>
              <span>{getRelationEdges().length} リレーション</span>
            </div>
          </div>

          {/* グラフ統計バー */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(EDGE_TYPE_CONFIG).map(([type, config]) => (
              <span
                key={type}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] border rounded ${config.bg} ${config.color}`}
              >
                {edgeCounts[type] || 0} {config.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* モバイル: サイドバー開くボタン */}
        {!selectedNode && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-full mb-4 py-3 bg-edu-surface border border-edu-border rounded-lg text-edu-muted text-sm hover:text-edu-text hover:border-edu-accent/30 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            エンティティを検索・選択
          </button>
        )}

        <div className="flex gap-6">
          {/* ── Left Sidebar: Entity Selector ── */}
          <aside
            className={`${
              sidebarOpen ? "fixed inset-0 z-50 bg-edu-bg/95 backdrop-blur-sm p-4" : "hidden"
            } lg:block lg:relative lg:z-auto lg:bg-transparent lg:p-0 lg:w-72 xl:w-80 shrink-0`}
          >
            <div className="bg-edu-surface border border-edu-border rounded-lg overflow-hidden lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:flex lg:flex-col">
              {/* モバイル閉じるボタン */}
              <div className="lg:hidden flex items-center justify-between p-3 border-b border-edu-border">
                <span className="text-sm font-medium text-edu-text">エンティティ選択</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-edu-muted hover:text-edu-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 検索 */}
              <div className="p-3 border-b border-edu-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-edu-muted" />
                  <input
                    type="text"
                    placeholder="名前で検索..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-edu-bg border border-edu-border rounded-md text-sm text-edu-text placeholder:text-edu-muted focus:outline-none focus:border-edu-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* カテゴリフィルター */}
              <div className="flex p-2 gap-1 border-b border-edu-border">
                {(
                  [
                    ["all", "全て", categoryCounts.all],
                    ["キャラクター", "キャラ", categoryCounts.キャラクター],
                    ["組織", "組織", categoryCounts.組織],
                    ["文明", "文明", categoryCounts.文明],
                  ] as const
                ).map(([key, label, count]) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key as CategoryFilter)}
                    className={`flex-1 py-1.5 text-[10px] rounded transition-colors ${
                      categoryFilter === key
                        ? "bg-edu-accent/15 text-edu-accent"
                        : "text-edu-muted hover:text-edu-text hover:bg-edu-card"
                    }`}
                  >
                    {label}
                    <span className="ml-0.5 opacity-60">{count}</span>
                  </button>
                ))}
              </div>

              {/* エンティティリスト */}
              <div className="flex-1 overflow-y-auto max-h-96 lg:max-h-none custom-scrollbar">
                {filteredNodes.length === 0 ? (
                  <div className="p-4 text-center text-edu-muted text-xs">
                    該当するエンティティがありません
                  </div>
                ) : (
                  filteredNodes.map((node) => {
                    const isSelected = selectedId === node.id
                    const isMulti = multiSelected.has(node.id)
                    const catConfig = CATEGORY_CONFIG[node.category]
                    return (
                      <motion.button
                        key={node.id}
                        onClick={() => handleSelect(node.id)}
                        onContextMenu={(e) => {
                          e.preventDefault()
                          handleMultiSelect(node.id)
                        }}
                        whileHover={{ x: 2 }}
                        className={`w-full text-left px-3 py-2.5 border-b border-edu-border/50 transition-colors ${
                          isSelected
                            ? "bg-edu-accent/10 border-l-2 border-l-edu-accent"
                            : isMulti
                              ? "bg-violet-500/10 border-l-2 border-l-violet-400"
                              : "hover:bg-edu-card"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {node.image ? (
                            <div className="relative w-8 h-8 rounded overflow-hidden shrink-0 bg-edu-card border border-edu-border">
                              <Image
                                src={node.image}
                                alt={node.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          ) : catConfig ? (
                            <div className="w-8 h-8 rounded bg-edu-card border border-edu-border flex items-center justify-center shrink-0">
                              {React.createElement(catConfig.icon, {
                                className: "w-3.5 h-3.5",
                                style: { color: "#c8a44e" },
                              })}
                            </div>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-xs font-medium truncate ${isSelected ? "text-edu-accent" : "text-edu-text"}`}
                              >
                                {node.name}
                              </span>
                              {catConfig && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded border ${catConfig.bg} ${catConfig.color}`}
                                >
                                  {catConfig.label}
                                </span>
                              )}
                            </div>
                            {node.nameEn && (
                              <span className="text-[10px] text-edu-muted">{node.nameEn}</span>
                            )}
                            <div className="flex items-center gap-1 mt-0.5">
                              {node.tier && TIER_BADGES[node.tier] && (
                                <span
                                  className={`text-[9px] px-1 py-0.5 rounded ${TIER_BADGES[node.tier]!.bg} ${TIER_BADGES[node.tier]!.color}`}
                                >
                                  {node.tier}
                                </span>
                              )}
                              {node.era && (
                                <span className="text-[9px] text-edu-muted">{node.era}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })
                )}
              </div>
            </div>
          </aside>

          {/* ── Center: Relation Display ── */}
          <div className="flex-1 min-w-0">
            {selectedNode ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* 選択済みエンティティ詳細 */}
                  <div className="bg-edu-surface border border-edu-border rounded-lg p-4 sm:p-6 mb-6">
                    <div className="flex items-start gap-4">
                      {selectedNode.image ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-edu-card border border-edu-border shrink-0">
                          <Image
                            src={selectedNode.image}
                            alt={selectedNode.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-edu-card border border-edu-border flex items-center justify-center shrink-0">
                          {(() => {
                            const cfg = CATEGORY_CONFIG[selectedNode.category]
                            return cfg
                              ? React.createElement(cfg.icon, {
                                  className: "w-8 h-8",
                                  style: { color: "#c8a44e" },
                                })
                              : null
                          })()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-edu-text">
                            {selectedNode.name}
                          </h2>
                          {selectedNode.nameEn && (
                            <span className="text-sm text-edu-muted">{selectedNode.nameEn}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {(() => {
                            const cfg = CATEGORY_CONFIG[selectedNode.category]
                            return cfg ? (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}
                              >
                                {selectedNode.category}
                              </span>
                            ) : null
                          })()}
                          {selectedNode.tier && TIER_BADGES[selectedNode.tier] && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded ${TIER_BADGES[selectedNode.tier]!.bg} ${TIER_BADGES[selectedNode.tier]!.color}`}
                            >
                              {selectedNode.tier}
                            </span>
                          )}
                          {selectedNode.era && (
                            <span className="text-[10px] text-edu-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {selectedNode.era}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-edu-muted mt-2 leading-relaxed line-clamp-3">
                          {selectedNode.description}
                        </p>
                        <Link
                          href={`/wiki/${selectedNode.id}`}
                          className="inline-flex items-center gap-1 text-[10px] text-edu-accent hover:text-edu-accent/80 mt-2 transition-colors"
                        >
                          Wikiで見る <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* AI解析ボタン */}
                    <div className="mt-4 pt-4 border-t border-edu-border">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing || analysisTargetIds.length === 0}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-edu-accent/15 border border-edu-accent/30 rounded-lg text-edu-accent text-xs font-medium hover:bg-edu-accent/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          {isAnalyzing ? "解析中..." : "AI解析を実行"}
                        </button>
                        <span className="text-[10px] text-edu-muted">
                          選択: {analysisTargetIds.length} エンティティ
                          {multiSelected.size > 0 && " (マルチ選択中)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 関連エンティティカード */}
                  <div>
                    <h3 className="text-sm font-medium text-edu-text mb-3 flex items-center gap-2">
                      <ArrowLeftRight className="w-4 h-4 text-edu-accent" />
                      関連エンティティ ({relations.length})
                    </h3>
                    {relations.length === 0 ? (
                      <div className="bg-edu-surface border border-edu-border rounded-lg p-6 text-center text-edu-muted text-xs">
                        関連するエンティティが見つかりません
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {relations.map(({ node, edge }) => {
                          const edgeConfig = EDGE_TYPE_CONFIG[edge.type]
                          if (!edgeConfig) return null
                          const EdgeIcon = edgeConfig.icon
                          return (
                            <motion.div
                              key={node.id}
                              whileHover={{ y: -2 }}
                              transition={{ duration: 0.15 }}
                            >
                              <Link href={`/wiki/${node.id}`} className="block">
                                <div className="bg-edu-surface border border-edu-border rounded-lg p-3 hover:border-edu-accent/30 transition-colors group cursor-pointer">
                                  <div className="flex items-start gap-3">
                                    {node.image ? (
                                      <div className="relative w-10 h-10 rounded overflow-hidden bg-edu-card border border-edu-border shrink-0">
                                        <Image
                                          src={node.image}
                                          alt={node.name}
                                          fill
                                          className="object-cover"
                                          sizes="40px"
                                        />
                                      </div>
                                    ) : CATEGORY_CONFIG[node.category] ? (
                                      <div className="w-10 h-10 rounded bg-edu-card border border-edu-border flex items-center justify-center shrink-0">
                                        {React.createElement(CATEGORY_CONFIG[node.category]!.icon, {
                                          className: "w-4 h-4",
                                          style: { color: "#6b7394" },
                                        })}
                                      </div>
                                    ) : null}
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-xs font-medium text-edu-text group-hover:text-edu-accent transition-colors truncate">
                                          {node.name}
                                        </span>
                                        <span
                                          className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded border ${edgeConfig.bg} ${edgeConfig.color}`}
                                        >
                                          <EdgeIcon className="w-2.5 h-2.5" />
                                          {edgeConfig.label}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-edu-muted mt-0.5 line-clamp-2">
                                        {edge.description}
                                      </p>
                                      {node.tier && TIER_BADGES[node.tier] && (
                                        <span
                                          className={`inline-block mt-1 text-[8px] px-1 py-0.5 rounded ${TIER_BADGES[node.tier]!.bg} ${TIER_BADGES[node.tier]!.color}`}
                                        >
                                          {node.tier}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              /* 空状態 */
              <div className="bg-edu-surface border border-edu-border rounded-lg p-8 sm:p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-edu-card border border-edu-border flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-edu-muted" />
                </div>
                <h2 className="text-base font-medium text-edu-text mb-2">エンティティを選択</h2>
                <p className="text-xs text-edu-muted max-w-sm mx-auto leading-relaxed">
                  左のパネルからキャラクター、組織、または文明を選択すると、
                  その関連ネットワークが表示されます。
                  <br />
                  <span className="text-edu-accent/60">右クリック</span>でマルチ選択 →
                  AI解析が可能です。
                </p>
                {/* クイックピック */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    "アイリス",
                    "セリア・ドミニクス",
                    "AURALIS",
                    "グランベル",
                    "シルバー・ヴェノム",
                    "トリニティ・アライアンス",
                  ].map((name) => {
                    const node = getEntityById(name)
                    if (!node) return null
                    return (
                      <button
                        key={node.id}
                        onClick={() => handleSelect(node.id)}
                        className="px-3 py-1.5 bg-edu-card border border-edu-border rounded-lg text-xs text-edu-text hover:border-edu-accent/40 hover:text-edu-accent transition-colors"
                      >
                        {node.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── AI Analysis Panel ── */}
            {(isAnalyzing || analysis || analysisError) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-edu-surface border border-edu-border rounded-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-edu-border flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-edu-accent" />
                  <span className="text-sm font-medium text-edu-text">AI解析結果</span>
                  {analysis && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                </div>
                <div className="p-4">
                  {isAnalyzing && (
                    <div className="flex flex-col items-center py-8">
                      <Loader2 className="w-8 h-8 text-edu-accent animate-spin mb-3" />
                      <p className="text-xs text-edu-muted">Gemini AIが関係性を解析中...</p>
                    </div>
                  )}
                  {analysisError && (
                    <div className="flex items-start gap-2 py-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{analysisError}</p>
                    </div>
                  )}
                  {analysis && (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div
                        className="text-xs text-edu-text leading-relaxed whitespace-pre-wrap [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-edu-accent [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-edu-border [&_h2]:pb-1 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:text-edu-text [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:text-edu-muted [&_ul]:text-xs [&_li]:mb-1 [&_p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

/* ── マークダウン風フォーマット ── */

function formatAnalysis(text: string): string {
  let result = text
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-edu-accent">$1</strong>')
    .replace(/\n/g, "<br/>")
  // Wrap consecutive <li> in <ul>
  result = result.replace(/((?:<li>.*?<\/li>(?:<br\/>)?)+)/g, "<ul>$1</ul>")
  return result
}

/* React import needed for createElement */
import React from "react"
