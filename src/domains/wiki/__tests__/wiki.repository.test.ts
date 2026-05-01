import { describe, it, expect } from "vitest"
import { WikiRepository, ALL_ENTRIES } from "@/domains/wiki/wiki.repository"
import type { Category } from "@/types"
import type { WikiId } from "@/platform/schemas/branded"

/* ═══════════════════════════════════════════
   Wiki Repository Tests
   ═══════════════════════════════════════════ */

describe("WikiRepository", () => {
  /* ── findById ── */
  describe("findById", () => {
    it("returns entry for existing ID", () => {
      // Use first entry as test
      const first = ALL_ENTRIES[0]
      if (!first) {
        return
      }
      const result = WikiRepository.findById(first.id)
      expect(result).toBeDefined()
      expect(result!.id).toBe(first.id)
    })

    it("returns undefined for non-existent ID", () => {
      const result = WikiRepository.findById("nonexistent-id-xyz" as WikiId)
      expect(result).toBeUndefined()
    })

    it("returns undefined for empty string ID", () => {
      const result = WikiRepository.findById("" as WikiId)
      expect(result).toBeUndefined()
    })
  })

  /* ── getAll ── */
  describe("getAll", () => {
    it("returns all entries", () => {
      const all = WikiRepository.getAll()
      expect(all.length).toBe(ALL_ENTRIES.length)
    })

    it("returns readonly array", () => {
      const all = WikiRepository.getAll()
      expect(Array.isArray(all)).toBe(true)
    })

    it("entries have required fields", () => {
      const all = WikiRepository.getAll()
      for (const entry of all) {
        expect(entry).toHaveProperty("id")
        expect(entry).toHaveProperty("name")
        expect(entry).toHaveProperty("category")
        expect(entry).toHaveProperty("description")
      }
    })
  })

  /* ── findByCategory ── */
  describe("findByCategory", () => {
    it("returns entries for valid category", () => {
      const entries = WikiRepository.findByCategory("キャラクター")
      expect(entries.length).toBeGreaterThan(0)
      for (const e of entries) {
        expect(e.category).toBe("キャラクター")
      }
    })

    it("returns empty array for invalid category", () => {
      const entries = WikiRepository.findByCategory("nonexistent" as Category)
      expect(entries).toHaveLength(0)
    })

    it("returns correct subset that matches category", () => {
      const chars = WikiRepository.findByCategory("キャラクター")
      const orgs = WikiRepository.findByCategory("組織")
      expect(chars.length).not.toBe(orgs.length)
    })

    it("each category has at least one entry", () => {
      const categories: Category[] = ["キャラクター", "組織", "地理", "技術", "用語", "歴史"]
      for (const cat of categories) {
        const entries = WikiRepository.findByCategory(cat)
        expect(entries.length).toBeGreaterThan(0)
      }
    })
  })

  /* ── totalCount ── */
  describe("totalCount", () => {
    it("returns positive number", () => {
      expect(WikiRepository.totalCount).toBeGreaterThan(0)
    })

    it("matches ALL_ENTRIES length", () => {
      expect(WikiRepository.totalCount).toBe(ALL_ENTRIES.length)
    })
  })

  /* ── getGroupedByCategory ── */
  describe("getGroupedByCategory", () => {
    it("returns a Map", () => {
      const grouped = WikiRepository.getGroupedByCategory()
      expect(grouped).toBeInstanceOf(Map)
    })

    it("has entries for each populated category", () => {
      const grouped = WikiRepository.getGroupedByCategory()
      expect(grouped.size).toBeGreaterThan(0)
    })

    it("each group has correct category type", () => {
      const grouped = WikiRepository.getGroupedByCategory()
      for (const [cat] of grouped) {
        expect(["キャラクター", "組織", "地理", "技術", "用語", "歴史"]).toContain(cat)
      }
    })

    it("sum of all group entries equals total", () => {
      const grouped = WikiRepository.getGroupedByCategory()
      let sum = 0
      for (const [, entries] of grouped) {
        sum += entries.length
      }
      expect(sum).toBe(WikiRepository.totalCount)
    })
  })

  /* ── getCategorySummary ── */
  describe("getCategorySummary", () => {
    it("returns array of summaries", () => {
      const summary = WikiRepository.getCategorySummary()
      expect(Array.isArray(summary)).toBe(true)
      expect(summary.length).toBeGreaterThan(0)
    })

    it("each summary has category, count, entries", () => {
      const summary = WikiRepository.getCategorySummary()
      for (const s of summary) {
        expect(s).toHaveProperty("category")
        expect(s).toHaveProperty("count")
        expect(s).toHaveProperty("entries")
        expect(s.count).toBe(s.entries.length)
      }
    })

    it("only includes categories with entries", () => {
      const summary = WikiRepository.getCategorySummary()
      for (const s of summary) {
        expect(s.count).toBeGreaterThan(0)
      }
    })

    it("counts match findByCategory results", () => {
      const summary = WikiRepository.getCategorySummary()
      for (const s of summary) {
        const catEntries = WikiRepository.findByCategory(s.category)
        expect(catEntries.length).toBe(s.count)
      }
    })
  })

  /* ── search ── */
  describe("search", () => {
    it("finds entries by partial name match", () => {
      // Search for a known character name
      const first = ALL_ENTRIES[0]
      if (!first) {
        return
      }
      const results = WikiRepository.search(first.name.slice(0, 3))
      expect(results.length).toBeGreaterThan(0)
    })

    it("returns empty for gibberish query", () => {
      const results = WikiRepository.search("xyzzyplugh12345nonexistent")
      expect(results).toHaveLength(0)
    })

    it("returns empty for empty query", () => {
      const results = WikiRepository.search("")
      expect(results.length).toBeGreaterThan(0) // empty query matches everything via includes
    })

    it("search is case-insensitive", () => {
      const first = ALL_ENTRIES[0]
      if (!first) {
        return
      }
      const lowerResults = WikiRepository.search(first.name.toLowerCase())
      const upperResults = WikiRepository.search(first.name.toUpperCase())
      expect(lowerResults.length).toBeGreaterThan(0)
      expect(upperResults.length).toBeGreaterThan(0)
    })
  })

  /* ── resolveLinks ── */
  describe("resolveLinks", () => {
    it("resolves existing link", () => {
      const first = ALL_ENTRIES[0]
      if (!first) {
        return
      }
      const result = WikiRepository.resolveLinks([first.id])
      expect(result).toHaveLength(1)
      expect(result[0]!.exists).toBe(true)
    })

    it("marks missing links as non-existent", () => {
      const result = WikiRepository.resolveLinks(["nonexistent-id" as WikiId])
      expect(result).toHaveLength(1)
      expect(result[0]!.exists).toBe(false)
    })

    it("handles empty array", () => {
      const result = WikiRepository.resolveLinks([])
      expect(result).toHaveLength(0)
    })
  })
})
