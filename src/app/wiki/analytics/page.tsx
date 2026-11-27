"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X } from "lucide-react"
import { useLang } from "@/lib/use-lang"
import { characterMatch, fetchCharacterJSON } from "../_components/character-search"
import type { DirectoryRow } from "../_components/character-directory"
import { CharacterPortrait } from "../_components/character-portrait"
import type { Portrait } from "../_components/portrait-design"
import { describe, histogram, kde, pearson, spearman, ols, corrCI, cohenD, etaSquared, gini, theil, lorenz, topShare, palma, robustZ, slog, sorted, quantileSorted, ranks, type Describe } from "./stats"

interface Row { portrait?: Portrait; status?: string; aliases?: string[]; id: string; cid: string; name: string; nameEn: string; formal: string; formalEn: string; region: string; regionEn: string; macro: string; role: string; roleEn: string; h: number; w: number; wi: number; a: number; assets: number; debt: number; care: number; pressure: number; opportunity: number; expression: number }
interface VarDef { key: string; ja: string; en: string; get: (r: Row) => number; fmt: (v: number) => string }

const N10M = 10_000_000
const pt = (v: number) => v.toFixed(1)
const VARS: VarDef[] = [
  { key: "h", ja: "健康・バイオ", en: "Health", get: (r) => 100 * r.h, fmt: pt },
  { key: "wi", ja: "資産指数", en: "Wealth index", get: (r) => 100 * r.wi, fmt: pt },
  { key: "a", ja: "権威・名声", en: "Authority", get: (r) => 100 * r.a, fmt: pt },
  { key: "w", ja: "純資産（符号付きlog₁₀ n）", en: "Net wealth (signed log₁₀ n)", get: (r) => slog(r.w * N10M), fmt: (v) => v.toFixed(2) },
  { key: "assets", ja: "総資産（log₁₀ n）", en: "Assets (log₁₀ n)", get: (r) => Math.log10(1 + r.assets * N10M), fmt: (v) => v.toFixed(2) },
  { key: "debt", ja: "負債（log₁₀ n）", en: "Debt (log₁₀ n)", get: (r) => Math.log10(1 + r.debt * N10M), fmt: (v) => v.toFixed(2) },
  { key: "care", ja: "医療アクセス", en: "Care access", get: (r) => 100 * r.care, fmt: pt },
  { key: "pressure", ja: "環境負荷", en: "Env. pressure", get: (r) => 100 * r.pressure, fmt: pt },
  { key: "opportunity", ja: "経済機会", en: "Opportunity", get: (r) => 100 * r.opportunity, fmt: pt },
  { key: "expression", ja: "形質発現", en: "Trait expression", get: (r) => 100 * r.expression, fmt: pt },
]
const PALETTE = ["#22d3ee", "#f59e0b", "#a78bfa", "#34d399", "#f472b6", "#60a5fa", "#facc15", "#fb7185", "#4ade80", "#c084fc", "#2dd4bf", "#fca5a5"]

type GroupKey = "macro" | "region" | "role" | "wq" | "hq" | "aq"
const quint = (rows: Row[], f: (r: Row) => number, k: number, label: string) => {
  const s = sorted(rows.map(f))
  const cuts = Array.from({ length: k - 1 }, (_, i) => quantileSorted(s, (i + 1) / k))
  return (r: Row) => label + (cuts.filter((c) => f(r) > c).length + 1)
}
/** Groups with fewer than 5 people are pooled so that deviations are not driven by single individuals. */
function grouper(rows: Row[], key: GroupKey, en: boolean): (r: Row) => string {
  const base = baseGrouper(rows, key, en)
  const count = new Map<string, number>()
  for (const r of rows) { const k = base(r); count.set(k, (count.get(k) ?? 0) + 1) }
  const pooled = en ? "Small groups (n<5)" : "少数群（n<5）"
  return (r) => { const k = base(r); return (count.get(k) ?? 0) < 5 ? pooled : k }
}
function baseGrouper(rows: Row[], key: GroupKey, en: boolean): (r: Row) => string {
  if (key === "macro") return (r) => r.macro
  if (key === "region") return (r) => (en ? r.regionEn : r.region) || "—"
  if (key === "role") {
    const count = new Map<string, number>()
    for (const r of rows) count.set(r.role, (count.get(r.role) ?? 0) + 1)
    const top = new Set([...count].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k]) => k))
    return (r) => (top.has(r.role) ? (en ? r.roleEn : r.role) || "—" : en ? "Other roles" : "その他の職務")
  }
  if (key === "wq") return quint(rows, (r) => r.w, 5, en ? "Wealth Q" : "資産 第")
  if (key === "hq") return quint(rows, (r) => r.h, 5, en ? "Health Q" : "健康 第")
  return quint(rows, (r) => r.a, 5, en ? "Authority Q" : "名声 第")
}

// ── UI primitives ───────────────────────────────────────────────────────
function Glass({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={"relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-5 shadow-[0_24px_80px_-32px_rgba(0,0,0,.8)] backdrop-blur-xl sm:p-6 " + className}>{children}</section>
}
function Seg<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-black/20 p-1">
      {options.map(([k, label]) => (
        <button key={k} type="button" onClick={() => onChange(k)} aria-pressed={value === k}
          className={"rounded-xl px-3 py-1.5 text-xs transition " + (value === k ? "bg-gradient-to-r from-cyan-400/30 to-violet-400/30 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.15)]" : "text-edu-muted hover:text-edu-text")}>
          {label}
        </button>
      ))}
    </div>
  )
}
function Pick({ value, onChange, label, en }: { value: string; onChange: (v: string) => void; label: string; en: boolean }) {
  return (
    <label className="flex items-center gap-2 text-xs text-edu-muted">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-2.5 py-1.5 text-edu-text focus:border-cyan-300/50 focus:outline-none">
        {VARS.map((v) => <option key={v.key} value={v.key}>{en ? v.en : v.ja}</option>)}
      </select>
    </label>
  )
}
function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
      <p className="text-[10px] uppercase tracking-wider text-edu-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-edu-text">{value}</p>
      {sub && <p className="text-[10px] tabular-nums text-edu-muted">{sub}</p>}
    </div>
  )
}

