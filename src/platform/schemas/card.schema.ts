import { z } from "zod/v4"

export const AbilityTypeSchema = z.enum(["攻撃", "防御", "効果", "必殺"])
export const RaritySchema = z.enum(["C", "R", "SR"])

export const GameCardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  flavorText: z.string().min(1),
  rarity: RaritySchema,
  affiliation: z.string().min(1),
  attack: z.number().int().min(0),
  defense: z.number().int().min(0),
  effect: z.string().min(1),
  effectValue: z.number().int().min(0),
  ultimate: z.number().int().min(0),
  ultimateName: z.string().min(1),
})

export const EnemyDifficultySchema = z.enum(["NORMAL", "HARD", "BOSS", "FINAL"])

export const EnemyPhaseSchema = z.object({
  triggerHpPercent: z.number().min(0).max(100),
  message: z.string().min(1),
  attackBonus: z.number().int().min(0),
  selfHealPerTurn: z.number().int().min(0).optional(),
})

export const EnemySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  maxHp: z.number().int().positive(),
  attackPower: z.number().int().min(0),
  imageUrl: z.string().min(1),
  description: z.string().min(1),
  difficulty: EnemyDifficultySchema,
  reward: z.string().min(1),
  phases: z.array(EnemyPhaseSchema).min(1),
  specialRule: z.string().optional(),
})

export const FieldCharSchema = z.object({
  card: GameCardSchema,
  hp: z.number().int().min(0),
  maxHp: z.number().int().positive(),
  isDown: z.boolean(),
})

export type AbilityType = z.infer<typeof AbilityTypeSchema>
export type Rarity = z.infer<typeof RaritySchema>
export type GameCard = z.infer<typeof GameCardSchema>
export type EnemyDifficulty = z.infer<typeof EnemyDifficultySchema>
export type EnemyPhase = z.infer<typeof EnemyPhaseSchema>
export type Enemy = z.infer<typeof EnemySchema>
export type FieldChar = z.infer<typeof FieldCharSchema>
