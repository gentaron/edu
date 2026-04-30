import { describe, it, expect } from "vitest"
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data"

const VALID_CATEGORIES = ["キャラクター", "用語", "組織", "地理", "技術", "歴史"]

describe("wiki-data", () => {
  it("ALL_ENTRIES should have a substantial number of entries", () => {
    expect(ALL_ENTRIES.length).toBeGreaterThanOrEqual(200)
  })

  it("each entry should have id, name, and category", () => {
    for (const entry of ALL_ENTRIES) {
      expect(entry).toHaveProperty("id")
      expect(entry).toHaveProperty("name")
      expect(entry).toHaveProperty("category")
      expect(typeof entry.id).toBe("string")
      expect(typeof entry.name).toBe("string")
      expect(typeof entry.category).toBe("string")
    }
  })

  it("image field should start with https:// if present", () => {
    for (const entry of ALL_ENTRIES) {
      if (entry.image) {
        expect(entry.image).toMatch(/^https:\/\//)
      }
    }
  })

  it("category should be one of the 6 valid categories", () => {
    for (const entry of ALL_ENTRIES) {
      expect(VALID_CATEGORIES).toContain(entry.category)
    }
  })
})
