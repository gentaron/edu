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

/**
 * Card Repository — in-memory data access layer for game cards and enemies.
 * Provides O(1) lookups by ID and pre-indexed collections for common queries.
 * All data is loaded eagerly at module initialization time.
 */
export const CardRepository = {
  /**
   * Find a player card by its unique ID.
   *
   * @param id - The card ID to look up (e.g. 'char-lin').
   * @returns The matching {@link GameCard}, or `undefined` if not found.
   * @example
   * const card = CardRepository.findCardById('char-lin')
   * // → { id: 'char-lin', name: 'リン', rarity: 'SR', ... }
   */
  findCardById(id: string): GameCard | undefined {
    return cardById.get(id)
  },

  /**
   * Get all player cards as a read-only array.
   *
   * @returns Read-only array of all {@link GameCard} objects.
   */
  getAllCards(): readonly GameCard[] {
    return ALL_CARDS
  },

  /**
   * Get player cards filtered by rarity tier.
   *
   * @param rarity - The rarity to filter by ('N', 'R', or 'SR').
   * @returns Array of cards matching the specified rarity.
   * @example
   * const srCards = CardRepository.getCardsByRarity('SR')
   * // → [{ id: 'char-lin', rarity: 'SR', ... }, ...]
   */
  getCardsByRarity(rarity: GameCard["rarity"]): GameCard[] {
    return ALL_CARDS.filter((c) => c.rarity === rarity)
  },

  /**
   * Get player cards filtered by affiliation/faction.
   *
   * @param affiliation - The affiliation string to filter by.
   * @returns Array of cards matching the specified affiliation.
   */
  getCardsByAffiliation(affiliation: string): GameCard[] {
    return ALL_CARDS.filter((c) => c.affiliation === affiliation)
  },

  /**
   * Find an enemy by its unique ID.
   *
   * @param id - The enemy ID to look up (e.g. 'void-king').
   * @returns The matching {@link Enemy}, or `undefined` if not found.
   */
  findEnemyById(id: string): Enemy | undefined {
    return enemyById.get(id)
  },

  /**
   * Get all enemies sorted by difficulty tier (NORMAL → HARD → BOSS → FINAL).
   *
   * @returns Read-only array of all enemies in difficulty order.
   */
  getAllEnemies(): readonly Enemy[] {
    const diffOrder: Record<string, number> = { NORMAL: 0, HARD: 1, BOSS: 2, FINAL: 3 }
    return [...ENEMIES].sort(
      (a, b) => (diffOrder[a.difficulty] ?? 0) - (diffOrder[b.difficulty] ?? 0)
    )
  },

  /**
   * Get enemies filtered by difficulty tier.
   *
   * @param difficulty - The difficulty to filter by ('NORMAL', 'HARD', 'BOSS', or 'FINAL').
   * @returns Array of enemies matching the specified difficulty.
   * @example
   * const bosses = CardRepository.getEnemiesByDifficulty('BOSS')
   * // → [{ id: 'void-king', difficulty: 'BOSS', ... }, ...]
   */
  getEnemiesByDifficulty(difficulty: Enemy["difficulty"]): Enemy[] {
    return ENEMIES.filter((e) => e.difficulty === difficulty)
  },
};
