/* ═══════════════════════════════════════════
   L2 DATALINK — Invariants
   Cross-data consistency checks.
   These ensure referential integrity across data domains.
   ═══════════════════════════════════════════ */

import type { WikiEntry, GameCard, Enemy, Civilization, StoryMeta } from "../schemas"

export interface InvariantViolation {
  rule: string
  message: string
  severity: "error" | "warning"
}

export function checkWikiIdUniqueness(entries: WikiEntry[]): InvariantViolation[] {
  const ids = entries.map((e) => e.id)
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
  return duplicates.map((id) => ({
    rule: "wiki-id-unique",
    message: `Duplicate wiki entry id: "${id}"`,
    severity: "error" as const,
  }))
}

export function checkStoryReferences(
  stories: StoryMeta[],
  wikiEntries: WikiEntry[]
): InvariantViolation[] {
  const wikiIds = new Set(wikiEntries.map((e) => e.id))
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

export function checkCivilizationLeaderReferences(
  civs: Civilization[],
  wikiEntries: WikiEntry[]
): InvariantViolation[] {
  const wikiIds = new Set(wikiEntries.map((e) => e.id))
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
