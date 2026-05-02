/**
 * Branded type utilities for compile-time domain ID safety.
 * Prevents mixing CardId with EnemyId, WikiId, etc.
 * Inspired by rlibc's c_int alias, but goes further with true nominal typing.
 */

declare const __brand: unique symbol

/** Create a branded type from a base type */
type Brand<T, B extends string> = T & { readonly [__brand]: B }

// ── Domain ID Types ──

/** Card identifier — e.g., "char-diana", "char-jen" */
export type CardId = Brand<string, "CardId">

/** Enemy identifier — e.g., "void-king", "stardust-dragon" */
export type EnemyId = Brand<string, "EnemyId">

/** Wiki entry identifier */
export type WikiId = Brand<string, "WikiId">

/** Civilization identifier */
export type CivilizationId = Brand<string, "CivilizationId">

/** Story slug identifier */
export type StorySlug = Brand<string, "StorySlug">

// ── Brand Constructors (runtime validation) ──

/** Validate and brand a string as CardId */
export function asCardId(s: string): CardId {
  if (!s.startsWith("char-")) {
    throw new Error(`Invalid CardId: "${s}" must start with "char-"`)
  }
  return s as CardId
}

/** Validate and brand a string as EnemyId */
export function asEnemyId(s: string): EnemyId {
  return s as EnemyId
}

/** Validate and brand a string as WikiId */
export function asWikiId(s: string): WikiId {
  if (s.length === 0) {
    throw new Error("Invalid WikiId: empty string")
  }
  return s as WikiId
}

/** Validate and brand a string as CivilizationId */
export function asCivilizationId(s: string): CivilizationId {
  return s as CivilizationId
}

/** Validate and brand a string as StorySlug */
export function asStorySlug(s: string): StorySlug {
  if (!/^[\da-z-]+$/.test(s)) {
    throw new Error(String.raw`Invalid StorySlug: "${s}" must match [\da-z-]+`)
  }
  return s as StorySlug
}

// ── Type Guards ──

/** Type guard: checks if value is a valid CardId (starts with "char-") */
export function isCardId(s: string): s is CardId {
  return s.startsWith("char-")
}

/** Type guard: checks if value is a non-empty string suitable for EnemyId */
export function isEnemyId(s: string): s is EnemyId {
  return s.length > 0
}

/** Type guard: checks if value is a non-empty string suitable for WikiId */
export function isWikiId(s: string): s is WikiId {
  return s.length > 0
}

/** Type guard: checks if value is a non-empty string suitable for CivilizationId */
export function isCivilizationId(s: string): s is CivilizationId {
  return s.length > 0
}

/** Type guard: checks if value matches StorySlug format */
export function isStorySlug(s: string): s is StorySlug {
  return /^[\da-z-]+$/.test(s)
}