// ── Charts ──────────────────────────────────────────────────────────────
function Distribution({ values, mark, d, fmt, en }: { values: number[]; mark?: number; d: Describe; fmt: (v: number) => string; en: boolean }) {
  const W = 640, H = 240, P = 28
  const lo = d.min, hi = d.max === d.min ? d.min + 1 : d.max
  const hist = histogram(values, lo, hi), dens = kde(values, lo, hi, 160)
  const x = (v: number) => P + ((v - lo) / (hi - lo)) * (W - 2 * P)
  const maxC = Math.max(...hist.counts), scaleD = (maxC / values.length / hist.step) || 1
  const yC = (c: number) => H - P - (c / maxC) * (H - 2 * P)
  const yD = (v: number) => H - P - (v / scaleD) * (H - 2 * P)
  const ticks: [string, number][] = [["P10", d.p10], ["Q1", d.q1], [en ? "Median" : "中央値", d.median], ["Q3", d.q3], ["P90", d.p90]]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={en ? "Histogram with density" : "ヒストグラムと密度"}>
      <defs>
        <linearGradient id="bar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity=".85" /><stop offset="1" stopColor="#6366f1" stopOpacity=".25" /></linearGradient>
      </defs>
      {hist.counts.map((c, i) => <rect key={i} x={x(lo + i * hist.step) + 0.5} y={yC(c)} width={Math.max(0.5, x(lo + (i + 1) * hist.step) - x(lo + i * hist.step) - 1)} height={H - P - yC(c)} rx="2" fill="url(#bar)" />)}
      <polyline fill="none" stroke="#f0abfc" strokeWidth="2" points={dens.grid.map((g, i) => `${x(g).toFixed(1)},${yD(dens.density[i]!).toFixed(1)}`).join(" ")} />
      {ticks.map(([t, v]) => <g key={t}><line x1={x(v)} x2={x(v)} y1={P - 6} y2={H - P} stroke="white" strokeOpacity={t.length > 3 ? ".6" : ".25"} strokeDasharray="3 3" /><text x={x(v)} y={P - 10} textAnchor="middle" fontSize="9" fill="currentColor" opacity=".7">{t}</text></g>)}
      <line x1={x(d.mean)} x2={x(d.mean)} y1={P} y2={H - P} stroke="#facc15" strokeWidth="1.5" />
      {mark !== undefined && <g><line x1={x(mark)} x2={x(mark)} y1={P} y2={H - P} stroke="#34d399" strokeWidth="2.5" /><circle cx={x(mark)} cy={P} r="4" fill="#34d399" /></g>}
      <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="currentColor" strokeOpacity=".2" />
      <text x={P} y={H - 8} fontSize="9" fill="currentColor" opacity=".6">{fmt(lo)}</text>
      <text x={W - P} y={H - 8} textAnchor="end" fontSize="9" fill="currentColor" opacity=".6">{fmt(hi)}</text>
    </svg>
  )
}

function Ridgeline({ groups, lo, hi, mark }: { groups: [string, number[]][]; lo: number; hi: number; mark?: number }) {
  const W = 640, row = 30, P = 150, H = groups.length * row + 40
  const x = (v: number) => P + ((v - lo) / (hi - lo || 1)) * (W - P - 16)
  const curves = groups.map(([g, v]) => [g, v.length > 2 ? kde(v, lo, hi, 90) : null, v.length] as const)
  const peak = Math.max(...curves.map(([, k]) => (k ? Math.max(...k.density) : 0))) || 1
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="ridgeline">
      {curves.map(([g, k, n], i) => {
        const base = 30 + (i + 1) * row
        const color = PALETTE[i % PALETTE.length]!
        return (
          <g key={g}>
            <text x={P - 8} y={base - 4} textAnchor="end" fontSize="10" fill="currentColor" opacity=".8">{g.length > 22 ? g.slice(0, 21) + "…" : g} <tspan opacity=".5">{n}</tspan></text>
            {k && <path d={`M${x(lo)},${base} ` + k.grid.map((v, j) => `L${x(v).toFixed(1)},${(base - (k.density[j]! / peak) * row * 1.8).toFixed(1)}`).join(" ") + ` L${x(hi)},${base} Z`} fill={color} fillOpacity=".22" stroke={color} strokeWidth="1.3" />}
          </g>
        )
      })}
      {mark !== undefined && <line x1={x(mark)} x2={x(mark)} y1={20} y2={H - 6} stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />}
    </svg>
  )
}

