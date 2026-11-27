"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Search, BarChart3 } from "lucide-react"
import { tl, type Lang } from "@/lib/lang"
import { characterMatch } from "./character-search"
import { CharacterPortrait } from "./character-portrait"
import type { Portrait } from "./portrait-design"

export interface DirectoryRow { cid?: string; portrait?: Portrait; status?: string; aliases?: string[]; stateMembers?: { cid: string; name: string; state: { h: number; wi: number; a: number } | null }[]; id: string; name: string; nameEn: string; region: string; regionEn: string; role: string; roleEn: string; wiki: boolean; state: { h: number; wi: number; a: number } | null }

const macro = (region: string) => { const r = region.replace(/\s*\(.*\)\s*$/, ""); return (/^Gigapolis/i.test(r) ? "Gigapolis" : /^Crescent/i.test(r) ? "Crescent" : /^Granbell/i.test(r) ? "Granbell" : /AURALIS/i.test(r) ? "AURALIS" : r ? "Other" : "—") }
const SORTS = ["name", "h", "wi", "a"] as const
type Sort = (typeof SORTS)[number]

export function Mini({ s, lang }: { s: DirectoryRow["state"]; lang: Lang }) {
  if (!s) return <span className="text-[10px] text-edu-muted">{tl("数値取得エラー", "State unavailable", lang)}</span>
  return <div className="grid grid-cols-3 gap-2 text-center tabular-nums">
    {[[tl("健康","Health",lang), s.h, "#22d3ee"], [tl("資産","Wealth",lang), s.wi, "#f59e0b"], [tl("名声","Authority",lang), s.a, "#a78bfa"]].map(([label,v,c]) => <div key={String(label)}><p className="text-[9px] text-edu-muted">{label}</p><p className="text-xs font-semibold" style={{color:String(c)}}>{(Number(v)*100).toFixed(1)}</p><div className="mt-1 h-1 w-full rounded bg-white/10"><div className="h-full rounded" style={{width:(Number(v)*100)+"%",background:String(c)}} /></div></div>)}
  </div>
}

/** Searchable, sortable directory of every character (one card per person). */
export function CharacterDirectory({ rows, lang, scrollable = false, error = false }: { rows: DirectoryRow[] | null; lang: Lang; scrollable?: boolean; error?: boolean }) {
  const [q, setQ] = useState("")
  const [zone, setZone] = useState("all")
  const [sort, setSort] = useState<Sort>("name")
  const [limit, setLimit] = useState(60)
  const sentinel = useRef<HTMLDivElement>(null)
  const zones = useMemo(() => ["all", ...new Set((rows ?? []).map((r) => macro(r.regionEn)))], [rows])
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const out = (rows ?? []).filter((r) => (zone === "all" || macro(r.regionEn) === zone) && (!needle || characterMatch(needle, [r.id, r.name, r.nameEn, r.region, r.regionEn, r.role, r.roleEn, ...(r.aliases ?? [])]) >= 0))
    return sort === "name" ? [...out].sort((a,b) => (lang === "en" ? a.nameEn || a.name : a.name).localeCompare(lang === "en" ? b.nameEn || b.name : b.name, lang === "en" ? "en" : "ja")) : [...out].sort((a, b) => (b.state?.[sort] ?? -1) - (a.state?.[sort] ?? -1))
  }, [rows, q, zone, sort, lang])
  useEffect(() => setLimit(60), [q, zone, sort])
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) setLimit((n) => n + 60) }, { rootMargin: "600px" })
    io.observe(el)
    return () => io.disconnect()
  }, [list.length])
  const sortLabel: Record<Sort, string> = { name: tl("名前順", "Name", lang), h: tl("健康", "Health", lang), wi: tl("資産", "Wealth", lang), a: tl("名声", "Reputation", lang) }

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-4 mb-5 border-b border-white/5 bg-edu-bg/70 px-4 pb-4 pt-3 backdrop-blur-xl sm:top-16">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-edu-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tl("名前・ID・地域・職務", "Name, ID, region, role", lang)} aria-label={tl("キャラクター検索", "Search characters", lang)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-3 text-sm text-edu-text placeholder:text-edu-muted focus:border-cyan-300/50 focus:outline-none focus:ring-4 focus:ring-cyan-300/10" />
          </div>
          <Link href="/wiki/analytics" className="inline-flex items-center gap-1.5 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-3 text-xs text-cyan-200 hover:bg-cyan-300/20">
            <BarChart3 className="h-4 w-4" /><span className="hidden sm:inline">{tl("人口分析", "Analytics", lang)}</span>
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {zones.map((z) => (
            <button key={z} type="button" onClick={() => setZone(z)} aria-pressed={zone === z}
              className={"rounded-full px-3 py-1 text-[11px] transition " + (zone === z ? "bg-edu-text text-edu-bg" : "border border-white/10 text-edu-muted hover:text-edu-text")}>
              {z === "all" ? tl("すべて", "All", lang) : z === "—" ? tl("地域未設定", "No region", lang) : z === "Other" ? tl("その他の地域", "Other regions", lang) : z}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-white/10" />
          {SORTS.map((s) => (
            <button key={s} type="button" onClick={() => setSort(s)} aria-pressed={sort === s}
              className={"rounded-full px-3 py-1 text-[11px] transition " + (sort === s ? "bg-cyan-300/20 text-cyan-100 ring-1 ring-cyan-300/40" : "text-edu-muted hover:text-edu-text")}>
              {sortLabel[s]}{s !== "name" && " ↓"}
            </button>
          ))}
          <span className="ml-auto text-[11px] tabular-nums text-edu-muted">{rows ? list.length.toLocaleString() : "…"} {tl("人", "people", lang)}</span>
        </div>
      </div>
      <div className={scrollable ? "max-h-[70vh] overflow-y-auto overscroll-contain rounded-2xl pr-1" : ""}>
      {error ? <p role="alert" className="p-4 text-sm text-edu-muted">{tl("人物一覧を取得できませんでした。", "Could not load characters.", lang)} <button className="underline" onClick={() => window.location.reload()}>{tl("再読み込み", "Retry", lang)}</button></p> : !rows ? (
        <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 8 }, (_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/[0.04]" />)}</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.slice(0, limit).map((r) => (
            <Link key={r.id} href={"/wiki/" + encodeURIComponent(r.id)}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-transparent p-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:shadow-[0_16px_48px_-16px_rgba(34,211,238,.35)]">
              {r.portrait && <CharacterPortrait key={r.id} portrait={r.portrait} name={r.name} size={48} className="h-12 w-12" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-edu-text group-hover:text-cyan-100">{lang === "en" && r.nameEn ? r.nameEn : r.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-edu-muted">{[lang === "en" ? r.regionEn : r.region, lang === "en" ? r.roleEn : r.role].filter(Boolean).join(" · ") || r.id}</p>
              </div>
              {r.status !== "current" && <span className="text-[9px] text-edu-muted">{tl("仮定値", "Conditional", lang)}</span>}
              <div className="shrink-0 space-y-1">{r.stateMembers && r.stateMembers.length > 1 ? r.stateMembers.map(m => <div key={m.cid}><p className="text-[9px] text-edu-muted">{m.name}</p><Mini s={m.state} lang={lang} /></div>) : <Mini s={r.state} lang={lang} />}</div>
            </Link>
          ))}
        </div>
      )}
      {rows && !error && list.length === 0 && <p className="p-4 text-sm text-edu-muted">{tl("該当する人物がいません。", "No matching characters.", lang)}</p>}
      <div ref={sentinel} className="h-8" />
      </div>
    </div>
  )
}
