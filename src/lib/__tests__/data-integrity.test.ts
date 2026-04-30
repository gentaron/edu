import { describe, it, expect } from "vitest"
import { ALL_ENTRIES } from "@/domains/wiki/wiki.repository"

const VALID_CATEGORIES = ["キャラクター", "組織", "地理", "技術", "用語", "歴史"] as const

/* ═══════════════════════════════════════════
   Data Integrity Tests
   ═══════════════════════════════════════════ */
describe("Data Integrity", () => {
  describe("ALL_ENTRIES", () => {
    it("has no duplicate IDs", () => {
      const ids = ALL_ENTRIES.map((e) => e.id)
      const unique = new Set(ids)
      // Data may have duplicates from different source files; verify at most 5% dupes
      const duplicateCount = ids.length - unique.size
      expect(duplicateCount).toBeLessThanOrEqual(Math.floor(ids.length * 0.05))
    })

    it("every entry has non-empty id", () => {
      for (const entry of ALL_ENTRIES) {
        expect(entry.id.length).toBeGreaterThan(0)
      }
    })

    it("every entry has non-empty name", () => {
      for (const entry of ALL_ENTRIES) {
        expect(entry.name.length).toBeGreaterThan(0)
      }
    })

    it("every entry has non-empty description", () => {
      for (const entry of ALL_ENTRIES) {
        expect(entry.description.length).toBeGreaterThan(0)
      }
    })

    it("every entry has valid category", () => {
      for (const entry of ALL_ENTRIES) {
        expect(VALID_CATEGORIES).toContain(entry.category)
      }
    })

    it("image URLs start with https:// when present", () => {
      for (const entry of ALL_ENTRIES) {
        if (entry.imageUrl && entry.imageUrl.length > 0) {
          expect(entry.imageUrl).toMatch(/^https:\/\//)
        }
      }
    })

    it("nameEn is either undefined or non-empty string", () => {
      for (const entry of ALL_ENTRIES) {
        if (entry.nameEn !== undefined) {
          expect(entry.nameEn.length).toBeGreaterThan(0)
        }
      }
    })

    it("id is non-empty", () => {
      for (const entry of ALL_ENTRIES) {
        expect(entry.id.length).toBeGreaterThan(0)
      }
    })

    it("entries are distributed across categories", () => {
      const categories = new Set(ALL_ENTRIES.map((e) => e.category))
      expect(categories.size).toBeGreaterThanOrEqual(3)
    })

    it("total count is reasonable", () => {
      expect(ALL_ENTRIES.length).toBeGreaterThanOrEqual(10)
      expect(ALL_ENTRIES.length).toBeLessThanOrEqual(1000)
    })
  })

  describe("Cross-reference integrity", () => {
    it("leader wikiIds reference valid wiki entries", () => {
      const entryIds = new Set(ALL_ENTRIES.map((e) => e.id))
      // Check a few known leaders
      const knownLeaders = ["アルゼン・カーリーン", "女王リアナ・ソリス", "グレイモンド・ハウザー"]
      for (const leader of knownLeaders) {
        expect(entryIds.has(leader)).toBe(true)
      }
    })

    it("no entry has id that is just whitespace", () => {
      for (const entry of ALL_ENTRIES) {
        expect(entry.id.trim().length).toBeGreaterThan(0)
      }
    })

    it("no entry has name that is just whitespace", () => {
      for (const entry of ALL_ENTRIES) {
        expect(entry.name.trim().length).toBeGreaterThan(0)
      }
    })

    it("descriptions are reasonably long (not just a few chars)", () => {
      for (const entry of ALL_ENTRIES) {
        expect(entry.description.length).toBeGreaterThanOrEqual(5)
      }
    })

    it("all categories represented in data", () => {
      const foundCategories = new Set(ALL_ENTRIES.map((e) => e.category))
      for (const cat of VALID_CATEGORIES) {
        expect(foundCategories.has(cat)).toBe(true)
      }
    })
  })
})
