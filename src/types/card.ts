export type AbilityType = "攻撃" | "防御" | "効果" | "必殺"

/** Effect classification enum — O(1) switch dispatch instead of string.includes() */
export const EffectType = {
  HEAL: "HEAL",
  DAMAGE: "DAMAGE",
  SHIELD: "SHIELD",
  HEAL_DAMAGE: "HEAL_DAMAGE",
  DAMAGE_HEAL: "DAMAGE_HEAL",
  DAMAGE_SHIELD: "DAMAGE_SHIELD",
  HEAL_SHIELD: "HEAL_SHIELD",
  HEAL_DAMAGE_SHIELD: "HEAL_DAMAGE_SHIELD",
  ATTACK_REDUCTION: "ATTACK_REDUCTION",
  SPECIAL_PANDICT: "SPECIAL_PANDICT",
} as const

export type EffectType = (typeof EffectType)[keyof typeof EffectType]

/** Classify a Japanese effect string into an EffectType enum value. */
export function classifyEffect(effect: string): EffectType {
  const hasHeal = effect.includes("回復")
  const hasDamage = effect.includes("ダメージ")
  const hasShield = effect.includes("シールド")
  const hasReduction = effect.includes("低下")
  const hasPandict = effect.includes("次元階梯パンディクト")

  if (hasPandict) return EffectType.SPECIAL_PANDICT
  if (hasReduction) return EffectType.ATTACK_REDUCTION
  if (hasHeal && hasDamage && hasShield) return EffectType.HEAL_DAMAGE_SHIELD
  if (hasDamage && hasHeal) return EffectType.DAMAGE_HEAL
  if (hasDamage && hasShield) return EffectType.DAMAGE_SHIELD
  if (hasHeal && hasShield) return EffectType.HEAL_SHIELD
  if (hasHeal) return EffectType.HEAL
  if (hasDamage) return EffectType.DAMAGE
  if (hasShield) return EffectType.SHIELD

  // Default: treat unknown as heal (preserves original behavior)
  return EffectType.HEAL
}

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
  effectType: EffectType
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
