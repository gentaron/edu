"use client"

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { m } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Clock,
  ArrowUpDown,
  Zap,
  Globe2,
  Landmark,
  Coins,
  Crosshair,
  Star,
} from "lucide-react"
import { useLang } from "@/lib/use-lang"
import {
  getAllAssets,
  getAsset,
  NARRATIVE_EVENTS,
  type Asset,
  type AssetPrice,
} from "@/lib/market-data"

// ─── Constants ───

const TIME_PERIODS = [
  { id: "1D" as const, label: "1D", labelEn: "1D", days: 1 },
  { id: "1W" as const, label: "1W", labelEn: "1W", days: 7 },
  { id: "1M" as const, label: "1M", labelEn: "1M", days: 30 },
  { id: "3M" as const, label: "3M", labelEn: "3M", days: 90 },
  { id: "1Y" as const, label: "1Y", labelEn: "1Y", days: 365 },
]

type SortKey = "symbol" | "name" | "price" | "change" | "changePercent"
type SortDir = "asc" | "desc"

// ─── Utility Functions ───

function formatPrice(p: number): string {
  if (p >= 1_000_000) {
    return `${(p / 1_000_000).toFixed(2)}M`
  }
  if (p >= 1_000) {
    return p.toLocaleString("en-US", { maximumFractionDigits: 0 })
  }
  return p.toFixed(2)
}

function formatChange(n: number): string {
  const sign = n >= 0 ? "+" : ""
  return `${sign}${n.toFixed(2)}`
}

function formatVolume(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return v.toString()
}

function getSlicePrices(prices: AssetPrice[], days: number): AssetPrice[] {
  return prices.slice(Math.max(0, prices.length - days))
}

function isUp(prices: AssetPrice[]): boolean {
  if (prices.length < 2) return true
  return prices[prices.length - 1].close >= prices[0].open
}

// ─── Sparkline Component (SVG mini chart) ───

function Sparkline({
  prices,
  width = 80,
  height = 28,
}: {
  prices: AssetPrice[]
  width?: number
  height?: number
}) {
  if (prices.length < 2) return null

  const slice = prices.slice(-30) // last 30 days for sparkline
  const closes = slice.map((p) => p.close)
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const range = max - min || 1

  const points = closes
    .map((c, i) => {
      const x = (i / (closes.length - 1)) * width
      const y = height - ((c - min) / range) * height
      return `${x},${y}`
    })
    .join(" ")

  const up = closes[closes.length - 1] >= closes[0]
  const color = up ? "#34d399" : "#f43f5e"

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  )
}

// ─── Large Interactive Chart ───

