"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { tl, type Lang } from "@/lib/lang"
import { characterKey, fetchCharacterJSON } from "../../_components/character-search"
import type { Portrait } from "../../_components/portrait-design"

interface Axis { h: number; w: number; a: number }
export interface RegistryPerson { id: string; name: string; nameEn: string; formal: string; formalEn: string; region: string; regionEn: string; role: string; roleEn: string; identity: string; identityEn: string; status: string }
export interface PageRef { id: string; name: string; nameEn: string; distance?: number; sameRegion?: boolean }
export interface Member {
  person: RegistryPerson
  portrait?: Portrait
  nickname: string
  nicknameEn: string
  state: (Axis & { assets: number; debt: number; care: number; pressure: number; opportunity: number; triad: number; triadField: number[] }) | null
  percentile: Axis | null
}
export interface CharacterDetail {
  id: string
  day: number
  cohort: number
  confirmedCount?: number
  snapshot?: boolean
  total: number
  source: string
  median: Axis
  people: Member[]
  links: { mentions: PageRef[]; backlinks: PageRef[]; similar: PageRef[] }
}
export type DetailResult = { kind: "loading" } | { kind: "none" } | { kind: "error" } | { kind: "redirect"; to: string } | { kind: "ok"; data: CharacterDetail }

/** Fetches the current state and link graph of one character page. */
export function useCharacterDetail(id: string): DetailResult {
  const [result, setResult] = useState<DetailResult>({ kind: "loading" })
  useEffect(() => {
    let alive = true
    if (!id) { setResult({ kind: "none" }); return }
    setResult({ kind: "loading" })
    fetchCharacterJSON<Partial<CharacterDetail> & { redirect?: string }>("/api/characters/detail/" + characterKey(id), d => typeof d.redirect === "string" || (Array.isArray(d.people) && d.people.length === 1 && d.people.every(m => !!m.state && [m.state.h, m.state.w, m.state.a].every(Number.isFinite)) && !!d.links && !!d.median && d.id === id))
      .then((d) => {
        if (!alive) return
        if (d.redirect) setResult({ kind: "redirect", to: d.redirect })
        else if (d.people && d.people.length + (d.links?.backlinks.length ?? 0) + (d.links?.mentions.length ?? 0) > 0) setResult({ kind: "ok", data: d as CharacterDetail })
        else setResult({ kind: "none" })
      })
      .catch(() => { if (alive) setResult({ kind: "error" }) })
    return () => { alive = false }
  }, [id])
  return result
}

export const wealthIndex = (w: number) => 0.5 + Math.atan(w / 5) / Math.PI
const money = (n: number) => Math.round(n * 10_000_000).toLocaleString()
const AXES = [
  { key: "h" as const, ja: "健康・バイオ", en: "Health / bio", from: "#22d3ee", to: "#38bdf8" },
  { key: "w" as const, ja: "資産指数", en: "Wealth index", from: "#fbbf24", to: "#f97316" },
  { key: "a" as const, ja: "権威・名声", en: "Authority / reputation", from: "#c084fc", to: "#818cf8" },
]

function AxisBar({ label, value, median, percentile, from, to, lang, delay }: { label: string; value: number; median: number; percentile: number; from: string; to: string; lang: Lang; delay: number }) {
  const [shown, setShown] = useState(0)
  useEffect(() => { const t = window.setTimeout(() => setShown(value), 60 + delay); return () => window.clearTimeout(t) }, [value, delay])
  const top = Math.max(0.1, 100 * (1 - percentile)), bottom = Math.max(0.1, 100 * percentile)
  const rank = percentile >= 0.5 ? tl(`上位 ${top.toFixed(1)}%`, `Top ${top.toFixed(1)}%`, lang) : tl(`下位 ${bottom.toFixed(1)}%`, `Bottom ${bottom.toFixed(1)}%`, lang)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs tracking-wide text-edu-muted">{label}</span>
        <span className="tabular-nums">
          <strong className="text-2xl font-semibold text-edu-text">{(value * 100).toFixed(1)}</strong>
          <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-edu-muted">{rank}</span>
        </span>
      </div>
      <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ width: (shown * 100).toFixed(2) + "%", background: `linear-gradient(90deg, ${from}, ${to})`, boxShadow: `0 0 18px ${to}88` }}
        />
        <div className="absolute inset-y-[-2px] w-[2px] rounded bg-white/80" style={{ left: (median * 100).toFixed(2) + "%" }} title={tl("全体の中央値", "Cohort median", lang)} />
      </div>
    </div>
  )
}

