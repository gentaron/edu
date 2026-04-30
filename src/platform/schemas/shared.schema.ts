/* ═══════════════════════════════════════════
   Platform — Shared Schemas
   Zod schemas for shared types used across domains.
   ═══════════════════════════════════════════ */

// Re-export card schema types for cross-domain usage
export {
  AbilityTypeSchema,
  RaritySchema,
  EnemyDifficultySchema,
  EnemyPhaseSchema,
  type AbilityType,
  type Rarity,
  type EnemyDifficulty,
  type EnemyPhase,
} from "@/l2-datalink/schemas/card.schema"

// Re-export wiki schema types for cross-domain usage
export { CategorySchema, type Category } from "@/l2-datalink/schemas/wiki.schema"
