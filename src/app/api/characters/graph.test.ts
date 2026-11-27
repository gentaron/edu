// @vitest-environment node
import { describe, expect, it } from "vitest"
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data"
import identity from "@/app/wiki/state/identity.json"
import { pages, pageOf, ownerOf, membersOf, roster, stateOf, mentionsIn, links } from "./graph"

const norm = (s: string) => s.replace(/[\s・·\-‐－=＝_（）()／/「」"'.,，、]/g, "").toLowerCase()

describe("character identity graph", () => {
  it("has exactly one page per person", () => {
    const ids = pages.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of roster) {
      const page = pageOf(p.id)
      expect(ids).toContain(page)
      // a person folded into a Wiki entry never also has a registry page
      if (ownerOf.has(p.id)) expect(ids).not.toContain(p.id)
    }
    const claimed = [...membersOf.values()].flat()
    expect(new Set(claimed).size).toBe(claimed.length)
    expect(ids.length).toBe(roster.length)
    expect(new Set(roster.map(p => pageOf(p.id))).size).toBe(roster.length)
    expect(ids).not.toContain("Tina/Gue")
    for (const p of roster) {
      const state = stateOf(p.id)
      expect(state, p.id).toBeDefined()
      expect([state!.h, state!.w, state!.a].every(Number.isFinite), p.id).toBe(true)
    }
  })
  it("links every Wiki character whose name matches an edutext alias", () => {
    const alias = new Map<string, Set<string>>()
    for (const [cid, p] of Object.entries(identity.people)) for (const a of p.aliases) alias.set(norm(a), (alias.get(norm(a)) ?? new Set()).add(cid))
    for (const e of ALL_ENTRIES.filter((x) => x.category === "キャラクター")) {
      const hits = new Set([e.id, e.name, e.nameEn ?? ""].filter(Boolean).flatMap((k) => [...(alias.get(norm(k)) ?? [])]))
      if (hits.size > 0) expect(membersOf.has(e.id), `${e.id} matches ${[...hits]} but is not linked — rerun scripts/sync-edutext-identity.py`).toBe(true)
    }
  })
  it("resolves edutext names to canonical pages", () => {
    expect(pageOf("C002")).toBe("ミナ・エウレカ・エルンスト")
    expect(pageOf("C012")).toBe("グエ")
    expect(pageOf("C013")).toBe("C013")
    expect(pageOf("Tina/Gue")).toBe("グエ")
    expect(membersOf.get("グエ")).toEqual(["C012"])
    expect(mentionsIn("ヴィルヘルミナ・エウレカ・アーネストが来た", "x")).toEqual(["ミナ・エウレカ・エルンスト"])
    expect(mentionsIn("Wilhelmina Eureka Ernest arrived", "x")).toEqual(["ミナ・エウレカ・エルンスト"])
  })
  it("builds mention and backlink graphs without self-links", () => {
    const { out, back } = links()
    for (const [from, to] of out) expect(to).not.toContain(from)
    expect([...back.values()].flat().length).toBe([...out.values()].flat().length)
  })
})
