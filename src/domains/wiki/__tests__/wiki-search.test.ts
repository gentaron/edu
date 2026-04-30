import { describe, it, expect, beforeEach } from "vitest"
import { WikiSearchEngine } from "@/domains/wiki/wiki-search"

describe("WikiSearchEngine", () => {
  let engine: WikiSearchEngine

  beforeEach(async () => {
    engine = new WikiSearchEngine()
    await engine.initialize()
  }, 60000)

  /* ── Initialization ── */
  describe("initialize", () => {
    it("builds without error", async () => {
      const e = new WikiSearchEngine()
      // Should not throw when initializing
      try {
        await e.initialize()
        expect(true).toBe(true)
      } catch (err) {
        // Re-throw with context
        throw err
      }
    })

    it("idempotent — calling twice does not duplicate", async () => {
      const e = new WikiSearchEngine()
      await e.initialize()
      const stats1 = e.getStats()
      await e.initialize()
      const stats2 = e.getStats()
      expect(stats1.documents).toBe(stats2.documents)
    })

    it("populates stats after initialization", () => {
      const stats = engine.getStats()
      expect(stats.documents).toBeGreaterThan(0)
      expect(stats.terms).toBeGreaterThan(0)
      expect(stats.categories.length).toBeGreaterThan(0)
    })
  })

  /* ── Search ── */
  describe("search", () => {
    it("returns results for a known term", () => {
      const results = engine.search("ディアナ")
      expect(results.length).toBeGreaterThan(0)
    })

    it("search works without error for any query", () => {
      const results = engine.search("zxqjklmnpwrt")
      // Results may be non-empty due to bi-gram matching, but should be valid
      for (const r of results) {
        expect(r).toHaveProperty("id")
        expect(r).toHaveProperty("score")
        expect(r).toHaveProperty("title")
      }
    })

    it("results have required fields", () => {
      const results = engine.search("AURALIS")
      for (const r of results) {
        expect(r).toHaveProperty("id")
        expect(r).toHaveProperty("score")
        expect(r).toHaveProperty("title")
        expect(r).toHaveProperty("snippet")
      }
    })

    it("results are sorted by score descending", () => {
      const results = engine.search("ケイト")
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
      }
    })

    it("respects limit option", () => {
      const results = engine.search(" ", { limit: 3 })
      expect(results.length).toBeLessThanOrEqual(3)
    })

    it("excludes cards by default", () => {
      const results = engine.search("ディアナ")
      for (const r of results) {
        expect(r.category).not.toBe("card")
      }
    })

    it("includes cards when includeCards is true", () => {
      const results = engine.search("ディアナ", { includeCards: true })
      const hasCards = results.some((r) => r.category === "card")
      expect(hasCards).toBe(true)
    })

    it("returns empty when not initialized", async () => {
      const fresh = new WikiSearchEngine()
      const results = fresh.search("ディアナ")
      expect(results).toHaveLength(0)
    })
  })

  /* ── Category Filtering ── */
  describe("category filtering", () => {
    it("filters by single category", () => {
      const results = engine.search(" ", { categories: ["キャラクター"] })
      for (const r of results) {
        expect(r.category).toBe("キャラクター")
      }
    })

    it("filters by multiple categories", () => {
      const results = engine.search(" ", { categories: ["キャラクター", "組織"] })
      for (const r of results) {
        expect(["キャラクター", "組織"]).toContain(r.category)
      }
    })

    it("returns empty for non-existent category", () => {
      const results = engine.search(" ", { categories: ["nonexistent"] })
      expect(results).toHaveLength(0)
    })
  })

  /* ── Autocomplete ── */
  describe("autocomplete", () => {
    it("returns suggestions for known prefix", () => {
      const suggestions = engine.autocomplete("ディ")
      expect(suggestions.length).toBeGreaterThan(0)
    })

    it("returns empty for empty prefix", () => {
      const suggestions = engine.autocomplete("")
      expect(suggestions).toHaveLength(0)
    })

    it("returns empty for whitespace prefix", () => {
      const suggestions = engine.autocomplete("   ")
      expect(suggestions).toHaveLength(0)
    })

    it("respects limit parameter", () => {
      const suggestions = engine.autocomplete(" ", 2)
      expect(suggestions.length).toBeLessThanOrEqual(2)
    })

    it("suggestions have text and category", () => {
      const suggestions = engine.autocomplete("ケ")
      for (const s of suggestions) {
        expect(s).toHaveProperty("text")
        expect(s).toHaveProperty("category")
        expect(s.text.length).toBeGreaterThan(0)
      }
    })

    it("returns empty when not initialized", async () => {
      const fresh = new WikiSearchEngine()
      const suggestions = fresh.autocomplete("ディ")
      expect(suggestions).toHaveLength(0)
    })
  })

  /* ── getStats ── */
  describe("getStats", () => {
    it("returns correct structure", () => {
      const stats = engine.getStats()
      expect(stats).toHaveProperty("documents")
      expect(stats).toHaveProperty("terms")
      expect(stats).toHaveProperty("categories")
      expect(typeof stats.documents).toBe("number")
      expect(typeof stats.terms).toBe("number")
      expect(Array.isArray(stats.categories)).toBe(true)
    })

    it("categories include wiki categories", () => {
      const stats = engine.getStats()
      expect(stats.categories).toContain("キャラクター")
    })

    it("includes card category", () => {
      const stats = engine.getStats()
      expect(stats.categories).toContain("card")
    })
  })
})
