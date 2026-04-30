/* ═══════════════════════════════════════════
   Cards Domain — Card Repository
   Data access layer for game cards and enemies.
   ═══════════════════════════════════════════ */

import { ALL_CARDS, ENEMIES } from "./cards.data"
import type { GameCard, Enemy } from "@/types"

const cardById = new Map<string, GameCard>()
for (const card of ALL_CARDS) {
  cardById.set(card.id, card)
}

const enemyById = new Map<string, Enemy>()
for (const enemy of ENEMIES) {
  enemyById.set(enemy.id, enemy)
}

export class CardRepository {
  /** Find a card by ID */
  static findCardById(id: string): GameCard | undefined {
    return cardById.get(id)
  }

  /** Get all player cards */
  static getAllCards(): readonly GameCard[] {
    return ALL_CARDS
  }

  /** Get cards filtered by rarity */
  static getCardsByRarity(rarity: GameCard["rarity"]): GameCard[] {
    return ALL_CARDS.filter((c) => c.rarity === rarity)
  }

  /** Get cards filtered by affiliation */
  static getCardsByAffiliation(affiliation: string): GameCard[] {
    return ALL_CARDS.filter((c) => c.affiliation === affiliation)
  }

  /** Find an enemy by ID */
  static findEnemyById(id: string): Enemy | undefined {
    return enemyById.get(id)
  }

  /** Get all enemies sorted by difficulty */
  static getAllEnemies(): readonly Enemy[] {
    const diffOrder: Record<string, number> = { NORMAL: 0, HARD: 1, BOSS: 2, FINAL: 3 }
    return [...ENEMIES].sort(
      (a, b) => (diffOrder[a.difficulty] ?? 0) - (diffOrder[b.difficulty] ?? 0)
    )
  }

  /** Get enemies by difficulty */
  static getEnemiesByDifficulty(difficulty: Enemy["difficulty"]): Enemy[] {
    return ENEMIES.filter((e) => e.difficulty === difficulty)
  }
}
