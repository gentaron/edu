import { ALL_CARDS, ENEMIES } from "../card-data"
import type { GameCard, Enemy } from "../card-data"

export function getAllCards(): GameCard[] {
  return ALL_CARDS
}

export function getCardById(id: string): GameCard | undefined {
  return ALL_CARDS.find((card) => card.id === id)
}

export function getCardsByRarity(rarity: string): GameCard[] {
  return ALL_CARDS.filter((card) => card.rarity === rarity)
}

export function getCardsByAffiliation(affiliation: string): GameCard[] {
  return ALL_CARDS.filter((card) => card.affiliation.includes(affiliation))
}

export function getAllEnemies(): Enemy[] {
  return ENEMIES
}

export function getEnemyById(id: string): Enemy | undefined {
  return ENEMIES.find((enemy) => enemy.id === id)
}
