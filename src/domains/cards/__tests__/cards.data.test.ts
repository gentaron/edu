import { describe, it, expect } from "vitest"
import { ALL_CARDS } from "@/domains/cards/cards.data"
import { ENEMIES } from "@/domains/cards/enemies"
import type { GameCard, Enemy } from "@/types"

/* ═══════════════════════════════════════════
   ALL_CARDS Data Tests
   ═══════════════════════════════════════════ */
describe("ALL_CARDS", () => {
  it("has entries", () => {
    expect(ALL_CARDS.length).toBeGreaterThan(0)
  })

  it("has no duplicate IDs", () => {
    const ids = ALL_CARDS.map((c) => c.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it("every card has required fields", () => {
    const requiredFields: (keyof GameCard)[] = [
      "id", "name", "imageUrl", "flavorText", "rarity",
      "affiliation", "attack", "defense", "effect", "effectValue",
      "ultimate", "ultimateName",
    ]
    for (const card of ALL_CARDS) {
      for (const field of requiredFields) {
        expect(card).toHaveProperty(field)
      }
    }
  })

  it("every card has positive attack", () => {
    for (const card of ALL_CARDS) {
      expect(card.attack).toBeGreaterThan(0)
    }
  })

  it("every card has non-negative defense", () => {
    for (const card of ALL_CARDS) {
      expect(card.defense).toBeGreaterThanOrEqual(0)
    }
  })

  it("every card has positive effectValue", () => {
    for (const card of ALL_CARDS) {
      expect(card.effectValue).toBeGreaterThan(0)
    }
  })

  it("every card has positive ultimate", () => {
    for (const card of ALL_CARDS) {
      expect(card.ultimate).toBeGreaterThan(0)
    }
  })

  it("rarity is valid for all cards", () => {
    const validRarities = ["SR", "R", "C"]
    for (const card of ALL_CARDS) {
      expect(validRarities).toContain(card.rarity)
    }
  })

  it("affiliation is non-empty for all cards", () => {
    for (const card of ALL_CARDS) {
      expect(card.affiliation.length).toBeGreaterThan(0)
    }
  })

  it("name is non-empty for all cards", () => {
    for (const card of ALL_CARDS) {
      expect(card.name.length).toBeGreaterThan(0)
    }
  })

  it("id starts with char- for all cards", () => {
    for (const card of ALL_CARDS) {
      expect(card.id).toMatch(/^char-/)
    }
  })

  it("SR cards have higher base stats than C cards", () => {
    const srCards = ALL_CARDS.filter((c) => c.rarity === "SR")
    const cCards = ALL_CARDS.filter((c) => c.rarity === "C")
    if (srCards.length > 0 && cCards.length > 0) {
      const srAvgAttack = srCards.reduce((s, c) => s + c.attack, 0) / srCards.length
      const cAvgAttack = cCards.reduce((s, c) => s + c.attack, 0) / cCards.length
      expect(srAvgAttack).toBeGreaterThan(cAvgAttack)
    }
  })

  it("rarity distribution has all three types", () => {
    const rarities = new Set(ALL_CARDS.map((c) => c.rarity))
    expect(rarities.has("SR")).toBe(true)
    expect(rarities.has("R")).toBe(true)
    expect(rarities.has("C")).toBe(true)
  })

  it("has more R cards than SR cards", () => {
    const srCount = ALL_CARDS.filter((c) => c.rarity === "SR").length
    const rCount = ALL_CARDS.filter((c) => c.rarity === "R").length
    expect(rCount).toBeGreaterThan(srCount)
  })

  it("effect is non-empty string", () => {
    for (const card of ALL_CARDS) {
      expect(typeof card.effect).toBe("string")
      expect(card.effect.length).toBeGreaterThan(0)
    }
  })

  it("ultimateName is non-empty string", () => {
    for (const card of ALL_CARDS) {
      expect(typeof card.ultimateName).toBe("string")
      expect(card.ultimateName.length).toBeGreaterThan(0)
    }
  })

  it("flavorText is non-empty string", () => {
    for (const card of ALL_CARDS) {
      expect(typeof card.flavorText).toBe("string")
      expect(card.flavorText.length).toBeGreaterThan(0)
    }
  })

  it("imageUrl is non-empty string", () => {
    for (const card of ALL_CARDS) {
      expect(typeof card.imageUrl).toBe("string")
      expect(card.imageUrl.length).toBeGreaterThan(0)
    }
  })
})

/* ═══════════════════════════════════════════
   ENEMIES Data Tests
   ═══════════════════════════════════════════ */
describe("ENEMIES", () => {
  it("has 10 entries", () => {
    expect(ENEMIES).toHaveLength(10)
  })

  it("has no duplicate IDs", () => {
    const ids = ENEMIES.map((e) => e.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it("every enemy has required fields", () => {
    const requiredFields: (keyof Enemy)[] = [
      "id", "name", "title", "maxHp", "attackPower", "imageUrl",
      "description", "difficulty", "reward", "phases",
    ]
    for (const enemy of ENEMIES) {
      for (const field of requiredFields) {
        expect(enemy).toHaveProperty(field)
      }
    }
  })

  it("every enemy has positive maxHp", () => {
    for (const enemy of ENEMIES) {
      expect(enemy.maxHp).toBeGreaterThan(0)
    }
  })

  it("every enemy has positive attackPower", () => {
    for (const enemy of ENEMIES) {
      expect(enemy.attackPower).toBeGreaterThan(0)
    }
  })

  it("difficulty is valid", () => {
    const validDifficulties = ["NORMAL", "HARD", "BOSS", "FINAL"]
    for (const enemy of ENEMIES) {
      expect(validDifficulties).toContain(enemy.difficulty)
    }
  })

  it("has correct difficulty distribution", () => {
    const normal = ENEMIES.filter((e) => e.difficulty === "NORMAL").length
    const hard = ENEMIES.filter((e) => e.difficulty === "HARD").length
    const boss = ENEMIES.filter((e) => e.difficulty === "BOSS").length
    const final = ENEMIES.filter((e) => e.difficulty === "FINAL").length
    expect(normal).toBe(4)
    expect(hard).toBe(3)
    expect(boss).toBe(2)
    expect(final).toBe(1)
  })

  it("every enemy has at least one phase", () => {
    for (const enemy of ENEMIES) {
      expect(enemy.phases.length).toBeGreaterThan(0)
    }
  })

  it("phase triggerHpPercent is in (0, 100]", () => {
    for (const enemy of ENEMIES) {
      for (const phase of enemy.phases) {
        expect(phase.triggerHpPercent).toBeGreaterThan(0)
        expect(phase.triggerHpPercent).toBeLessThanOrEqual(100)
      }
    }
  })

  it("HP increases with difficulty (on average)", () => {
    const normalAvg = ENEMIES.filter((e) => e.difficulty === "NORMAL").reduce((s, e) => s + e.maxHp, 0) / 4
    const bossAvg = ENEMIES.filter((e) => e.difficulty === "BOSS").reduce((s, e) => s + e.maxHp, 0) / 2
    expect(bossAvg).toBeGreaterThan(normalAvg)
  })

  it("attack bonus is non-negative in all phases", () => {
    for (const enemy of ENEMIES) {
      for (const phase of enemy.phases) {
        expect(phase.attackBonus).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it("description is non-empty for all enemies", () => {
    for (const enemy of ENEMIES) {
      expect(enemy.description.length).toBeGreaterThan(0)
    }
  })

  it("name is non-empty for all enemies", () => {
    for (const enemy of ENEMIES) {
      expect(enemy.name.length).toBeGreaterThan(0)
    }
  })

  it("FINAL boss has highest maxHp", () => {
    const finalBoss = ENEMIES.find((e) => e.difficulty === "FINAL")
    for (const enemy of ENEMIES) {
      expect(finalBoss!.maxHp).toBeGreaterThanOrEqual(enemy.maxHp)
    }
  })

  it("FINAL boss has highest attackPower", () => {
    const finalBoss = ENEMIES.find((e) => e.difficulty === "FINAL")
    for (const enemy of ENEMIES) {
      expect(finalBoss!.attackPower).toBeGreaterThanOrEqual(enemy.attackPower)
    }
  })

  it("phases are ordered by descending triggerHpPercent", () => {
    for (const enemy of ENEMIES) {
      for (let i = 1; i < enemy.phases.length; i++) {
        expect(enemy.phases[i - 1]!.triggerHpPercent).toBeGreaterThan(
          enemy.phases[i]!.triggerHpPercent
        )
      }
    }
  })
})
