import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { ALL_CARDS } from "@/domains/cards/cards.data"
import { ENEMIES } from "@/domains/cards/enemies"

/* ═══════════════════════════════════════════
   Property-Based Tests — Cards Data
   ═══════════════════════════════════════════ */

describe("PBT: cards.data", () => {
  /* ── All cards have positive attack ── */
  it("all cards have positive attack", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_CARDS.length - 1 }), (idx) => {
        const card = ALL_CARDS[idx]!
        expect(card.attack).toBeGreaterThan(0)
      })
    )
  })

  /* ── All cards have non-negative defense ── */
  it("all cards have non-negative defense", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_CARDS.length - 1 }), (idx) => {
        const card = ALL_CARDS[idx]!
        expect(card.defense).toBeGreaterThanOrEqual(0)
      })
    )
  })

  /* ── All cards have valid rarity ── */
  it("all cards have valid rarity", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_CARDS.length - 1 }), (idx) => {
        const card = ALL_CARDS[idx]!
        expect(["SR", "R", "C"]).toContain(card.rarity)
      })
    )
  })

  /* ── All cards have positive ultimate ── */
  it("all cards have positive ultimate", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ALL_CARDS.length - 1 }), (idx) => {
        const card = ALL_CARDS[idx]!
        expect(card.ultimate).toBeGreaterThan(0)
      })
    )
  })

  /* ── All enemies have positive maxHp ── */
  it("all enemies have positive maxHp", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ENEMIES.length - 1 }), (idx) => {
        const enemy = ENEMIES[idx]!
        expect(enemy.maxHp).toBeGreaterThan(0)
      })
    )
  })

  /* ── All enemies have positive attackPower ── */
  it("all enemies have positive attackPower", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: ENEMIES.length - 1 }), (idx) => {
        const enemy = ENEMIES[idx]!
        expect(enemy.attackPower).toBeGreaterThan(0)
      })
    )
  })

  /* ── Rarity distribution: SR < R ── */
  it("SR count is less than R count", () => {
    const srCount = ALL_CARDS.filter((c) => c.rarity === "SR").length
    const rCount = ALL_CARDS.filter((c) => c.rarity === "R").length
    expect(srCount).toBeLessThan(rCount)
  })

  /* ── Total card count is reasonable ── */
  it("total card count is in expected range", () => {
    expect(ALL_CARDS.length).toBeGreaterThanOrEqual(50)
    expect(ALL_CARDS.length).toBeLessThanOrEqual(100)
  })
})
