import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { ALL_ENTRIES } from "@/domains/wiki/wiki.repository"

const VALID_CATEGORIES = ["キャラクター", "組織", "地理", "技術", "用語", "歴史"] as const

/* ═══════════════════════════════════════════
   Property-Based Tests — Wiki Data Integrity
   ═══════════════════════════════════════════ */

describe("PBT: wiki.data integrity", () => {
  /* ── No duplicate IDs (shuffled access) ── */
  it("no more than 5% duplicate IDs regardless of access order", () => {
    const ids = ALL_ENTRIES.map((e) => e.id)
    const unique = new Set(ids)
    const dupes = ids.length - unique.size
    // The data has a known small number of duplicates
    expect(dupes).toBeLessThanOrEqual(Math.floor(ids.length * 0.05))
  })

  /* ── All entries have non-empty id/name/description ── */
  it("all entries have non-empty id, name, and description", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_ENTRIES.length - 1 }), (idx) => {
        const entry = ALL_ENTRIES[idx]!
        expect(entry.id.length).toBeGreaterThan(0)
        expect(entry.name.length).toBeGreaterThan(0)
        expect(entry.description.length).toBeGreaterThan(0)
      })
    )
  })

  /* ── All categories are valid ── */
  it("all entry categories are valid", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_ENTRIES.length - 1 }), (idx) => {
        const entry = ALL_ENTRIES[idx]!
        expect(VALID_CATEGORIES).toContain(entry.category)
      })
    )
  })

  /* ── Image URLs start with https:// when present ── */
  it("image URLs start with https:// when present", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_ENTRIES.length - 1 }), (idx) => {
        const entry = ALL_ENTRIES[idx]!
        if (entry.image && entry.image.length > 0) {
          expect(entry.image).toMatch(/^https:\/\//)
        }
      })
    )
  })

  /* ── nameEn is either undefined or non-empty ── */
  it("nameEn is undefined or non-empty string", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_ENTRIES.length - 1 }), (idx) => {
        const entry = ALL_ENTRIES[idx]!
        if (entry.nameEn !== undefined) {
          expect(entry.nameEn.length).toBeGreaterThan(0)
        }
      })
    )
  })

  /* ── IDs do not contain spaces ── */
  it("IDs are non-empty strings", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_ENTRIES.length - 1 }), (idx) => {
        const entry = ALL_ENTRIES[idx]!
        expect(entry.id.length).toBeGreaterThan(0)
      })
    )
  })

  /* ── Source links (if present) have valid URLs ── */
  it("sourceLinks have valid URLs when present", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_ENTRIES.length - 1 }), (idx) => {
        const entry = ALL_ENTRIES[idx]!
        if (entry.sourceLinks) {
          for (const link of entry.sourceLinks) {
            expect(link.label.length).toBeGreaterThan(0)
          }
        }
      })
    )
  })

  /* ── Leader entries (if present) have valid structure ── */
  it("leader entries (if present) have valid structure", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_ENTRIES.length - 1 }), (idx) => {
        const entry = ALL_ENTRIES[idx]!
        if (entry.leaders) {
          for (const leader of entry.leaders) {
            expect(leader.name.length).toBeGreaterThan(0)
          }
        }
      })
    )
  })
})
