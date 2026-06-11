import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { ALL_STORIES } from "@/domains/stories/stories.meta"

/* ═══════════════════════════════════════════
   Property-Based Tests — Stories Meta
   ═══════════════════════════════════════════ */

describe("PBT: stories.meta", () => {
  /* ── No duplicate slugs (shuffled access) ── */
  it("no duplicate slugs in ALL_STORIES", () => {
    const slugs = ALL_STORIES.map((s) => s.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })

  /* ── Chapter in range [1, 5] ── */
  it("all stories have chapter in range [1, 5]", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_STORIES.length - 1 }), (idx) => {
        const story = ALL_STORIES[idx]!
        expect(story.chapter).toBeGreaterThanOrEqual(1)
        expect(story.chapter).toBeLessThanOrEqual(5)
      })
    )
  })

  /* ── chapterOrder in range [1, story count for that chapter] ── */
  it("chapterOrder is positive for all stories", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_STORIES.length - 1 }), (idx) => {
        const story = ALL_STORIES[idx]!
        expect(story.chapterOrder).toBeGreaterThanOrEqual(1)
      })
    )
  })

  /* ── fileName and fileNameAlt are non-empty ── */
  it("fileName and fileNameAlt are always non-empty", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_STORIES.length - 1 }), (idx) => {
        const story = ALL_STORIES[idx]!
        expect(story.fileName.length).toBeGreaterThan(0)
        expect(story.fileNameAlt.length).toBeGreaterThan(0)
      })
    )
  })

  /* ── relatedEntries is an array with non-empty strings ── */
  it("relatedEntries contains only non-empty strings", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_STORIES.length - 1 }), (idx) => {
        const story = ALL_STORIES[idx]!
        for (const rel of story.relatedEntries) {
          expect(typeof rel).toBe("string")
          expect(rel.length).toBeGreaterThan(0)
        }
      })
    )
  })

  /* ── isEnSource is boolean ── */
  it("isEnSource is always boolean", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_STORIES.length - 1 }), (idx) => {
        const story = ALL_STORIES[idx]!
        expect(typeof story.isEnSource).toBe("boolean")
      })
    )
  })
})
