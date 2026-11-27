import { NextResponse } from "next/server"
import type { State } from "@/app/wiki/state/living-model.mjs"
import {
  IDENTITY_SOURCE, active, currentStates, links, macroRegion, membersOf, nickname, ownerOf, pageOf, pages, person, ref, roster, stateOf, today,
} from "./graph"

const headers = { "Cache-Control": "private, no-store, max-age=0", "Netlify-CDN-Cache-Control": "no-store", "CDN-Cache-Control": "no-store" }
const aliasesFor = (cid: string) => nickname(cid)?.aliases ?? []

const wealthIndex = (w: number) => 0.5 + Math.atan(w / 5) / Math.PI
const cohortSorted = () => {
  const { current } = currentStates()
  const sort = (f: (s: State) => number) => current.map(f).sort((x, y) => x - y)
  return { h: sort((s) => s.h), w: sort((s) => s.w), a: sort((s) => s.a) }
}
const below = (sorted: number[], v: number) => {
  let lo = 0, hi = sorted.length
  while (lo < hi) { const m = (lo + hi) >> 1; if ((sorted[m] ?? 0) < v) lo = m + 1; else hi = m }
  return sorted.length ? lo / sorted.length : 0
}
const mini = (cid: string) => { const s = stateOf(cid); return s ? { h: s.h, wi: wealthIndex(s.w), a: s.a } : null }

/** Nearest neighbours in the current (health, wealth index, authority) space. */
function similar(cid: string, k: number) {
  const s = stateOf(cid)
  if (!s) return []
  const x = [s.h, wealthIndex(s.w), s.a], region = person(cid)?.regionEn ?? ""
  const { current } = currentStates()
  return active
    .map((p, i) => {
      const t = current[i]!
      return { id: p.id, d: Math.hypot(t.h - x[0]!, wealthIndex(t.w) - x[1]!, t.a - x[2]!), same: p.regionEn === region }
    })
    .filter((r) => r.id !== cid && pageOf(r.id) !== pageOf(cid))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((r) => ({ ...ref(pageOf(r.id)), distance: r.d, sameRegion: r.same }))
}

export function characterResponse(view: string | null, id: string | null) {
  const day = today()

  if (view === "population") {
    const { current } = currentStates()
    const rows = active.map((p, i) => {
      const s = current[i]!
      return {
        id: pageOf(p.id), cid: p.id, aliases: [...new Set([...aliasesFor(p.id), ref(pageOf(p.id)).name, ref(pageOf(p.id)).nameEn])], name: p.name || p.formal, nameEn: p.nameEn || p.formalEn, formal: p.formal, formalEn: p.formalEn, region: p.region, regionEn: p.regionEn, macro: macroRegion(p.regionEn), role: p.role, roleEn: p.roleEn,
        h: s.h, w: s.w, wi: wealthIndex(s.w), a: s.a, assets: s.assets, debt: s.debt, care: s.care, pressure: s.pressure, opportunity: s.opportunity, expression: s.expression,
      }
    })
    return NextResponse.json({ day, source: IDENTITY_SOURCE, rows }, { headers })
  }

  if (!id) {
    // One row per person: registry people owned by a Wiki entry are folded into that entry.
    const rows = pages.map((p) => {
      const members = membersOf.get(p.id) ?? (person(p.id) ? [p.id] : [])
      const r = members[0] ? person(members[0]) : undefined
      return { ...p, aliases: [...new Set(members.flatMap((cid) => [cid, ...aliasesFor(cid)]))], stateMembers: members.map((cid) => ({ cid, name: person(cid)?.name ?? cid, state: mini(cid) })), region: r?.region ?? "", regionEn: r?.regionEn ?? "", role: r?.role ?? "", roleEn: r?.roleEn ?? "", wiki: !person(p.id), state: members.length === 1 ? mini(members[0]!) : null }
    })
    return NextResponse.json({ day, source: IDENTITY_SOURCE, rows }, { headers })
  }

  // A registry ID folded into a Wiki entry redirects to that entry.
  if (ownerOf.has(id)) return NextResponse.json({ redirect: ownerOf.get(id) }, { headers })
  const members = membersOf.get(id) ?? (person(id) ? [id] : [])
  const sorted = cohortSorted()
  const people = members.map((cid) => {
    const p = person(cid)!, s = stateOf(cid), n = nickname(cid)
    return {
      person: p,
      nickname: n?.nickname ?? "", nicknameEn: n?.nicknameEn ?? "",
      state: s ? { h: s.h, w: s.w, a: s.a, assets: s.assets, debt: s.debt, care: s.care, pressure: s.pressure, opportunity: s.opportunity, triad: s.triad, triadField: s.triadField } : null,
      percentile: s ? { h: below(sorted.h, s.h), w: below(sorted.w, s.w), a: below(sorted.a, s.a) } : null,
    }
  })
  const { out, back } = links()
  const mid = (v: number[]) => v[v.length >> 1] ?? 0
  const peersFrom = members.find((c) => stateOf(c))
  return NextResponse.json({
    id, day, cohort: active.length, total: roster.length, source: IDENTITY_SOURCE,
    median: { h: mid(sorted.h), w: mid(sorted.w), a: mid(sorted.a) },
    people,
    links: {
      mentions: (out.get(id) ?? []).map(ref),
      backlinks: [...new Set(back.get(id) ?? [])].map(ref).filter((r) => r.id !== id),
      similar: peersFrom ? similar(peersFrom, 8) : [],
    },
  }, { headers })
}