function Radar({ v, lang }: { v: Axis; lang: Lang }) {
  const pt = (r: number, k: number) => {
    const ang = -Math.PI / 2 + (k * 2 * Math.PI) / 3
    return [100 + 72 * r * Math.cos(ang), 100 + 72 * r * Math.sin(ang)]
  }
  const poly = (rs: number[]) => rs.map((r, k) => pt(r, k).map((x) => x.toFixed(2)).join(",")).join(" ")
  const vals = [v.h, wealthIndex(v.w), v.a]
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto drop-shadow-[0_0_24px_rgba(56,189,248,.25)]" role="img" aria-label={tl("三指標の現在地", "Current three-axis position", lang)}>
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity=".55" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity=".18" />
        </radialGradient>
      </defs>
      {[1, 0.75, 0.5, 0.25].map((r) => <polygon key={r} points={poly([r, r, r])} fill="none" stroke="currentColor" strokeOpacity=".12" />)}
      {[0, 1, 2].map((k) => { const [x, y] = pt(1, k); return <line key={k} x1="100" y1="100" x2={x!.toFixed(2)} y2={y!.toFixed(2)} stroke="currentColor" strokeOpacity=".1" /> })}
      <polygon points={poly(vals)} fill="url(#radar-fill)" stroke="#67e8f9" strokeWidth="1.5" strokeLinejoin="round" />
      {vals.map((r, k) => { const [x, y] = pt(r, k); return <circle key={k} cx={x!.toFixed(2)} cy={y!.toFixed(2)} r="3" fill="#e0f2fe" /> })}
      {[tl("健康", "Health", lang), tl("資産", "Wealth", lang), tl("名声", "Reputation", lang)].map((t, k) => { const [x, y] = pt(1.22, k); return <text key={t} x={x!.toFixed(2)} y={(y! + 3).toFixed(2)} textAnchor="middle" fontSize="10" fill="currentColor" opacity=".75">{t}</text> })}
    </svg>
  )
}

