import type { GameCard } from "./card"

export interface FieldChar {
  card: GameCard
  hp: number
  maxHp: number
  isDown: boolean
}
