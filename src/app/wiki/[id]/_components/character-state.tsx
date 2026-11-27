"use client"

import { useEffect, useState } from "react"
import { tl, type Lang } from "@/lib/lang"

interface Axis { h: number; w: number; a: number }
interface Person { id: string; name: string; nameEn: string; formal: string; formalEn: string; region: string; regionEn: string; role: string; roleEn: string; identity: string; identityEn: string; status: string }
export interface CharacterStateData {
  person: Person | null
  day?: number
  cohort?: number
  state: (Axis & { assets: number; debt: number; care: number; pressure: number; opportunity: number }) | null
  percentile?: Axis
  median?: Axis
}

const wealthIndex = (w: number) => 0.5 + Math.atan(w / 5) / Math.PI
const money = (n: number) => Math.round(n * 10_000_000).toLocaleString()

/** Fetches the current modeled state of one character (by registry ID or Wiki entry names). */
export function useCharacterState(id: string, name?: string, nameEn?: string) {
  const [data, setData] = useState<CharacterStateData | null | undefined>(undefined)
  useEffect(() => {
    let alive = true
    if (!id) { setData(null); return }
    const q = new URLSearchParams({ id, name: name ?? "", nameEn: nameEn ?? "" })
    fetch("/api/characters?" + q.toString())
      .then((r) => r.json() as Promise<CharacterStateData>)
      .then((d) => { if (alive) setData(d.person ? d : null) })
      .catch(() => { if (alive) setData(null) })
    return () => { alive = false }
  }, [id, name, nameEn])
  return data
}

function Bar({ label, value, median, percentile, color, lang }: { label: string; value: number; median: number; percentile: number; color: string; lang: Lang }) {
  const top = Math.max(0.1, 100 * (1 - percentile))
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-edu-text">{label}</span>
        <span className="tabular-nums text-edu-muted">
          <strong className="text-base text-edu-text mr-2">{(value * 100).toFixed(1)}</strong>
          {tl(`上位 ${top.toFixed(1)}%`, `Top ${top.toFixed(1)}%`, lang)}
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-edu-surface mt-1.5 overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: (value * 100).toFixed(2) + "%", background: color }} />
        <div className="absolute inset-y-0 w-0.5 bg-edu-text/70" style={{ left: (median * 100).toFixed(2) + "%" }} title={tl("全体の中央値", "Cohort median", lang)} />
      </div>
    </div>
  )
}

export function CharacterStateCard({ data, lang }: { data: CharacterStateData | null | undefined; lang: Lang }) {
  if (data === undefined) return <div className="edu-card p-5 mb-8 animate-pulse h-48" />
  if (data === null) return null
  const { state, percentile, median } = data
  return (
    <section className="edu-card p-5 sm:p-6 mb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 className="text-[11px] text-edu-muted uppercase tracking-widest">{tl("現在地", "Current position", lang)}</h2>
        {data.day !== undefined && <span className="text-xs text-edu-muted">E528 · {tl("標準日", "standard day", lang)} {data.day + 1}</span>}
      </div>
      {state && percentile && median ? (
        <div className="grid sm:grid-cols-[minmax(0,1fr)_200px] gap-6 items-center">
          <div className="space-y-4">
            <Bar label={tl("健康・バイオ", "Health / bio", lang)} value={state.h} median={median.h} percentile={percentile.h} color="#38bdf8" lang={lang} />
            <Bar label={tl("資産指数", "Wealth index", lang)} value={wealthIndex(state.w)} median={wealthIndex(median.w)} percentile={percentile.w} color="#f59e0b" lang={lang} />
            <Bar label={tl("権威・名声", "Authority / reputation", lang)} value={state.a} median={median.a} percentile={percentile.a} color="#a78bfa" lang={lang} />
            <dl className="grid grid-cols-3 gap-2 text-xs pt-1">
              {[[tl("純資産", "Net wealth", lang), money(state.w)], [tl("総資産", "Assets", lang), money(state.assets)], [tl("負債", "Debt", lang), money(state.debt)]].map(([k, v]) => (
                <div key={k}><dt className="text-edu-muted">{k}</dt><dd className="tabular-nums text-edu-text">{v} n</dd></div>
              ))}
            </dl>
          </div>
          <svg viewBox="0 0 200 180" className="w-full max-w-[200px] mx-auto" role="img" aria-label={tl("三指標の現在地", "Current three-axis position", lang)}>
            {[1, 0.66, 0.33].map((r) => (
              <polygon key={r} points={[[100, 95 - 75 * r], [100 - 65 * r, 95 + 37.5 * r], [100 + 65 * r, 95 + 37.5 * r]].map((p) => p.join(",")).join(" ")} fill="none" stroke="currentColor" opacity=".15" />
            ))}
            <polygon
              points={[[100, 95 - 75 * state.h], [100 - 65 * wealthIndex(state.w), 95 + 37.5 * wealthIndex(state.w)], [100 + 65 * state.a, 95 + 37.5 * state.a]].map((p) => p.map((v) => v.toFixed(2)).join(",")).join(" ")}
              fill="#38bdf8" fillOpacity=".25" stroke="#38bdf8" strokeWidth="1.5"
            />
            <text x="100" y="14" textAnchor="middle" fontSize="10" fill="currentColor">{tl("健康", "Health", lang)}</text>
            <text x="30" y="150" textAnchor="middle" fontSize="10" fill="currentColor">{tl("資産", "Wealth", lang)}</text>
            <text x="170" y="150" textAnchor="middle" fontSize="10" fill="currentColor">{tl("名声", "Reputation", lang)}</text>
          </svg>
        </div>
      ) : (
        <p className="text-sm text-edu-muted">{tl("E528時点の存命・同一性が原典で未確定のため、現在値は表示しません。", "E528 survival or identity is unresolved in canon, so no current value is shown.", lang)}</p>
      )}
      <p className="text-[10px] text-edu-muted mt-4">{tl(`同時代の${(data.cohort ?? 0).toLocaleString()}人を対象にした合成モデルの今日の値（原典の設定値ではない）。縦線は全体の中央値。`, `Today's value from a synthetic model of ${(data.cohort ?? 0).toLocaleString()} contemporaries (not canon figures). The vertical tick marks the cohort median.`, lang)}</p>
    </section>
  )
}
