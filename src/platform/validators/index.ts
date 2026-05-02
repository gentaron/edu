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

/** Successful validation result containing the parsed and typed data. */
export interface ValidationResult<T> {
  success: true
  data: T
}

/** Failed validation result containing an array of field-level error messages. */
export interface ValidationError {
  success: false
  errors: Array<{ path: string; message: string }>
}

/** Discriminated union of validation outcomes (success or error). */
export type ValidateResult<T> = ValidationResult<T> | ValidationError

/**
 * Format a Zod validation error into an array of human-readable field errors.
 * Extracts the path and message from each Zod issue.
 *
 * @param error - The error thrown by Zod (expected to have an `issues` array).
 * @returns Array of objects with `path` (dot-separated) and `message` fields.
 */
function formatZodError(error: unknown): Array<{ path: string; message: string }> {
  if (error && typeof error === "object" && "issues" in error) {
    return (error.issues as Array<{ path: (string | number)[]; message: string }>).map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }))
  }
  return [{ path: "", message: "Unknown validation error" }]
}

/**
 * Validate an array of unknown values against the WikiEntry schema.
 *
 * @param entries - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: WikiEntry[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateWikiEntries(entries: unknown[]): ValidateResult<WikiEntry[]> {
  const result = z.array(WikiEntrySchema).safeParse(entries)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the GameCard schema.
 *
 * @param cards - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: GameCard[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateGameCards(cards: unknown[]): ValidateResult<GameCard[]> {
  const result = z.array(GameCardSchema).safeParse(cards)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the Enemy schema.
 *
 * @param enemies - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: Enemy[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateEnemies(enemies: unknown[]): ValidateResult<Enemy[]> {
  const result = z.array(EnemySchema).safeParse(enemies)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the Civilization schema.
 *
 * @param civs - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: Civilization[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateCivilizations(civs: unknown[]): ValidateResult<Civilization[]> {
  const result = z.array(CivilizationSchema).safeParse(civs)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the CivilizationLeader schema.
 *
 * @param leaders - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: CivilizationLeader[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateCivilizationLeaders(
  leaders: unknown[]
): ValidateResult<CivilizationLeader[]> {
  const result = z.array(CivilizationLeaderSchema).safeParse(leaders)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the StoryMeta schema.
 *
 * @param stories - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: StoryMeta[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateStoryMetas(stories: unknown[]): ValidateResult<StoryMeta[]> {
  const result = z.array(StoryMetaSchema).safeParse(stories)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the ChapterMeta schema.
 *
 * @param chapters - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: ChapterMeta[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateChapterMetas(chapters: unknown[]): ValidateResult<ChapterMeta[]> {
  const result = z.array(ChapterMetaSchema).safeParse(chapters)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the TimelinePeriod schema.
 *
 * @param periods - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: TimelinePeriod[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateTimelinePeriods(periods: unknown[]): ValidateResult<TimelinePeriod[]> {
  const result = z.array(TimelinePeriodSchema).safeParse(periods)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the TechEntry schema.
 *
 * @param entries - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: TechEntry[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateTechEntries(entries: unknown[]): ValidateResult<TechEntry[]> {
  const result = z.array(TechEntrySchema).safeParse(entries)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}

/**
 * Validate an array of unknown values against the FactionTree schema.
 *
 * @param trees - The raw data array to validate.
 * @returns A discriminated union: `{ success: true, data: FactionTree[] }` on success,
 *          or `{ success: false, errors: [...] }` on failure.
 */
export function validateFactionTrees(trees: unknown[]): ValidateResult<FactionTree[]> {
  const result = z.array(FactionTreeSchema).safeParse(trees)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodError(result.error) }
}
