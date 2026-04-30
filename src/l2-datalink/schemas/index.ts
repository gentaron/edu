/* ═══════════════════════════════════════════
   L2 DATALINK — Schema Registry
   All Zod schemas and derived types.
   Each layer Ln depends only on Ln-1 schemas.
   ═══════════════════════════════════════════ */

export {
  CategorySchema,
  SourceLinkSchema,
  LeaderEntrySchema,
  WikiEntrySchema,
  type Category,
  type SourceLink,
  type LeaderEntry,
  type WikiEntry,
} from "./wiki.schema"

export {
  AbilityTypeSchema,
  RaritySchema,
  GameCardSchema,
  EnemyDifficultySchema,
  EnemyPhaseSchema,
  EnemySchema,
  FieldCharSchema,
  type AbilityType,
  type Rarity,
  type GameCard,
  type EnemyDifficulty,
  type EnemyPhase,
  type Enemy,
  type FieldChar,
} from "./card.schema"

export {
  CivilizationSchema,
  CivilizationLeaderSchema,
  type Civilization,
  type CivilizationLeader,
} from "./civilization.schema"

export {
  StoryMetaSchema,
  ChapterMetaSchema,
  type StoryMeta,
  type ChapterMeta,
} from "@/domains/stories/stories.schema"

export {
  TlEvSchema,
  TimelinePeriodSchema,
  type TlEv,
  type TimelinePeriod,
} from "@/platform/schemas/timeline.schema"

export { TechEntrySchema, type TechEntry } from "./tech.schema"

export {
  IrisTimelineEntrySchema,
  IrisAbilitySchema,
  IrisRelationSchema,
  MinaTimelineEntrySchema,
  PlatformEntrySchema,
  type IrisTimelineEntry,
  type IrisAbility,
  type IrisRelation,
  type MinaTimelineEntry,
  type PlatformEntry,
} from "@/platform/schemas/character-detail.schema"

export {
  FactionNodeSchema,
  FactionTreeSchema,
  type FactionNode,
  type FactionTree,
} from "@/platform/schemas/faction.schema"

export {
  RelationNodeSchema,
  RelationEdgeSchema,
  type RelationNode,
  type RelationEdge,
} from "@/platform/schemas/relation.schema"
