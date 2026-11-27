import { NextRequest, NextResponse } from "next/server"
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data"
import { simulate, type Person, type State } from "@/app/wiki/state/living-model.mjs"
import registry from "@/app/wiki/state/registry.json"

export const dynamic = "force-dynamic"

/** E528 day 1 = 2026-11-27 UTC. The model stops at the end of E528. */
const ANCHOR = Date.UTC(2026, 10, 27)
const roster: Person[] = registry.people
const active = roster.filter((p) => p.status === "current")
const activeIndex = new Map(active.map((p, i) => [p.id, i]))

const norm = (s: string) => s.replace(/[\s・·\-（）()／/]/g, "").toLowerCase()
const byName = new Map<string, Set<string>>()
for (const p of roster) for (const v of [p.id, p.name, p.nameEn, p.formal, p.formalEn]) {
  if (!v) continue
  const k = norm(v)
  byName.set(k, (byName.get(k) ?? new Set()).add(p.id))
}
const matchPerson = (keys: string[]): Person | undefined => {
  const ids = new Set(keys.filter(Boolean).flatMap((k) => [...(byName.get(norm(k)) ?? [])]))
  return ids.size === 1 ? roster.find((p) => p.id === [...ids][0]) : undefined
}
/** Registry people already described by a hand-written Wiki entry link to that entry. */
const wikiIdFor = new Map<string, string>()
for (const e of ALL_ENTRIES) if (e.category === "キャラクター") {
  const p = matchPerson([e.id, e.name, e.nameEn ?? ""])
  if (p) wikiIdFor.set(p.id, e.id)
}

const today = () => Math.max(0, Math.min(365, Math.floor((Date.now() - ANCHOR) / 86_400_000)))
let cache: { day: number; current: State[]; sorted: { h: number[]; w: number[]; a: number[] } } | null = null
function currentState() {
  const day = today()
  if (cache?.day === day) return cache
  const current = simulate(active, day).current
  const sort = (f: (s: State) => number) => current.map(f).sort((x, y) => x - y)
  cache = { day, current, sorted: { h: sort((s) => s.h), w: sort((s) => s.w), a: sort((s) => s.a) } }
  return cache
}
/** Share of the current cohort strictly below v (0..1). */
const below = (sorted: number[], v: number) => {
  let lo = 0, hi = sorted.length
  while (lo < hi) { const m = (lo + hi) >> 1; if ((sorted[m] ?? 0) < v) lo = m + 1; else hi = m }
  return sorted.length ? lo / sorted.length : 0
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams
  const id = q.get("id")
  if (!id) {
    // Lightweight roster for Wiki listing and search.
    const people = roster.map((p) => ({ id: p.id, name: p.name, nameEn: p.nameEn, formal: p.formal, formalEn: p.formalEn, region: p.region, regionEn: p.regionEn, role: p.role, roleEn: p.roleEn, status: p.status, wikiId: wikiIdFor.get(p.id) ?? null }))
    return NextResponse.json({ people }, { headers: { "Cache-Control": "public, max-age=3600" } })
  }
  const person = roster.find((p) => p.id === id) ?? matchPerson([id, q.get("name") ?? "", q.get("nameEn") ?? ""])
  if (!person) return NextResponse.json({ person: null, state: null }, { status: 404 })
  const i = activeIndex.get(person.id)
  if (i === undefined) return NextResponse.json({ person, state: null })
  const { day, current, sorted } = currentState()
  const s = current[i]
  if (!s) return NextResponse.json({ person, state: null })
  return NextResponse.json({
    person,
    day,
    cohort: active.length,
    state: { h: s.h, w: s.w, a: s.a, assets: s.assets, debt: s.debt, care: s.care, pressure: s.pressure, opportunity: s.opportunity },
    percentile: { h: below(sorted.h, s.h), w: below(sorted.w, s.w), a: below(sorted.a, s.a) },
    median: { h: sorted.h[sorted.h.length >> 1] ?? 0, w: sorted.w[sorted.w.length >> 1] ?? 0, a: sorted.a[sorted.a.length >> 1] ?? 0 },
  }, { headers: { "Cache-Control": "public, max-age=600" } })
}
