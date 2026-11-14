import { describe, expect, it } from "vitest"
import { ALL_ENTRIES } from "../wiki.data"
import { buildWikiIndex } from "../wiki-export"

describe("public wiki handoff", () => {
  it("exports one stable, linkable metadata row per public wiki page", () => {
    const entries = buildWikiIndex()
    expect(entries).toHaveLength(ALL_ENTRIES.length)
    expect(entries.map((entry) => entry.id)).toEqual(
      [...entries.map((entry) => entry.id)].sort((a, b) => a.localeCompare(b)),
    )
    for (const entry of entries) {
      expect(entry.url).toBe(`/wiki/${encodeURIComponent(entry.id)}`)
      expect(Object.keys(entry).sort()).toEqual(["category", "id", "name", "nameEn", "url"])
    }
  })
})
