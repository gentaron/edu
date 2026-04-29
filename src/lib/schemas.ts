import { z } from "zod/v4"

export const CategorySchema = z.enum(["キャラクター", "用語", "組織", "地理", "技術", "歴史"])

export const WikiEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string().optional(),
  category: CategorySchema,
  subCategory: z.string().optional(),
  description: z.string(),
  era: z.string().optional(),
  affiliation: z.string().optional(),
  tier: z.string().optional(),
  image: z.string().optional(),
  sourceLinks: z
    .array(
      z.object({
        url: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  leaders: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        nameEn: z.string().optional(),
        role: z.string(),
        era: z.string().optional(),
      })
    )
    .optional(),
})

export const AbilityTypeSchema = z.enum(["攻撃", "防御", "効果", "必殺"])
export const RaritySchema = z.enum(["C", "R", "SR"])

export const GameCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  flavorText: z.string(),
  rarity: RaritySchema,
  affiliation: z.string(),
  attack: z.number(),
  defense: z.number(),
  effect: z.string(),
  effectValue: z.number(),
  ultimate: z.number(),
  ultimateName: z.string(),
})

export const EnemyDifficultySchema = z.enum(["NORMAL", "HARD", "BOSS", "FINAL"])

export const EnemyPhaseSchema = z.object({
  triggerHpPercent: z.number(),
  message: z.string(),
  attackBonus: z.number(),
  selfHealPerTurn: z.number().optional(),
})

export const EnemySchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  maxHp: z.number(),
  attackPower: z.number(),
  imageUrl: z.string(),
  description: z.string(),
  difficulty: EnemyDifficultySchema,
  reward: z.string(),
  phases: z.array(EnemyPhaseSchema),
  specialRule: z.string().optional(),
})

// Type exports derived from schemas
export type { WikiEntry } from "@/types"
export type { GameCard } from "@/types"
export type { Enemy } from "@/types"