function Scatter({ rows, xs, ys, color, labels, mark, onPick }: { rows: Row[]; xs: number[]; ys: number[]; color: string[]; labels: [string, string][]; mark?: number; onPick: (i: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const W = 640, H = 420, P = 36
  const bx = useMemo(() => describe(xs), [xs]), by = useMemo(() => describe(ys), [ys])
  const sx = (v: number) => P + ((v - bx.min) / (bx.max - bx.min || 1)) * (W - 2 * P)
  const sy = (v: number) => H - P - ((v - by.min) / (by.max - by.min || 1)) * (H - 2 * P)
  const fit = useMemo(() => ols(xs, ys), [xs, ys])
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const dpr = window.devicePixelRatio || 1
    c.width = W * dpr; c.height = H * dpr
    const g = c.getContext("2d")
    if (!g) return
    g.scale(dpr, dpr); g.clearRect(0, 0, W, H)
    g.strokeStyle = "rgba(255,255,255,.07)"
    for (let i = 0; i <= 4; i++) { const yy = P + (i * (H - 2 * P)) / 4, xx = P + (i * (W - 2 * P)) / 4; g.beginPath(); g.moveTo(P, yy); g.lineTo(W - P, yy); g.stroke(); g.beginPath(); g.moveTo(xx, P); g.lineTo(xx, H - P); g.stroke() }
    g.globalCompositeOperation = "lighter"
    for (let i = 0; i < xs.length; i++) { g.fillStyle = color[i]! + "aa"; g.beginPath(); g.arc(sx(xs[i]!), sy(ys[i]!), 2.4, 0, 7); g.fill() }
    g.globalCompositeOperation = "source-over"
    g.strokeStyle = "#fde68a"; g.lineWidth = 1.5; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(sx(bx.min), sy(fit.a + fit.b * bx.min)); g.lineTo(sx(bx.max), sy(fit.a + fit.b * bx.max)); g.stroke(); g.setLineDash([])
    for (const i of [mark, hover]) if (i !== undefined && i !== null) { g.strokeStyle = i === mark ? "#34d399" : "#fff"; g.lineWidth = 2; g.beginPath(); g.arc(sx(xs[i]!), sy(ys[i]!), 7, 0, 7); g.stroke() }
  })
  const nearest = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect(), mx = ((e.clientX - r.left) / r.width) * W, my = ((e.clientY - r.top) / r.height) * H
    let best = -1, bd = 14 * 14
    for (let i = 0; i < xs.length; i++) { const d = (sx(xs[i]!) - mx) ** 2 + (sy(ys[i]!) - my) ** 2; if (d < bd) { bd = d; best = i } }
    return best < 0 ? null : best
  }
  return (
    <div className="relative">
      <canvas ref={ref} className="w-full cursor-crosshair rounded-2xl bg-black/20" style={{ aspectRatio: `${W}/${H}` }}
        onMouseMove={(e) => setHover(nearest(e))} onMouseLeave={() => setHover(null)} onClick={(e) => { const i = nearest(e); if (i !== null) onPick(i) }} />
      <div className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-edu-muted">{labels[0]![0]} →</div>
      <div className="pointer-events-none absolute left-2 top-2 text-[10px] text-edu-muted">↑ {labels[1]![0]}</div>
      {hover !== null && (
        <div className="pointer-events-none absolute right-3 top-3 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-xs backdrop-blur">
          <p className="font-medium text-edu-text">{rows[hover]!.name}</p>
          <p className="tabular-nums text-edu-muted">{labels[0]![1]} {xs[hover]!.toFixed(2)} · {labels[1]![1]} {ys[hover]!.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}

function Heatmap({ matrix, names, onPick, active }: { matrix: number[][]; names: string[]; onPick: (i: number, j: number) => void; active: [number, number] }) {
  const n = names.length, cell = 34, P = 130, W = P + n * cell + 4
  const col = (r: number) => (r >= 0 ? `rgba(34,211,238,${Math.abs(r).toFixed(3)})` : `rgba(244,114,182,${Math.abs(r).toFixed(3)})`)
  return (
    <svg viewBox={`0 0 ${W} ${P + n * cell + 4}`} className="w-full" role="img" aria-label="correlation heatmap">
      {names.map((nm, i) => <text key={"r" + i} x={P - 6} y={P + i * cell + cell / 2 + 3} textAnchor="end" fontSize="10" fill="currentColor" opacity=".8">{nm}</text>)}
      {names.map((nm, j) => <text key={"c" + j} transform={`translate(${P + j * cell + cell / 2},${P - 6}) rotate(-50)`} fontSize="10" fill="currentColor" opacity=".8">{nm}</text>)}
      {matrix.map((row, i) => row.map((r, j) => (
        <g key={i + "-" + j} onClick={() => onPick(i, j)} className="cursor-pointer">
          <rect x={P + j * cell + 1} y={P + i * cell + 1} width={cell - 2} height={cell - 2} rx="6" fill={col(r)} stroke={active[0] === j && active[1] === i ? "#fff" : "transparent"} strokeWidth="2" />
          <text x={P + j * cell + cell / 2} y={P + i * cell + cell / 2 + 3} textAnchor="middle" fontSize="9" fill="white" opacity=".9">{i === j ? "" : r.toFixed(2)}</text>
        </g>
      )))}
    </svg>
  )
}

function LorenzChart({ curves }: { curves: [string, [number, number][]][] }) {
  const S = 300, P = 26, s = (v: number) => P + v * (S - 2 * P)
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-sm" role="img" aria-label="Lorenz curves">
      <rect x={P} y={P} width={S - 2 * P} height={S - 2 * P} fill="none" stroke="currentColor" strokeOpacity=".15" />
      <line x1={s(0)} y1={S - s(0)} x2={s(1)} y2={S - s(1)} stroke="currentColor" strokeOpacity=".35" strokeDasharray="4 4" />
      {curves.map(([g, pts], i) => <polyline key={g} fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth="2" points={pts.map(([a, b]) => `${s(a).toFixed(1)},${(S - s(b)).toFixed(1)}`).join(" ")} />)}
    </svg>
  )
}

// ── Page ────────────────────────────────────────────────────────────────
export default function AnalyticsStudio() {
  const { lang } = useLang()
  const en = lang === "en"
  const t = (ja: string, e: string) => (en ? e : ja)
  const router = useRouter()
  const [data, setData] = useState<{ day: number; source: string; rows: Row[]; snapshot?: boolean } | null>(null)
  const [error, setError] = useState(false)
  const [directory, setDirectory] = useState<DirectoryRow[]>([])
  const [tab, setTab] = useState<"dist" | "dev" | "corr" | "ineq" | "out">("dist")
  const [v1, setV1] = useState("h"), [vx, setVx] = useState("wi"), [vy, setVy] = useState("a")
  const [group, setGroup] = useState<GroupKey>("macro")
  const [transform, setTransform] = useState<"raw" | "z" | "pct">("raw")
  const [method, setMethod] = useState<"pearson" | "spearman">("pearson")
  const [colorBy, setColorBy] = useState<"group" | "var">("group")
  const [query, setQuery] = useState("")
  const [focus, setFocus] = useState<string | null>(null)

  useEffect(() => {
    fetchCharacterJSON<{ rows: DirectoryRow[] }>("/api/characters/directory", d => Array.isArray(d.rows) && d.rows.every(r => typeof r.id === "string" && !!r.state && [r.state.h,r.state.wi,r.state.a].every(Number.isFinite))).then(d => setDirectory(d.rows)).catch(() => {})
    fetchCharacterJSON<{ day: number; source: string; rows: Row[]; snapshot?: boolean }>("/api/characters/population", d => Array.isArray(d.rows) && d.rows.every(r => typeof r.cid === "string" && Number.isFinite(r.h) && Number.isFinite(r.w) && Number.isFinite(r.a))).then(setData).catch(() => setError(true))
  }, [])
  const rows = data?.rows ?? []
  const focusIdx = focus ? rows.findIndex((r) => r.cid === focus) : -1
  const mark = focusIdx >= 0 ? focusIdx : undefined
  const V = (k: string) => VARS.find((v) => v.key === k)!
  const raw = useMemo(() => Object.fromEntries(VARS.map((v) => [v.key, rows.map(v.get)])), [rows])
  const descs = useMemo(() => Object.fromEntries(VARS.map((v) => [v.key, describe(raw[v.key] ?? [])])), [raw])
  const transformed = (k: string) => {
    const x = raw[k] ?? [], d = descs[k]!
    if (transform === "z") return x.map((v) => (d.sd ? (v - d.mean) / d.sd : 0))
    if (transform === "pct") { const r = ranks(x); return r.map((v) => (100 * (v - 0.5)) / x.length) }
    return x
  }
  const g = useMemo(() => grouper(rows, group, en), [rows, group, en])
  const labelsOf = useMemo(() => rows.map(g), [rows, g])
  const groupNames = useMemo(() => [...new Set(labelsOf)].sort((a, b) => a.localeCompare(b, "ja")), [labelsOf])
  const matches = useMemo(() => {
    const activePages = new Set(rows.map(r => r.id))
    const candidates: { id: string; cid: string | null; name: string; nameEn: string; macro: string; fields: (string | undefined)[] }[] = [
      ...rows.map(r => ({ id: r.id, cid: r.cid, name: r.name, nameEn: r.nameEn, macro: r.macro, fields: [r.name, r.nameEn, r.formal, r.formalEn, r.cid, r.id, ...(r.aliases ?? [])] })),
      ...directory.filter(r => !activePages.has(r.id)).map(r => ({ id: r.id, cid: null, name: r.name, nameEn: r.nameEn, macro: r.regionEn, fields: [r.id, r.name, r.nameEn, ...(r.aliases ?? [])] })),
    ]
    return candidates.map(r => ({ r, score: characterMatch(query, r.fields) })).filter(x => x.score >= 0).sort((a,b) => b.score - a.score).slice(0, 12).map(x => x.r)
  }, [rows, directory, query])
  const pickMatch = (r: (typeof matches)[number]) => {
    if (r.cid) setFocus(r.cid)
    else router.push("/wiki/" + encodeURIComponent(r.id))
    setQuery("")
  }

  if (error) return <main className="min-h-screen bg-edu-bg px-4 pt-24 text-center text-edu-muted">{t("人物データの取得に失敗しました。", "Could not load character data.")} <button className="ml-2 underline" onClick={() => window.location.reload()}>{t("再読み込み", "Retry")}</button></main>

  const focusRow = mark !== undefined ? rows[mark] : undefined
  const xs1 = transformed(v1), d1 = describe(xs1)
  const fmt1 = transform === "raw" ? V(v1).fmt : (v: number) => v.toFixed(2)
  const byGroup = (x: number[]) => groupNames.map((gn) => [gn, x.filter((_, i) => labelsOf[i] === gn)] as [string, number[]])

  return (
    <main className="relative min-h-screen overflow-hidden bg-edu-bg px-4 pb-24 pt-20 text-edu-text">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute right-[-10%] top-1/3 h-[480px] w-[480px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-1/3 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>
      <div className="relative mx-auto max-w-6xl space-y-5">
        <Link href="/wiki?category=キャラクター" className="inline-flex items-center gap-1 text-xs text-edu-muted hover:text-cyan-200"><ArrowLeft className="h-3.5 w-3.5" />{t("キャラクター名鑑", "Character directory")}</Link>
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[.35em] text-cyan-200/70">E16 · Population Intelligence</p>
            <h1 className="mt-2 bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-3xl font-semibold text-transparent sm:text-5xl">{t("人口分析スタジオ", "Population Analytics Studio")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-edu-muted">{t("全登録人物のモデル値を分析。原典で現代対象とされない人物も現代環境を仮定して計算するため、実際のE528人口とは異なります。", "Analyze all registered characters. Non-current source identities use conditional values in today's environment; this is not a literal E528 census.")}</p>
          </div>
          <div className="text-right text-[11px] text-edu-muted tabular-nums">
            {data ? <>{data.snapshot && <>{t("公開時の計算値","Build snapshot")} · </>}E528 · {t("標準日", "day")} {data.day + 1}<br />N = {rows.length.toLocaleString()}</> : t("計算中…", "Computing…")}
          </div>
        </header>

        {/* Spotlight */}
        <Glass className="!p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 basis-full flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-edu-muted" />
              <input value={query} aria-label={t("人物検索", "Search people")} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && matches[0]) { e.preventDefault(); pickMatch(matches[0]) } if (e.key === "Escape") setQuery("") }} placeholder={t("人物をスポットライト（名前・ID）", "Spotlight a person (name or ID)")}
                className="w-full rounded-2xl border border-white/10 bg-black/30 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/10" />
              {query.trim() && matches.length === 0 && <p className="mt-2 px-2 text-xs text-edu-muted">{data ? t("該当する人物がいません。別名・IDでも検索できます。", "No matches. Try an alias or ID.") : t("人物データを読み込み中…", "Loading characters…")}</p>}
              {matches.length > 0 && (
                <div className="relative mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1020]/95 shadow-2xl">
                  {matches.map((r) => <button key={r.cid ?? r.id} type="button" onClick={() => pickMatch(r)} className="block w-full px-4 py-2 text-left text-sm hover:bg-white/5">{en && r.nameEn ? r.nameEn : r.name} <span className="text-xs text-edu-muted">{r.cid ?? t("現在値なし・Wikiへ", "No current values · Wiki")} · {r.macro}</span></button>)}
                </div>
              )}
            </div>
            {focusRow && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-sm">
                {focusRow.portrait && <CharacterPortrait key={focusRow.cid} portrait={focusRow.portrait} name={focusRow.name} size={36} className="h-9 w-9" />}
                <Link href={"/wiki/" + encodeURIComponent(focusRow.id)} className="text-emerald-100 hover:underline">{en && focusRow.nameEn ? focusRow.nameEn : focusRow.name}</Link>
                <button type="button" aria-label={t("解除", "Clear")} onClick={() => setFocus(null)}><X className="h-4 w-4 text-emerald-200" /></button>
              </div>
            )}
          </div>
          {focusRow && focusRow.status !== "current" && <p className="mt-2 text-xs text-edu-muted">{t("原典現代未確認：現在環境を仮定したモデル値", "Conditional model values, not confirmed current in canon")}</p>}
          {focusRow && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {VARS.map((v) => {
                const x = raw[v.key]![mark!]!, d = descs[v.key]!, z = d.sd ? (x - d.mean) / d.sd : 0
                const pct = (100 * (raw[v.key] ?? []).filter((y) => y < x).length) / rows.length
                return (
                  <div key={v.key} className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
                    <p className="truncate text-[10px] text-edu-muted">{en ? v.en : v.ja}</p>
                    <p className="text-base font-semibold tabular-nums">{v.fmt(x)}</p>
                    <p className={"text-[10px] tabular-nums " + (z >= 0 ? "text-cyan-300" : "text-pink-300")}>z {z >= 0 ? "+" : ""}{z.toFixed(2)} · P{pct.toFixed(0)}</p>
                  </div>
                )
              })}
            </div>
          )}
        </Glass>

        {/* KPIs */}
        {data && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            <Stat label={t("人口", "Population")} value={rows.length.toLocaleString()} sub={`${new Set(rows.map((r) => r.regionEn)).size} ${t("地域", "regions")}`} />
            <Stat label={t("健康 中央値", "Median health")} value={pt(descs.h!.median)} sub={`SD ${descs.h!.sd.toFixed(1)}`} />
            <Stat label={t("資産指数 中央値", "Median wealth idx")} value={pt(descs.wi!.median)} sub={`SD ${descs.wi!.sd.toFixed(1)}`} />
            <Stat label={t("名声 中央値", "Median authority")} value={pt(descs.a!.median)} sub={`SD ${descs.a!.sd.toFixed(1)}`} />
            <Stat label={t("総資産 Gini", "Asset Gini")} value={gini(rows.map((r) => r.assets)).toFixed(3)} />
            <Stat label={t("上位1%シェア", "Top 1% share")} value={(100 * topShare(rows.map((r) => r.w), 0.01)).toFixed(1) + "%"} sub={t("正の純資産", "positive net wealth")} />
            <Stat label={t("債務超過率", "Negative net worth")} value={(100 * rows.filter((r) => r.w < 0).length / Math.max(1, rows.length)).toFixed(1) + "%"} />
            <Stat label={t("健康×名声 r", "Health×authority r")} value={pearson(raw.h ?? [], raw.a ?? []).toFixed(2)} />
          </div>
        )}

        <div className="sticky top-14 z-20 -mx-1 flex flex-wrap items-center gap-3 rounded-2xl px-1 py-2 backdrop-blur-xl sm:top-16">
          <Seg value={tab} onChange={setTab} options={[["dist", t("分布", "Distribution")], ["dev", t("偏差・群比較", "Deviation")], ["corr", t("相関・散布", "Correlation")], ["ineq", t("格差", "Inequality")], ["out", t("外れ値", "Outliers")]]} />
          <Seg value={group} onChange={setGroup} options={[["macro", t("大地域", "Macro")], ["region", t("地域", "Region")], ["role", t("職務", "Role")], ["wq", t("資産5分位", "Wealth Q5")], ["hq", t("健康5分位", "Health Q5")], ["aq", t("名声5分位", "Auth. Q5")]]} />
        </div>

        {!data ? (
          <div className="grid gap-4 md:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/[0.04]" />)}</div>
        ) : tab === "dist" ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Glass>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <Pick value={v1} onChange={setV1} label={t("変数", "Variable")} en={en} />
                <Seg value={transform} onChange={setTransform} options={[["raw", t("実数", "Raw")], ["z", "z-score"], ["pct", t("パーセンタイル", "Percentile")]]} />
              </div>
              <Distribution values={xs1} d={d1} fmt={fmt1} en={en} mark={mark !== undefined ? xs1[mark] : undefined} />
              <p className="mt-2 text-[10px] text-edu-muted">{t("棒＝Freedman–Diaconis階級のヒストグラム、桃線＝ガウスKDE（Silverman帯域）、黄線＝平均、緑＝スポットライト人物。", "Bars: Freedman–Diaconis histogram · pink: Gaussian KDE (Silverman) · yellow: mean · green: spotlight.")}</p>
            </Glass>
            <Glass>
              <h3 className="mb-3 text-xs uppercase tracking-[.2em] text-edu-muted">{t("記述統計", "Descriptive statistics")}</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {([[t("平均", "Mean"), d1.mean], ["SD", d1.sd], [t("中央値", "Median"), d1.median], ["MAD", d1.mad], ["IQR", d1.iqr], [t("標準誤差", "SE"), d1.se], [t("歪度", "Skewness"), d1.skew], [t("超過尖度", "Ex. kurtosis"), d1.kurtosis], ["CV", d1.cv], ["P10", d1.p10], ["P90", d1.p90], [t("範囲", "Range"), d1.max - d1.min]] as [string, number][]).map(([k, v]) => <Stat key={k} label={k} value={fmt1(v)} />)}
              </div>
            </Glass>
            <Glass className="lg:col-span-2">
              <h3 className="mb-2 text-xs uppercase tracking-[.2em] text-edu-muted">{t("群別の分布（リッジライン）", "Distribution by group (ridgeline)")}</h3>
              <Ridgeline groups={byGroup(xs1)} lo={d1.min} hi={d1.max} mark={mark !== undefined ? xs1[mark] : undefined} />
            </Glass>
          </div>
        ) : tab === "dev" ? (
          <DeviationView rows={rows} values={raw[v1] ?? []} v={V(v1)} labelsOf={labelsOf} groupNames={groupNames} en={en} focusGroup={focusRow ? labelsOf[mark!] : undefined}
            picker={<Pick value={v1} onChange={setV1} label={t("変数", "Variable")} en={en} />} />
        ) : tab === "corr" ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <Glass>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-xs uppercase tracking-[.2em] text-edu-muted">{t("相関行列", "Correlation matrix")}</h3>
                <Seg value={method} onChange={setMethod} options={[["pearson", "Pearson r"], ["spearman", "Spearman ρ"]]} />
              </div>
              <Heatmap names={VARS.map((v) => (en ? v.en : v.ja).replace(/（.*）|\(.*\)/, ""))} active={[VARS.findIndex((v) => v.key === vx), VARS.findIndex((v) => v.key === vy)]}
                matrix={VARS.map((a) => VARS.map((b) => (a.key === b.key ? 1 : (method === "pearson" ? pearson : spearman)(raw[a.key] ?? [], raw[b.key] ?? []))))}
                onPick={(i, j) => { setVy(VARS[i]!.key); setVx(VARS[j]!.key) }} />
              <p className="mt-2 text-[10px] text-edu-muted">{t("セルをクリックすると右の散布図に反映。青＝正、桃＝負。", "Click a cell to plot it. Cyan = positive, pink = negative.")}</p>
            </Glass>
            <Glass>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Pick value={vx} onChange={setVx} label="X" en={en} />
                <Pick value={vy} onChange={setVy} label="Y" en={en} />
                <Seg value={colorBy} onChange={setColorBy} options={[["group", t("群で色分け", "Color: group")], ["var", t("第3変数=健康", "Color: health")]]} />
              </div>
              {(() => {
                const xs = raw[vx] ?? [], ys = raw[vy] ?? [], r = pearson(xs, ys), rho = spearman(xs, ys), [lo, hi] = corrCI(r, xs.length), f = ols(xs, ys)
                const color = colorBy === "group" ? labelsOf.map((l) => PALETTE[groupNames.indexOf(l) % PALETTE.length]!) : rows.map((row) => `#${Math.round(40 + 200 * row.h).toString(16).padStart(2, "0")}${Math.round(120 + 100 * row.h).toString(16).padStart(2, "0")}ff`)
                return <>
                  <Scatter rows={rows} xs={xs} ys={ys} color={color} mark={mark} labels={[[en ? V(vx).en : V(vx).ja, "x"], [en ? V(vy).en : V(vy).ja, "y"]]} onPick={(i) => router.push("/wiki/" + encodeURIComponent(rows[i]!.id))} />
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <Stat label="Pearson r" value={r.toFixed(3)} sub={`95% [${lo.toFixed(2)}, ${hi.toFixed(2)}]`} />
                    <Stat label="Spearman ρ" value={rho.toFixed(3)} />
                    <Stat label="R²" value={f.r2.toFixed(3)} />
                    <Stat label={t("傾き", "Slope")} value={f.b.toFixed(3)} sub={`y = ${f.a.toFixed(2)} + ${f.b.toFixed(3)}x`} />
                  </div>
                  {colorBy === "group" && <div className="mt-3 flex flex-wrap gap-2 text-[10px]">{groupNames.slice(0, 12).map((gn, i) => <span key={gn} className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />{gn}</span>)}</div>}
                  <p className="mt-2 text-[10px] text-edu-muted">{t("点をクリックでその人物のWikiへ。破線はOLS回帰直線。相関は因果ではない。", "Click a dot to open that person's Wiki. Dashed line = OLS fit. Correlation is not causation.")}</p>
                </>
              })()}
            </Glass>
          </div>
        ) : tab === "ineq" ? (
          <InequalityView rows={rows} labelsOf={labelsOf} groupNames={groupNames} en={en} />
        ) : (
          <OutlierView rows={rows} values={raw[v1] ?? []} d={descs[v1]!} v={V(v1)} en={en} picker={<Pick value={v1} onChange={setV1} label={t("変数", "Variable")} en={en} />} />
        )}

        <p className="text-[10px] text-edu-muted">{t("値は同時代人口の合成モデルによる今日の推定（原典の設定値ではない）。性自認・性的指向・姓名は分析軸に使わない。姓名は", "Values are today's estimates from a synthetic model of the contemporary population (not canon figures). Gender identity, sexual orientation and names are never analysis axes. Names from")} {data?.source}</p>
      </div>
    </main>
  )
}