function InteractiveChart({
  asset,
  periodDays,
  lang,
}: {
  asset: Asset
  periodDays: number
  lang: "ja" | "en"
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [dimensions, setDimensions] = useState({ w: 700, h: 300 })

  const slice = getSlicePrices(asset.prices, periodDays)
  const up = isUp(slice)
  const lineColor = up ? "#34d399" : "#f43f5e"
  const fillColor = up ? "rgba(52,211,153,0.08)" : "rgba(244,63,94,0.08)"

  const pad = { top: 20, right: 60, bottom: 30, left: 10 }
  const plotW = dimensions.w - pad.left - pad.right
  const plotH = dimensions.h - pad.top - pad.bottom

  const closes = slice.map((p) => p.close)
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const range = max - min || 1

  // Build path
  const points = closes.map((c, i) => ({
    x: pad.left + (i / Math.max(closes.length - 1, 1)) * plotW,
    y: pad.top + plotH - ((c - min) / range) * plotH,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
  const areaPath =
    linePath +
    ` L${points[points.length - 1].x.toFixed(1)},${(pad.top + plotH).toFixed(1)}` +
    ` L${points[0].x.toFixed(1)},${(pad.top + plotH).toFixed(1)} Z`

  // Narrative events in this slice
  const sliceDates = new Set(slice.map((p) => p.date))
  const visibleEvents = NARRATIVE_EVENTS.filter((ev) => sliceDates.has(ev.date))

  // Resize observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        if (width > 0) {
          setDimensions({ w: Math.min(width, 1200), h: 300 })
        }
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const idx = Math.round(((mouseX - pad.left) / plotW) * (points.length - 1))
      if (idx >= 0 && idx < points.length) {
        setHoverIdx(idx)
      }
    },
    [pad.left, plotW, points.length]
  )

  const handleMouseLeave = useCallback(() => setHoverIdx(null), [])

  const hoveredPoint = hoverIdx !== null ? points[hoverIdx] : null
  const hoveredPrice = hoverIdx !== null ? slice[hoverIdx] : null

  // Y-axis ticks
  const yTicks = 5
  const yTickValues = Array.from({ length: yTicks }, (_, i) => {
    const val = min + (range * i) / (yTicks - 1)
    return val
  })

  return (
    <div ref={containerRef} className="w-full">
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
        className="w-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={`grad-${asset.symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTickValues.map((val, i) => {
          const y = pad.top + plotH - ((val - min) / range) * plotH
          return (
            <g key={i}>
              <line
                x1={pad.left}
                y1={y}
                x2={pad.left + plotW}
                y2={y}
                stroke="rgba(30,42,82,0.5)"
                strokeWidth="0.5"
                strokeDasharray="4,4"
              />
              <text
                x={pad.left + plotW + 6}
                y={y + 4}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                {formatPrice(val)}
              </text>
            </g>
          )
        })}

        {/* Narrative event markers */}
        {visibleEvents.map((ev) => {
          const evIdx = slice.findIndex((p) => p.date === ev.date)
          if (evIdx < 0) return null
          const x = points[evIdx]?.x
          if (x === undefined) return null
          return (
            <g key={ev.date}>
              <line
                x1={x}
                y1={pad.top}
                x2={x}
                y2={pad.top + plotH}
                stroke="#c8a44e"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              <circle cx={x} cy={pad.top - 6} r="3" fill="#c8a44e" />
            </g>
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#grad-${asset.symbol})`} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />

        {/* Current price dot */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3"
            fill={lineColor}
          />
        )}

        {/* Crosshair on hover */}
        {hoveredPoint && hoveredPrice && (
          <g>
            <line
              x1={hoveredPoint.x}
              y1={pad.top}
              x2={hoveredPoint.x}
              y2={pad.top + plotH}
              stroke="rgba(226,232,240,0.2)"
              strokeWidth="1"
            />
            <line
              x1={pad.left}
              y1={hoveredPoint.y}
              x2={pad.left + plotW}
              y2={hoveredPoint.y}
              stroke="rgba(226,232,240,0.2)"
              strokeWidth="1"
            />
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="5" fill={lineColor} opacity="0.3" />
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="3" fill={lineColor} />

            {/* Tooltip */}
            <g>
              <rect
                x={Math.min(hoveredPoint.x - 65, pad.left + plotW - 130)}
                y={hoveredPoint.y - 42}
                width="130"
                height="36"
                rx="6"
                fill="rgba(12,16,36,0.95)"
                stroke="rgba(30,42,82,0.8)"
                strokeWidth="1"
              />
              <text
                x={Math.min(hoveredPoint.x - 58, pad.left + plotW - 123)}
                y={hoveredPoint.y - 24}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
              >
                {hoveredPrice.date}
              </text>
              <text
                x={Math.min(hoveredPoint.x - 58, pad.left + plotW - 123)}
                y={hoveredPoint.y - 12}
                fill="#e2e8f0"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {formatPrice(hoveredPrice.close)}n
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Narrative event labels below chart */}
      {visibleEvents.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 px-1">
          {visibleEvents.map((ev) => (
            <span
              key={ev.date}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-edu-accent/10 text-edu-accent border border-edu-accent/20"
            >
              <Crosshair className="w-2.5 h-2.5" />
              {lang === "ja" ? ev.descriptionJa : ev.descriptionEn}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Ticker Bar ───

function TickerBar({ assets, lang }: { assets: Asset[]; lang: "ja" | "en" }) {
  return (
    <div className="w-full overflow-hidden border-b border-edu-border/50 bg-edu-surface/50">
      <div className="flex animate-ticker-scroll">
        {/* Duplicate for seamless scroll */}
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {assets.map((a) => {
              const up = a.changePercent24h >= 0
              return (
                <div
                  key={`${dup}-${a.symbol}`}
                  className="flex items-center gap-2 px-4 py-2 shrink-0 border-r border-edu-border/30"
                >
                  <span className="text-xs font-bold text-edu-accent tracking-wider">{a.symbol}</span>
                  <span className="text-xs text-edu-text-dim">
                    {formatPrice(a.currentPrice)}n
                  </span>
                  <span className={`text-xs font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}>
                    {up ? "+" : ""}
                    {a.changePercent24h.toFixed(2)}%
                  </span>
                  <Sparkline prices={a.prices} width={48} height={18} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Stats Cards ───

function StatsSection({
  assets,
  lang,
}: {
  assets: Asset[]
  lang: "ja" | "en"
}) {
  const totalMarketCap = assets
    .filter((a) => a.marketCap)
    .length
  const totalVol24h = assets.reduce((sum, a) => {
    const last = a.prices[a.prices.length - 1]
    return sum + last.volume
  }, 0)
  const gainers = assets.filter((a) => a.changePercent24h >= 0).length
  const losers = assets.filter((a) => a.changePercent24h < 0).length
  const sentiment = gainers > losers ? "Bullish" : gainers < losers ? "Bearish" : "Neutral"
  const sentimentColor =
    sentiment === "Bullish" ? "text-emerald-400" : sentiment === "Bearish" ? "text-rose-400" : "text-edu-muted"

  const stats = [
    {
      icon: Globe2,
      label: lang === "ja" ? "マーケットキャップ" : "Market Cap",
      labelEn: "Market Cap",
      value: `${totalMarketCap} assets`,
      accent: false,
    },
    {
      icon: Activity,
      label: lang === "ja" ? "24h出来高" : "24h Volume",
      labelEn: "24h Volume",
      value: `${formatVolume(totalVol24h)}n`,
      accent: false,
    },
    {
      icon: BarChart3,
      label: lang === "ja" ? "銘柄数" : "Assets",
      labelEn: "Assets",
      value: `${assets.length}`,
      accent: false,
    },
    {
      icon: TrendingUp,
      label: lang === "ja" ? "センチメント" : "Sentiment",
      labelEn: "Sentiment",
      value: sentiment,
      accent: true,
      accentColor: sentimentColor,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon
        return (
          <m.div
            key={s.labelEn}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="edu-card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-edu-accent" />
              <span className="text-[11px] text-edu-muted tracking-wider uppercase">
                {lang === "ja" ? s.label : s.labelEn}
              </span>
            </div>
            <div className={`text-lg font-bold tracking-tight ${s.accent ? s.accentColor : "text-edu-text"}`}>
              {s.value}
            </div>
          </m.div>
        )
      })}
    </div>
  )
}

// ─── Stock / Crypto Table ───

function AssetTable({
  assets,
  lang,
  showAffiliation,
}: {
  assets: Asset[]
  lang: "ja" | "en"
  showAffiliation?: boolean
}) {
  const [sortKey, setSortKey] = useState<SortKey>("symbol")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = useMemo(() => {
    return [...assets].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case "symbol":
          cmp = a.symbol.localeCompare(b.symbol)
          break
        case "name":
          cmp = (lang === "ja" ? a.name : a.nameEn).localeCompare(lang === "ja" ? b.name : b.nameEn)
          break
        case "price":
          cmp = a.currentPrice - b.currentPrice
          break
        case "change":
          cmp = a.change24h - b.change24h
          break
        case "changePercent":
          cmp = a.changePercent24h - b.changePercent24h
          break
      }
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [assets, sortKey, sortDir, lang])

  const SortIcon = ({ col }: { col: SortKey }) => (
    <ArrowUpDown
      className={`w-3 h-3 ml-1 inline ${sortKey === col ? "text-edu-accent" : "text-edu-border"}`}
    />
  )

  return (
    <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10 bg-edu-surface">
          <tr className="border-b border-edu-border">
            <th
              className="text-left py-2.5 px-3 text-edu-muted font-medium cursor-pointer hover:text-edu-text transition-colors"
              onClick={() => toggleSort("symbol")}
            >
              {lang === "ja" ? "銘柄" : "Symbol"}
              <SortIcon col="symbol" />
            </th>
            <th
              className="text-left py-2.5 px-3 text-edu-muted font-medium cursor-pointer hover:text-edu-text transition-colors"
              onClick={() => toggleSort("name")}
            >
              {lang === "ja" ? "名称" : "Name"}
              <SortIcon col="name" />
            </th>
            {showAffiliation && (
              <th className="text-left py-2.5 px-3 text-edu-muted font-medium">
                {lang === "ja" ? "所属" : "Affiliation"}
              </th>
            )}
            <th
              className="text-right py-2.5 px-3 text-edu-muted font-medium cursor-pointer hover:text-edu-text transition-colors"
              onClick={() => toggleSort("price")}
            >
              {lang === "ja" ? "価格" : "Price"}
              <SortIcon col="price" />
            </th>
            <th
              className="text-right py-2.5 px-3 text-edu-muted font-medium cursor-pointer hover:text-edu-text transition-colors"
              onClick={() => toggleSort("change")}
            >
              {lang === "ja" ? "変動" : "24h Change"}
              <SortIcon col="change" />
            </th>
            <th
              className="text-right py-2.5 px-3 text-edu-muted font-medium cursor-pointer hover:text-edu-text transition-colors"
              onClick={() => toggleSort("changePercent")}
            >
              {lang === "ja" ? "変動%" : "24h %"}
              <SortIcon col="changePercent" />
            </th>
            <th className="text-center py-2.5 px-3 text-edu-muted font-medium">Chart</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a) => {
            const up = a.changePercent24h >= 0
            return (
              <tr
                key={a.symbol}
                className="border-b border-edu-border/30 hover:bg-edu-card-alt/50 transition-colors"
              >
                <td className="py-2.5 px-3 font-bold text-edu-accent tracking-wider">{a.symbol}</td>
                <td className="py-2.5 px-3 text-edu-text-dim">{lang === "ja" ? a.name : a.nameEn}</td>
                {showAffiliation && (
                  <td className="py-2.5 px-3 text-edu-muted text-[10px]">
                    {a.affiliation ?? "—"}
                  </td>
                )}
                <td className="py-2.5 px-3 text-right font-mono text-edu-text">
                  {formatPrice(a.currentPrice)}n
                </td>
                <td
                  className={`py-2.5 px-3 text-right font-mono ${up ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {formatChange(a.change24h)}
                </td>
                <td
                  className={`py-2.5 px-3 text-right font-mono font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {up ? "+" : ""}
                  {a.changePercent24h.toFixed(2)}%
                </td>
                <td className="py-2.5 px-3 flex justify-center">
                  <Sparkline prices={a.prices} width={64} height={24} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Narrative Events Timeline ───

function TimelineSection({ lang }: { lang: "ja" | "en" }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-edu-border" />
      <div className="space-y-4 pl-10">
        {NARRATIVE_EVENTS.map((ev, i) => (
          <m.div
            key={ev.date}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="relative"
          >
            <div className="absolute -left-6 top-2 w-2.5 h-2.5 rounded-full bg-edu-accent border-2 border-edu-bg shadow-[0_0_8px_rgba(200,164,78,0.4)]" />
            <div className="edu-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-edu-accent" />
                <span className="text-[10px] font-mono text-edu-muted">{ev.date}</span>
              </div>
              <p className="text-xs text-edu-text leading-relaxed">
                {lang === "ja" ? ev.descriptionJa : ev.descriptionEn}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {ev.affectedSymbols.map((sym) => (
                  <span key={sym} className="px-1.5 py-0.5 text-[9px] bg-edu-border/50 text-edu-accent rounded">
                    {sym}
                  </span>
                ))}
                <span
                  className={`px-1.5 py-0.5 text-[9px] rounded ${
                    ev.impact >= 0
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {ev.impact >= 0 ? "+" : ""}
                  {ev.impact.toFixed(1)}%
                </span>
              </div>
            </div>
          </m.div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page Component ───

export default function FinancePage() {
  const { lang } = useLang()
  const [selectedStock, setSelectedStock] = useState("FARUJA")
  const [selectedCrypto, setSelectedCrypto] = useState("ACARL")
  const [stockPeriod, setStockPeriod] = useState<number>(365)
  const [cryptoPeriod, setCryptoPeriod] = useState<number>(365)

  const allAssets = useMemo(() => getAllAssets(), [])
  const stocks = useMemo(() => allAssets.filter((a) => a.type === "stock"), [allAssets])
  const indices = useMemo(() => allAssets.filter((a) => a.type === "index"), [allAssets])
  const cryptos = useMemo(() => allAssets.filter((a) => a.type === "crypto"), [allAssets])

  const stockAsset = useMemo(() => getAsset(selectedStock), [selectedStock])
  const cryptoAsset = useMemo(() => getAsset(selectedCrypto), [selectedCrypto])

  // Gainers / Losers
  const topGainers = useMemo(
    () => [...allAssets].sort((a, b) => b.changePercent24h - a.changePercent24h).slice(0, 3),
    [allAssets]
  )
  const topLosers = useMemo(
    () => [...allAssets].sort((a, b) => a.changePercent24h - b.changePercent24h).slice(0, 3),
    [allAssets]
  )

  const sectionFade = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <div className="min-h-screen bg-edu-bg flex flex-col">
      {/* ─── Ticker Bar ─── */}
      <div className="sticky top-11 z-40">
        <TickerBar assets={allAssets} lang={lang} />
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-10">
        {/* ─── Hero Section ─── */}
        <m.section {...sectionFade} className="relative">
          <div className="edu-mesh-bg rounded-xl p-6 sm:p-8 border border-edu-border">
            <div className="edu-particles">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="dot" />
              ))}
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-edu-accent/15 border border-edu-accent/30">
                  <Zap className="w-3.5 h-3.5 text-edu-accent" />
                  <span className="text-[10px] font-semibold text-edu-accent tracking-widest uppercase">
                    Live
                  </span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-edu-text tracking-tight mb-1">
                {lang === "ja" ? "E16 マーケット" : "E16 Market"}
              </h1>
              <p className="text-sm text-edu-text-dim mb-6 max-w-lg">
                {lang === "ja"
                  ? "エターナル・ドミニオン・ユニバースの金融市場データ。全資産のリアルタイム価格、N-トークン暗号通貨、文明圏指数を一覧。"
                  : "Financial market data from the Eternal Dominion Universe. Real-time prices for all assets, N-Token cryptocurrencies, and civilization indices."}
              </p>
              <StatsSection assets={allAssets} lang={lang} />
            </div>
          </div>
        </m.section>

        {/* ─── Top Gainers / Losers ─── */}
        <m.section {...sectionFade}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gainers */}
            <div className="edu-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-edu-muted tracking-wider uppercase">
                  {lang === "ja" ? "上昇率トップ" : "Top Gainers"}
                </span>
              </div>
              <div className="space-y-2">
                {topGainers.map((a) => (
                  <div key={a.symbol} className="flex items-center justify-between py-1.5">
                    <div>
                      <span className="text-xs font-bold text-edu-accent">{a.symbol}</span>
                      <span className="text-[10px] text-edu-muted ml-2">{lang === "ja" ? a.name : a.nameEn}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-edu-text">{formatPrice(a.currentPrice)}n</span>
                      <span className="text-xs font-mono text-emerald-400 ml-2">
                        +{a.changePercent24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Losers */}
            <div className="edu-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-edu-muted tracking-wider uppercase">
                  {lang === "ja" ? "下落率トップ" : "Top Losers"}
                </span>
              </div>
              <div className="space-y-2">
                {topLosers.map((a) => (
                  <div key={a.symbol} className="flex items-center justify-between py-1.5">
                    <div>
                      <span className="text-xs font-bold text-edu-accent">{a.symbol}</span>
                      <span className="text-[10px] text-edu-muted ml-2">{lang === "ja" ? a.name : a.nameEn}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-edu-text">{formatPrice(a.currentPrice)}n</span>
                      <span className="text-xs font-mono text-rose-400 ml-2">
                        {a.changePercent24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </m.section>

        {/* ─── Featured Charts ─── */}
        <m.section {...sectionFade} className="space-y-8">
          {/* Stock Chart */}
          <div className="edu-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5 text-edu-accent" />
                <div>
                  <h2 className="text-sm font-bold text-edu-text">
                    {lang === "ja" ? "企業株" : "Corporate Stock"}
                  </h2>
                  <p className="text-[10px] text-edu-muted">
                    {stockAsset
                      ? `${stockAsset.symbol} — ${lang === "ja" ? stockAsset.name : stockAsset.nameEn}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Stock selector */}
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="bg-edu-card-alt border border-edu-border rounded-md px-2 py-1 text-xs text-edu-text focus:outline-none focus:ring-1 focus:ring-edu-accent"
                >
                  {stocks.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} — {lang === "ja" ? s.name : s.nameEn}
                    </option>
                  ))}
                </select>
                {/* Time period */}
                <div className="flex gap-0.5">
                  {TIME_PERIODS.map((tp) => (
                    <button
                      key={tp.id}
                      onClick={() => setStockPeriod(tp.days)}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                        stockPeriod === tp.days
                          ? "bg-edu-accent text-edu-bg"
                          : "bg-edu-card-alt text-edu-muted hover:text-edu-text border border-edu-border"
                      }`}
                    >
                      {tp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price info */}
            {stockAsset && (
              <div className="flex items-end gap-4 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-edu-text tracking-tight font-mono">
                  {formatPrice(stockAsset.currentPrice)}n
                </span>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-semibold font-mono ${
                      stockAsset.changePercent24h >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatChange(stockAsset.change24h)} ({stockAsset.changePercent24h >= 0 ? "+" : ""}
                    {stockAsset.changePercent24h.toFixed(2)}%)
                  </span>
                  <span className="text-[10px] text-edu-muted">
                    {lang === "ja" ? "24時間変動" : "24h Change"}
                  </span>
                </div>
              </div>
            )}

            {stockAsset && <InteractiveChart asset={stockAsset} periodDays={stockPeriod} lang={lang} />}
          </div>

          {/* N-Token Crypto Chart */}
          <div className="edu-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-edu-cyan" />
                <div>
                  <h2 className="text-sm font-bold text-edu-text">
                    {lang === "ja" ? "N-トークン暗号通貨" : "N-Token Crypto"}
                  </h2>
                  <p className="text-[10px] text-edu-muted">
                    {cryptoAsset
                      ? `${cryptoAsset.symbol} — ${lang === "ja" ? cryptoAsset.name : cryptoAsset.nameEn}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Crypto selector */}
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="bg-edu-card-alt border border-edu-border rounded-md px-2 py-1 text-xs text-edu-text focus:outline-none focus:ring-1 focus:ring-edu-accent"
                >
                  {cryptos.map((c) => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.symbol} — {lang === "ja" ? c.name : c.nameEn}
                    </option>
                  ))}
                </select>
                {/* Time period */}
                <div className="flex gap-0.5">
                  {TIME_PERIODS.map((tp) => (
                    <button
                      key={tp.id}
                      onClick={() => setCryptoPeriod(tp.days)}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                        cryptoPeriod === tp.days
                          ? "bg-edu-cyan text-edu-bg"
                          : "bg-edu-card-alt text-edu-muted hover:text-edu-text border border-edu-border"
                      }`}
                    >
                      {tp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price info */}
            {cryptoAsset && (
              <div className="flex items-end gap-4 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-edu-text tracking-tight font-mono">
                  {formatPrice(cryptoAsset.currentPrice)}n
                </span>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-semibold font-mono ${
                      cryptoAsset.changePercent24h >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatChange(cryptoAsset.change24h)} ({cryptoAsset.changePercent24h >= 0 ? "+" : ""}
                    {cryptoAsset.changePercent24h.toFixed(2)}%)
                  </span>
                  <span className="text-[10px] text-edu-muted">
                    {lang === "ja" ? "24時間変動" : "24h Change"}
                  </span>
                </div>
              </div>
            )}

            {cryptoAsset && <InteractiveChart asset={cryptoAsset} periodDays={cryptoPeriod} lang={lang} />}
          </div>
        </m.section>

        {/* ─── Stock Table ─── */}
        <m.section {...sectionFade}>
          <div className="edu-card">
            <div className="p-4 border-b border-edu-border/50">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-edu-accent" />
                <h2 className="text-sm font-bold text-edu-text">
                  {lang === "ja" ? "企業株・指数一覧" : "Stocks & Indices"}
                </h2>
              </div>
            </div>
            <AssetTable assets={[...stocks, ...indices]} lang={lang} />
          </div>
        </m.section>

        {/* ─── N-Token Table ─── */}
        <m.section {...sectionFade}>
          <div className="edu-card">
            <div className="p-4 border-b border-edu-border/50">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-edu-cyan" />
                <h2 className="text-sm font-bold text-edu-text">
                  {lang === "ja" ? "N-トークン一覧" : "N-Token Crypto"}
                </h2>
                <span className="text-[10px] text-edu-muted ml-2">
                  {lang === "ja"
                    ? "キャラクターに紐付くブロックチェーン暗号通貨"
                    : "Blockchain cryptocurrency tied to characters"}
                </span>
              </div>
            </div>
            <AssetTable assets={cryptos} lang={lang} showAffiliation />
          </div>
        </m.section>

        {/* ─── Narrative Events Timeline ─── */}
        <m.section {...sectionFade}>
          <div className="edu-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-4 h-4 text-edu-accent" />
              <h2 className="text-sm font-bold text-edu-text">
                {lang === "ja" ? "ナラティブイベント" : "Narrative Events"}
              </h2>
              <span className="text-[10px] text-edu-muted ml-2">
                {lang === "ja"
                  ? "価格に影響を与えた重要な出来事"
                  : "Key events that affected market prices"}
              </span>
            </div>
            <TimelineSection lang={lang} />
          </div>
        </m.section>

        {/* ─── Civilization Indices ─── */}
        <m.section {...sectionFade}>
          <div className="edu-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe2 className="w-4 h-4 text-edu-accent" />
              <h2 className="text-sm font-bold text-edu-text">
                {lang === "ja" ? "文明圏GDP指数" : "Civilization GDP Indices"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {indices
                .filter((idx) => idx.sector === "Civilization")
                .map((idx) => {
                  const up = idx.changePercent24h >= 0
                  return (
                    <div key={idx.symbol} className="edu-card p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-edu-accent tracking-wider">
                          {idx.symbol}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            up ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {up ? "+" : ""}
                          {idx.changePercent24h.toFixed(2)}%
                        </span>
                      </div>
                      <span className="text-[11px] text-edu-text-dim">
                        {lang === "ja" ? idx.name : idx.nameEn}
                      </span>
                      <span className="text-lg font-bold font-mono text-edu-text">
                        {formatPrice(idx.currentPrice)}n
                      </span>
                      <Sparkline prices={idx.prices} width={120} height={30} />
                    </div>
                  )
                })}
            </div>
          </div>
        </m.section>
      </main>

      {/* ─── Ticker Scroll Animation Styles (injected once) ─── */}
      <style jsx global>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker-scroll {
          animation: ticker-scroll 60s linear infinite;
        }
        .animate-ticker-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
