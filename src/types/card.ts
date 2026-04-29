export type AbilityType = "攻撃" | "防御" | "効果" | "必殺"

export interface GameCard {
  id: string
  name: string
  imageUrl: string
  flavorText: string
  rarity: "C" | "R" | "SR"
  affiliation: string
  attack: number
  defense: number
  effect: string
  effectValue: number
  ultimate: number
  ultimateName: string
}

export interface EnemyPhase {
  triggerHpPercent: number
  message: string
  attackBonus: number
  selfHealPerTurn?: number
}

export interface Enemy {
  id: string
  name: string
  title: string
  maxHp: number
  attackPower: number
  imageUrl: string
  description: string
  difficulty: "NORMAL" | "HARD" | "BOSS" | "FINAL"
  reward: string
  phases: EnemyPhase[]
  specialRule?: string
}