function DeviationView({ rows, values, v, labelsOf, groupNames, en, picker, focusGroup }: { rows: Row[]; values: number[]; v: VarDef; labelsOf: string[]; groupNames: string[]; en: boolean; picker: React.ReactNode; focusGroup?: string }) {
  const t = (ja: string, e: string) => (en ? e : ja)
  const overall = describe(values)
  const stats = groupNames.map((gn) => {
    const inG: number[] = [], rest: number[] = []
    values.forEach((x, i) => (labelsOf[i] === gn ? inG : rest).push(x))
    const d = describe(inG)
    return { gn, d, delta: d.mean - overall.mean, z: d.se ? (d.mean - overall.mean) / (overall.sd / Math.sqrt(d.n)) : 0, cohen: cohenD(inG, rest) }
  }).sort((a, b) => b.cohen - a.cohen)
  const eta = etaSquared(groupNames.map((gn) => values.filter((_, i) => labelsOf[i] === gn)))
  const maxD = Math.max(0.2, ...stats.map((s) => Math.abs(s.cohen) + 1.96 * Math.sqrt(1 / Math.max(2, s.d.n))))
  const W = 640, row = 24, P = 170, H = stats.length * row + 30, cx = P + (W - P - 20) / 2
  const sx = (d: number) => cx + (d / maxD) * ((W - P - 20) / 2)
  const lo = overall.min, hi = overall.max, bx = (x: number) => P + ((x - lo) / (hi - lo || 1)) * (W - P - 20)
  return (
    <div className="grid gap-5">
      <Glass>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          {picker}
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] tabular-nums text-edu-muted">η² = {eta.toFixed(3)} · {t("全体平均", "overall mean")} {v.fmt(overall.mean)} · N {rows.length}</span>
        </div>
        <h3 className="mb-1 text-xs uppercase tracking-[.2em] text-edu-muted">{t("標準化偏差（Cohen's d：群 vs それ以外、95%区間）", "Standardized deviation (Cohen's d, group vs rest, 95% CI)")}</h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Cohen's d">
          <line x1={cx} x2={cx} y1={8} y2={H - 16} stroke="currentColor" strokeOpacity=".3" />
          {[-1, -0.5, 0.5, 1].filter((k) => Math.abs(k) <= maxD).map((k) => <g key={k}><line x1={sx(k)} x2={sx(k)} y1={8} y2={H - 16} stroke="currentColor" strokeOpacity=".08" /><text x={sx(k)} y={H - 4} textAnchor="middle" fontSize="9" fill="currentColor" opacity=".5">{k}</text></g>)}
          {stats.map((s, i) => {
            const y = 14 + i * row, ci = 1.96 * Math.sqrt((s.d.n + (rows.length - s.d.n)) / (s.d.n * Math.max(1, rows.length - s.d.n)) + s.cohen ** 2 / (2 * rows.length))
            const c = s.cohen >= 0 ? "#22d3ee" : "#f472b6"
            return (
              <g key={s.gn}>
                <text x={P - 8} y={y + 4} textAnchor="end" fontSize="10" fill={s.gn === focusGroup ? "#6ee7b7" : "currentColor"} opacity=".85">{s.gn.length > 24 ? s.gn.slice(0, 23) + "…" : s.gn} <tspan opacity=".5">{s.d.n}</tspan></text>
                <rect x={Math.min(cx, sx(s.cohen))} y={y - 6} width={Math.abs(sx(s.cohen) - cx)} height="12" rx="4" fill={c} fillOpacity=".55" />
                <line x1={sx(s.cohen - ci)} x2={sx(s.cohen + ci)} y1={y} y2={y} stroke="white" strokeOpacity=".7" />
              </g>
            )
          })}
        </svg>
      </Glass>
      <Glass>
        <h3 className="mb-2 text-xs uppercase tracking-[.2em] text-edu-muted">{t("箱ひげ図（ひげ＝1.5×IQR）", "Box plots (whiskers = 1.5×IQR)")}</h3>
        <svg viewBox={`0 0 ${W} ${stats.length * row + 24}`} className="w-full" role="img" aria-label="box plots">
          <line x1={bx(overall.median)} x2={bx(overall.median)} y1={0} y2={stats.length * row + 10} stroke="#facc15" strokeOpacity=".5" strokeDasharray="3 3" />
          {stats.map((s, i) => {
            const y = 12 + i * row, wl = Math.max(s.d.min, s.d.q1 - 1.5 * s.d.iqr), wh = Math.min(s.d.max, s.d.q3 + 1.5 * s.d.iqr), color = PALETTE[i % PALETTE.length]!
            return (
              <g key={s.gn}>
                <text x={P - 8} y={y + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity=".8">{s.gn.length > 24 ? s.gn.slice(0, 23) + "…" : s.gn}</text>
                <line x1={bx(wl)} x2={bx(wh)} y1={y} y2={y} stroke={color} strokeOpacity=".6" />
                <rect x={bx(s.d.q1)} y={y - 7} width={Math.max(1, bx(s.d.q3) - bx(s.d.q1))} height="14" rx="4" fill={color} fillOpacity=".25" stroke={color} />
                <line x1={bx(s.d.median)} x2={bx(s.d.median)} y1={y - 7} y2={y + 7} stroke="white" strokeWidth="2" />
              </g>
            )
          })}
        </svg>
      </Glass>
      <Glass className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs tabular-nums">
          <thead><tr className="text-left text-edu-muted">{[t("群", "Group"), "n", t("平均", "Mean"), "SD", t("中央値", "Median"), "IQR", "Δ" + t("全体比", " vs all"), "z", "d"].map((h) => <th key={h} className="px-2 py-2 font-normal">{h}</th>)}</tr></thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.gn} className="border-t border-white/5">
                <td className="px-2 py-1.5 text-edu-text">{s.gn}</td><td className="px-2">{s.d.n}</td><td className="px-2">{v.fmt(s.d.mean)}</td><td className="px-2">{v.fmt(s.d.sd)}</td><td className="px-2">{v.fmt(s.d.median)}</td><td className="px-2">{v.fmt(s.d.iqr)}</td>
                <td className={"px-2 " + (s.delta >= 0 ? "text-cyan-300" : "text-pink-300")}>{s.delta >= 0 ? "+" : ""}{v.fmt(s.delta)}</td>
                <td className={"px-2 " + (Math.abs(s.z) > 1.96 ? "font-semibold text-edu-text" : "text-edu-muted")}>{s.z.toFixed(2)}</td>
                <td className="px-2">{s.cohen.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[10px] text-edu-muted">{t("z は群平均と全体平均の差を標準誤差で割った値（|z|>1.96 を太字）。多数の群を同時に見る場合は偶然の偏りも含む。", "z = (group mean − overall mean) / (SD/√n); |z| > 1.96 in bold. With many groups some deviations arise by chance.")}</p>
      </Glass>
    </div>
  )
}

