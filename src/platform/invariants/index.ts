/* ═══════════════════════════════════════════
   Platform — Invariants
   Cross-data consistency checks.
   These ensure referential integrity across data domains.
   ═══════════════════════════════════════════ */

import type { WikiEntry, GameCard, Enemy, Civilization } from "@/types"
import type { StoryMeta } from "@/domains/stories/stories.schema"

/** Represents a single invariant violation with rule ID, message, and severity. */
export interface InvariantViolation {
  /** Machine-readable rule identifier (e.g. 'wiki-id-unique') */
  rule: string
  /** Human-readable description of the violation */
  message: string
  /** Whether this is a hard error or a soft warning */
  severity: "error" | "warning"
}

/**
 * Check that all wiki entry IDs are unique (no duplicates).
 *
 * @param entries - Array of wiki entries to check.
 * @returns Array of violations (one per duplicate ID). Empty if all IDs are unique.
 * @example
 * const violations = checkWikiIdUniqueness(wikiEntries)
 * // → [{ rule: 'wiki-id-unique', message: 'Duplicate wiki entry id: "char-lin"', severity: 'error' }]
 */
export function checkWikiIdUniqueness(entries: WikiEntry[]): InvariantViolation[] {
  const ids = entries.map((e) => e.id)
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
  return duplicates.map((id) => ({
    rule: "wiki-id-unique",
    message: `Duplicate wiki entry id: "${id}"`,
    severity: "error" as const,
  }))
}

/**
 * Check that all story relatedEntries reference valid wiki entry IDs.
 * Produces warnings (not errors) since missing references may be intentional
 * (e.g. entries not yet added).
 *
 * @param stories - Array of story metadata to validate.
 * @param wikiEntries - Array of wiki entries used as the reference set.
 * @returns Array of violations for each dangling reference. Empty if all references are valid.
 * @example
 * const violations = checkStoryReferences(stories, wikiEntries)
 * // → [{ rule: 'story-references-valid', message: 'Story "ch1-x" references non-existent wiki entry "y"', severity: 'warning' }]
 */
export function checkStoryReferences(
  stories: StoryMeta[],
  wikiEntries: WikiEntry[]
): InvariantViolation[] {
  const wikiIds = new Set(wikiEntries.map((e) => e.id as string))
  const violations: InvariantViolation[] = []
  for (const story of stories) {
    for (const entryId of story.relatedEntries) {
      if (!wikiIds.has(entryId)) {
        violations.push({
          rule: "story-references-valid",
          message: `Story "${story.slug}" references non-existent wiki entry "${entryId}"`,
          severity: "warning" as const,
        })
      }
    }
  }
  return violations
}

/**
 * Check that civilization leader and civilization wiki references point to valid wiki entries.
 * Validates both `leaderWikiId` and `wikiId` fields on each civilization.
 * Produces warnings since missing references may be intentional.
 *
 * @param civs - Array of civilizations to validate.
 * @param wikiEntries - Array of wiki entries used as the reference set.
 * @returns Array of violations for each dangling reference. Empty if all references are valid.
 */
export function checkCivilizationLeaderReferences(
  civs: Civilization[],
  wikiEntries: WikiEntry[]
): InvariantViolation[] {
  const wikiIds = new Set(wikiEntries.map((e) => e.id as string))
  const violations: InvariantViolation[] = []
  for (const civ of civs) {
    if (civ.leaderWikiId && !wikiIds.has(civ.leaderWikiId)) {
      violations.push({
        rule: "civ-leader-wiki-ref",
        message: `Civilization "${civ.id}" references non-existent wiki entry "${civ.leaderWikiId}" for leader`,
        severity: "warning" as const,
      })
    }
    if (civ.wikiId && !wikiIds.has(civ.wikiId)) {
      violations.push({
        rule: "civ-wiki-ref",
        message: `Civilization "${civ.id}" references non-existent wiki entry "${civ.wikiId}"`,
        severity: "warning" as const,
      })
    }
  }
  return violations
}

/**
 * Check card and enemy data consistency across multiple rules:
 * - Card IDs must be unique
 * - Enemy IDs must be unique
 * - Every enemy must have at least one phase defined
 * - Every enemy must have a positive maxHp
 *
 * @param cards - Array of game cards to validate.
 * @param enemies - Array of enemies to validate.
 * @returns Array of violations for each inconsistency found. Empty if all checks pass.
 */
export function checkCardDataConsistency(
  cards: GameCard[],
  enemies: Enemy[]
): InvariantViolation[] {
  const violations: InvariantViolation[] = []
  const cardIds = new Set(cards.map((c) => c.id))
  const duplicates = cardIds.size < cards.length
  if (duplicates) {
    violations.push({
      rule: "card-id-unique",
      message: "Duplicate card IDs detected",
      severity: "error" as const,
    })
  }
  const enemyIds = new Set(enemies.map((e) => e.id))
  const enemyDuplicates = enemyIds.size < enemies.length
  if (enemyDuplicates) {
    violations.push({
      rule: "enemy-id-unique",
      message: "Duplicate enemy IDs detected",
      severity: "error" as const,
    })
  }
  for (const enemy of enemies) {
    if (enemy.phases.length === 0) {
      violations.push({
        rule: "enemy-has-phases",
        message: `Enemy "${enemy.id}" has no phases defined`,
        severity: "error" as const,
      })
    }
    if (enemy.maxHp <= 0) {
      violations.push({
        rule: "enemy-positive-hp",
        message: `Enemy "${enemy.id}" has invalid maxHp: ${enemy.maxHp}`,
        severity: "error" as const,
      })
    }
  }
  return violations
}

/**
 * Check that all wiki entries have valid category values.
 * Valid categories are: キャラクター, 用語, 組織, 地理, 技術, 歴史.
 *
 * @param entries - Array of wiki entries to validate.
 * @returns Array of violations for each entry with an invalid category. Empty if all are valid.
 */
export function checkWikiCategories(entries: WikiEntry[]): InvariantViolation[] {
  const validCategories = new Set(["キャラクター", "用語", "組織", "地理", "技術", "歴史"])
  const violations: InvariantViolation[] = []
  for (const entry of entries) {
    if (!validCategories.has(entry.category)) {
      violations.push({
        rule: "wiki-valid-category",
        message: `Entry "${entry.id}" has invalid category: "${entry.category}"`,
        severity: "error" as const,
      })
    }
  }
  return violations
}

/**
 * Run all invariant checks across all data domains.
 * Convenience function that executes all individual check functions
 * and returns a merged list of violations.
 *
 * @param data - Object containing all data collections to validate.
 * @param data.wikiEntries - All wiki entries.
 * @param data.cards - All game cards.
 * @param data.enemies - All enemies.
 * @param data.civilizations - All civilizations.
 * @param data.stories - All story metadata.
 * @returns Merged array of all invariant violations from every check.
 *          Empty array means all invariants pass.
 * @example
 * const violations = runAllInvariants({ wikiEntries, cards, enemies, civilizations, stories })
 * if (violations.length === 0) { console.log('All invariants pass!') }
 */
export function runAllInvariants(data: {
  wikiEntries: WikiEntry[]
  cards: GameCard[]
  enemies: Enemy[]
  civilizations: Civilization[]
  stories: StoryMeta[]
}): InvariantViolation[] {
  return [
    ...checkWikiIdUniqueness(data.wikiEntries),
    ...checkWikiCategories(data.wikiEntries),
    ...checkStoryReferences(data.stories, data.wikiEntries),
    ...checkCivilizationLeaderReferences(data.civilizations, data.wikiEntries),
    ...checkCardDataConsistency(data.cards, data.enemies),
  ]
}
