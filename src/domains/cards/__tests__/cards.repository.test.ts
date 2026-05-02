import { describe, it, expect } from "vitest"
import { CardRepository } from "@/domains/cards/cards.repository"
import type { CardId, EnemyId } from "@/platform/schemas/branded"
import type { GameCard, Enemy } from "@/types"

describe("CardRepository", () => {
  /* ── findCardById ── */
  describe("findCardById", () => {
    it("finds a card by ID", () => {
      const cards = CardRepository.getAllCards()
      const firstCard = cards[0]!
      const found = CardRepository.findCardById(firstCard.id)
      expect(found).toBeDefined()
      expect(found!.id).toBe(firstCard.id)
    })

    it("returns undefined for non-existent ID", () => {
      const found = CardRepository.findCardById("nonexistent-card" as CardId)
      expect(found).toBeUndefined()
    })
  })

  /* ── getAllCards ── */
  describe("getAllCards", () => {
    it("returns non-empty array", () => {
      const cards = CardRepository.getAllCards()
      expect(cards.length).toBeGreaterThan(0)
    })

    it("cards have unique IDs", () => {
      const cards = CardRepository.getAllCards()
      const ids = cards.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it("cards have required fields", () => {
      const cards = CardRepository.getAllCards()
      for (const card of cards) {
        expect(card).toHaveProperty("id")
        expect(card).toHaveProperty("name")
        expect(card).toHaveProperty("rarity")
        expect(card).toHaveProperty("attack")
        expect(card).toHaveProperty("defense")
        expect(card).toHaveProperty("effect")
        expect(card).toHaveProperty("ultimate")
        expect(card).toHaveProperty("ultimateName")
      }
    })
  })

  /* ── getCardsByRarity ── */
  describe("getCardsByRarity", () => {
    it("returns cards filtered by rarity R", () => {
      const rCards = CardRepository.getCardsByRarity("R")
      expect(rCards.length).toBeGreaterThan(0)
      expect(rCards.every((c) => c.rarity === "R")).toBe(true)
    })

    it("returns cards filtered by rarity SR", () => {
      const srCards = CardRepository.getCardsByRarity("SR")
      expect(srCards.length).toBeGreaterThan(0)
      expect(srCards.every((c) => c.rarity === "SR")).toBe(true)
    })

    it("returns cards filtered by rarity C", () => {
      const cCards = CardRepository.getCardsByRarity("C")
      expect(cCards.every((c) => c.rarity === "C")).toBe(true)
    })

    it("returns empty array for rarity with no cards", () => {
      // There likely aren't any cards with unusual rarity, but the filter should work
      const filtered = CardRepository.getCardsByRarity("SSR" as GameCard["rarity"])
      expect(filtered).toHaveLength(0)
    })
  })

  /* ── getCardsByAffiliation ── */
  describe("getCardsByAffiliation", () => {
    it("returns cards filtered by affiliation", () => {
      const allCards = CardRepository.getAllCards()
      const firstAffiliation = allCards[0]!.affiliation
      const filtered = CardRepository.getCardsByAffiliation(firstAffiliation)
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every((c) => c.affiliation === firstAffiliation)).toBe(true)
    })

    it("returns empty for non-existent affiliation", () => {
      const filtered = CardRepository.getCardsByAffiliation("Nonexistent")
      expect(filtered).toHaveLength(0)
    })
  })

  /* ── findEnemyById ── */
  describe("findEnemyById", () => {
    it("finds an enemy by ID", () => {
      const enemies = CardRepository.getAllEnemies()
      const firstEnemy = enemies[0]!
      const found = CardRepository.findEnemyById(firstEnemy.id)
      expect(found).toBeDefined()
      expect(found!.id).toBe(firstEnemy.id)
    })

    it("returns undefined for non-existent ID", () => {
      const found = CardRepository.findEnemyById("nonexistent-enemy" as EnemyId)
      expect(found).toBeUndefined()
    })
  })

  /* ── getAllEnemies ── */
  describe("getAllEnemies", () => {
    it("returns non-empty array", () => {
      const enemies = CardRepository.getAllEnemies()
      expect(enemies.length).toBeGreaterThan(0)
    })

    it("enemies are sorted by difficulty", () => {
      const enemies = CardRepository.getAllEnemies()
      const diffOrder: Record<string, number> = { NORMAL: 0, HARD: 1, BOSS: 2, FINAL: 3 }
      for (let i = 1; i < enemies.length; i++) {
        const prevOrder = diffOrder[enemies[i - 1]!.difficulty] ?? 0
        const currOrder = diffOrder[enemies[i]!.difficulty] ?? 0
        expect(currOrder).toBeGreaterThanOrEqual(prevOrder)
      }
    })

    it("enemies have required fields", () => {
      const enemies = CardRepository.getAllEnemies()
      for (const enemy of enemies) {
        expect(enemy).toHaveProperty("id")
        expect(enemy).toHaveProperty("name")
        expect(enemy).toHaveProperty("maxHp")
        expect(enemy).toHaveProperty("attackPower")
        expect(enemy).toHaveProperty("difficulty")
        expect(enemy).toHaveProperty("phases")
        expect(enemy.phases.length).toBeGreaterThan(0)
      }
    })
  })

  /* ── getEnemiesByDifficulty ── */
  describe("getEnemiesByDifficulty", () => {
    it("returns enemies filtered by NORMAL difficulty", () => {
      const normal = CardRepository.getEnemiesByDifficulty("NORMAL")
      expect(normal.every((e) => e.difficulty === "NORMAL")).toBe(true)
    })

    it("returns enemies filtered by HARD difficulty", () => {
      const hard = CardRepository.getEnemiesByDifficulty("HARD")
      expect(hard.every((e) => e.difficulty === "HARD")).toBe(true)
    })

    it("returns enemies filtered by BOSS difficulty", () => {
      const boss = CardRepository.getEnemiesByDifficulty("BOSS")
      expect(boss.every((e) => e.difficulty === "BOSS")).toBe(true)
    })

    it("returns enemies filtered by FINAL difficulty", () => {
      const final_ = CardRepository.getEnemiesByDifficulty("FINAL")
      expect(final_.every((e) => e.difficulty === "FINAL")).toBe(true)
    })

    it("returns empty array for non-existent difficulty", () => {
      const filtered = CardRepository.getEnemiesByDifficulty("IMPOSSIBLE" as Enemy["difficulty"])
      expect(filtered).toHaveLength(0)
    })
  })
})