function InequalityView({ rows, labelsOf, groupNames, en }: { rows: Row[]; labelsOf: string[]; groupNames: string[]; en: boolean }) {
  const t = (ja: string, e: string) => (en ? e : ja)
  const [measure, setMeasure] = useState<"assets" | "w">("assets")
  const val = (r: Row) => (measure === "assets" ? r.assets : Math.max(0, r.w))
  const all = rows.map(val)
  const groups = groupNames.map((gn) => [gn, rows.filter((_, i) => labelsOf[i] === gn).map(val)] as [string, number[]]).filter(([, x]) => x.length >= 5)
  const shown: [string, number[]][] = [[t("全体", "All"), all], ...groups.slice(0, 7)]
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <Glass>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-xs uppercase tracking-[.2em] text-edu-muted">{t("ローレンツ曲線", "Lorenz curves")}</h3>
          <Seg value={measure} onChange={setMeasure} options={[["assets", t("総資産", "Assets")], ["w", t("正の純資産", "Positive net wealth")]]} />
        </div>
        <LorenzChart curves={shown.map(([g, x]) => [g, lorenz(x, 50)])} />
        <div className="mt-3 flex flex-wrap gap-2 text-[10px]">{shown.map(([g], i) => <span key={g} className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />{g}</span>)}</div>
      </Glass>
      <Glass className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-xs tabular-nums">
          <thead><tr className="text-left text-edu-muted">{[t("群", "Group"), "n", "Gini", "Theil T", "Palma", t("上位1%", "Top 1%"), t("上位10%", "Top 10%"), t("中央値 n", "Median n")].map((h) => <th key={h} className="px-2 py-2 font-normal">{h}</th>)}</tr></thead>
          <tbody>
            {[[t("全体", "All"), all] as [string, number[]], ...groups].map(([g, x]) => (
              <tr key={g} className="border-t border-white/5">
                <td className="px-2 py-1.5 text-edu-text">{g}</td><td className="px-2">{x.length}</td>
                <td className="px-2">{gini(x).toFixed(3)}</td><td className="px-2">{theil(x).toFixed(3)}</td>
                <td className="px-2">{(() => { const v = palma(x); return !Number.isFinite(v) ? "∞" : v >= 1000 ? v.toExponential(1) : v.toFixed(2) })()}</td>
                <td className="px-2">{(100 * topShare(x, 0.01)).toFixed(1)}%</td><td className="px-2">{(100 * topShare(x, 0.1)).toFixed(1)}%</td>
                <td className="px-2">{Math.round(describe(x).median * N10M).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[10px] text-edu-muted">{t("Gini・Theil・Palma（上位10%÷下位40%）。純資産は負の値を0として扱う。", "Gini, Theil T and Palma (top 10% / bottom 40%). Negative net wealth is treated as 0.")}</p>
      </Glass>
    </div>
  )
}

function OutlierView({ rows, values, d, v, en, picker }: { rows: Row[]; values: number[]; d: Describe; v: VarDef; en: boolean; picker: React.ReactNode }) {
  const t = (ja: string, e: string) => (en ? e : ja)
  const ranked = values.map((x, i) => ({ i, x, z: robustZ(x, d) })).sort((a, b) => Math.abs(b.z) - Math.abs(a.z)).slice(0, 24)
  return (
    <Glass>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">{picker}<span className="text-[11px] text-edu-muted">{t("ロバストz＝(x−中央値)/(1.4826×MAD)", "Robust z = (x − median) / (1.4826 × MAD)")}</span></div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map(({ i, x, z }) => (
          <Link key={rows[i]!.cid} href={"/wiki/" + encodeURIComponent(rows[i]!.id)} className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-3 transition hover:-translate-y-0.5 hover:border-cyan-300/40">
            <div className="min-w-0"><p className="truncate text-sm group-hover:text-cyan-100">{en && rows[i]!.nameEn ? rows[i]!.nameEn : rows[i]!.name}</p><p className="truncate text-[10px] text-edu-muted">{rows[i]!.macro} · {v.fmt(x)}</p></div>
            <span className={"shrink-0 rounded-full px-2 py-0.5 text-xs tabular-nums " + (z >= 0 ? "bg-cyan-400/15 text-cyan-200" : "bg-pink-400/15 text-pink-200")}>{z >= 0 ? "+" : ""}{z.toFixed(1)}</span>
          </Link>
        ))}
      </div>
    </Glass>
  )
}