/** Glass panel with the current position of each person on the page (duo entries show both). */
export function CharacterStatePanel({ result, lang }: { result: DetailResult; lang: Lang }) {
  if (result.kind === "loading") return <div className="mb-8 h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
  if (result.kind === "error") return <section className="edu-card mb-8 p-5" role="alert">{tl("現在値を取得できませんでした。", "Could not load current values.", lang)} <button className="ml-2 underline" onClick={() => window.location.reload()}>{tl("再読み込み", "Retry", lang)}</button></section>
  if (result.kind === "none" || (result.kind === "ok" && result.data.people.length === 0)) return <section className="edu-card mb-8 p-5 text-sm text-edu-muted">{tl("人物データの取得に失敗しました。再読み込みしてください。", "Character data unavailable. Reload to retry.", lang)}</section>
  if (result.kind !== "ok") return null
  const d = result.data
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-5 shadow-[0_20px_80px_-20px_rgba(56,189,248,.25)] backdrop-blur-xl sm:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[.25em] text-edu-muted">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
          {tl("現在地", "Current position", lang)}
        </h2>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tabular-nums text-edu-muted">E528 · {tl("標準日", "day", lang)} {d.day + 1}</span>
      </div>
      {d.snapshot && <p className="mb-3 text-xs text-edu-muted">{tl("公開ビルド時の計算スナップショット（ライブ取得失敗時）", "Build-time computed snapshot (live API unavailable)", lang)}</p>}
      <div className="relative space-y-8">
        {d.people.map((m) => (
          <div key={m.person.id}>
            {m.person.status !== "current" && <p className="mb-3 rounded-xl border border-amber-300/20 p-2 text-xs text-edu-muted">{tl("仮定モデル値：E528での存命・所属は原典未確認（Wiki独自人物を含む）。現代環境に置いた場合の推定であり、公式設定値ではありません。", "Conditional model: E528 status or source identity is unconfirmed. Values assume today’s environment; not canon facts.", lang)}</p>}
            {d.people.length > 1 && <p className="mb-3 text-sm font-medium text-edu-text">{lang === "en" ? m.person.formalEn : m.person.formal} <span className="text-xs text-edu-muted">{m.person.id}</span></p>}
            {m.state && m.percentile ? (
              <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-5">
                  {AXES.map((ax, k) => (
                    <AxisBar key={ax.key} label={lang === "en" ? ax.en : ax.ja} lang={lang} delay={k * 120}
                      value={ax.key === "w" ? wealthIndex(m.state!.w) : m.state![ax.key]}
                      median={ax.key === "w" ? wealthIndex(d.median.w) : d.median[ax.key]}
                      percentile={m.percentile![ax.key]} from={ax.from} to={ax.to} />
                  ))}
                  <dl className="grid grid-cols-3 gap-2 pt-1">
                    {[[tl("純資産", "Net wealth", lang), money(m.state.w)], [tl("総資産", "Assets", lang), money(m.state.assets)], [tl("負債", "Debt", lang), money(m.state.debt)]].map(([k, v]) => (
                      <div key={k} className="rounded-2xl border border-white/5 bg-black/20 p-3"><dt className="text-[10px] text-edu-muted">{k}</dt><dd className="mt-1 truncate text-sm tabular-nums text-edu-text">{v} n</dd></div>
                    ))}
                  </dl>
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-3 text-[11px]">
                    <p className="text-edu-muted">{tl("三点相互作用（健康×資産×名声）の各軸への寄与", "Three-way interaction (health × wealth × reputation): push on each axis", lang)}</p>
                    <div className="mt-1.5 grid grid-cols-3 gap-2 tabular-nums">
                      {[tl("健康", "Health", lang), tl("資産", "Wealth", lang), tl("名声", "Reputation", lang)].map((k, i) => {
                        const v = m.state!.triadField[i] ?? 0
                        return <span key={k} className={v >= 0 ? "text-cyan-300" : "text-pink-300"}>{k} {v >= 0 ? "+" : ""}{v.toFixed(3)}</span>
                      })}
                    </div>
                  </div>
                </div>
                <Radar v={m.state} lang={lang} />
              </div>
            ) : (
              <p className="text-sm text-edu-muted">{tl("計算結果の取得エラー。再読み込みしてください。", "Computed values unavailable. Reload to retry.", lang)}</p>
            )}
          </div>
        ))}
      </div>
      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-2 text-[10px] text-edu-muted">
        <span>{tl(`今日の環境で登録${d.cohort.toLocaleString()}人を計算（原典現代対象${d.confirmedCount ?? d.cohort}人、その他は仮定値）。時間発展なし。白線は全モデルの中央値。`, `Today's equilibrium for ${d.cohort.toLocaleString()} registered characters (${d.confirmedCount ?? d.cohort} source-current; others conditional). No time stepping. White tick = model median.`, lang)}</span>
        <Link href="/wiki/analytics" className="text-cyan-300 hover:text-cyan-200">{tl("人口分析で見る →", "Open population analytics →", lang)}</Link>
      </div>
    </section>
  )
}

function Chips({ title, items, lang, hint }: { title: string; items: PageRef[]; lang: Lang; hint?: (p: PageRef) => string }) {
  if (!items.length) return null
  return (
    <div>
      <h3 className="mb-2 text-[10px] uppercase tracking-[.2em] text-edu-muted">{title} <span className="tabular-nums">{items.length}</span></h3>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => (
          <Link key={p.id} href={"/wiki/" + encodeURIComponent(p.id)}
            className="group rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-edu-text transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:shadow-[0_8px_24px_-8px_rgba(34,211,238,.5)]">
            {lang === "en" && p.nameEn ? p.nameEn : p.name}
            {hint && <span className="ml-1.5 text-[10px] text-edu-muted group-hover:text-cyan-200">{hint(p)}</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}

/** Wiki-to-Wiki links: who this page mentions, who mentions it, and current-state neighbours. */
export function CharacterLinks({ result, lang }: { result: DetailResult; lang: Lang }) {
  if (result.kind !== "ok") return null
  const { mentions, backlinks, similar } = result.data.links
  if (!mentions.length && !backlinks.length && !similar.length) return null
  return (
    <section className="mb-8 space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-7">
      <h2 className="text-[11px] uppercase tracking-[.25em] text-edu-muted">{tl("つながり", "Connections", lang)}</h2>
      <Chips title={tl("この項目に登場する人物", "Mentioned here", lang)} items={mentions} lang={lang} />
      <Chips title={tl("この人物に言及している項目", "Mentioned by", lang)} items={backlinks} lang={lang} />
      <Chips title={tl("現在地が近い人物", "Closest current position", lang)} items={similar} lang={lang}
        hint={(p) => (p.sameRegion ? tl("同地域", "same region", lang) + " · " : "") + "Δ" + ((p.distance ?? 0) * 100).toFixed(1)} />
    </section>
  )
}
