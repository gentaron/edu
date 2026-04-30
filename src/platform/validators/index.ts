/* ═══════════════════════════════════════════
   Platform — Validators
   Runtime validation functions using Zod schemas.
   Returns parsed data or throws structured errors.
   ═══════════════════════════════════════════ */

import { z } from "zod/v4"
import {
  WikiEntrySchema,
  GameCardSchema,
  EnemySchema,
  CivilizationSchema,
  CivilizationLeaderSchema,
  StoryMetaSchema,
  ChapterMetaSchema,
  TimelinePeriodSchema,
  TechEntrySchema,
  FactionTreeSchema,
  type WikiEntry,
  type GameCard,
  type Enemy,
  type Civilization,
  type CivilizationLeader,
  type StoryMeta,
  type ChapterMeta,
  type TimelinePeriod,
  type TechEntry,
  type FactionTree,
} from "@/platform/schemas"

export interface ValidationResult<T> {
  success: true
  data: T
}

export interface ValidationError {
  success: false
  errors: Array<{ path: string; message: string }>
}

export type ValidateResult<T> = ValidationResult<T> | ValidationError

function formatZodError(error: unknown): Array<{ path: string; message: string }> {
  if (error && typeof error === "object" && "issues" in error) {
    return (error.issues as Array<{ path: (string | number)[]; message: string }>).map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }))
  }
  return [{ path: "", message: "Unknown validation error" }]
}

export function validateWikiEntries(entries: unknown[]): ValidateResult<WikiEntry[]> {
  const result = z.array(WikiEntrySchema).safeParse(entries)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateGameCards(cards: unknown[]): ValidateResult<GameCard[]> {
  const result = z.array(GameCardSchema).safeParse(cards)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateEnemies(enemies: unknown[]): ValidateResult<Enemy[]> {
  const result = z.array(EnemySchema).safeParse(enemies)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateCivilizations(civs: unknown[]): ValidateResult<Civilization[]> {
  const result = z.array(CivilizationSchema).safeParse(civs)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateCivilizationLeaders(
  leaders: unknown[]
): ValidateResult<CivilizationLeader[]> {
  const result = z.array(CivilizationLeaderSchema).safeParse(leaders)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateStoryMetas(stories: unknown[]): ValidateResult<StoryMeta[]> {
  const result = z.array(StoryMetaSchema).safeParse(stories)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateChapterMetas(chapters: unknown[]): ValidateResult<ChapterMeta[]> {
  const result = z.array(ChapterMetaSchema).safeParse(chapters)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateTimelinePeriods(periods: unknown[]): ValidateResult<TimelinePeriod[]> {
  const result = z.array(TimelinePeriodSchema).safeParse(periods)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateTechEntries(entries: unknown[]): ValidateResult<TechEntry[]> {
  const result = z.array(TechEntrySchema).safeParse(entries)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}

export function validateFactionTrees(trees: unknown[]): ValidateResult<FactionTree[]> {
  const result = z.array(FactionTreeSchema).safeParse(trees)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: formatZodError(result.error) }
}
