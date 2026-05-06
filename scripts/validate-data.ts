/* ═══════════════════════════════════════════
   GAP 8 — Build-time Data Validation
   Run with: bun run scripts/validate-data.ts
   Comprehensive validation of all L1 data.
   ═══════════════════════════════════════════ */

import { EffectType } from "@/types"
import type { WikiEntry, GameCard, Enemy } from "@/types"
import {
  WIKI_CHARACTERS,
  WIKI_CHARACTERS_NEW,
  WIKI_ORGANIZATIONS,
  WIKI_GEOGRAPHY,
  WIKI_TECHNOLOGY,
  WIKI_TERMS,
  WIKI_HISTORY,
} from "@/domains/wiki/wiki.data"
import { ALL_CARDS, ENEMIES } from "@/domains/cards/cards.data"

// ── Collect all data ──

const allWiki: readonly WikiEntry[] = [
  ...WIKI_CHARACTERS,
  ...WIKI_CHARACTERS_NEW,
  ...WIKI_ORGANIZATIONS,
  ...WIKI_GEOGRAPHY,
  ...WIKI_TECHNOLOGY,
  ...WIKI_TERMS,
  ...WIKI_HISTORY,
]

const allCards: readonly GameCard[] = [...ALL_CARDS]
const allEnemies: readonly Enemy[] = [...ENEMIES]

const VALID_EFFECT_TYPES = new Set(Object.values(EffectType))

// ── Validation results ──

interface Violation {
  rule: string
  message: string
  severity: "error" | "warning"
}

const violations: Violation[] = []

function addError(rule: string, message: string) {
  violations.push({ rule, message, severity: "error" })
}

function addWarning(rule: string, message: string) {
  violations.push({ rule, message, severity: "warning" })
}

// ── 1. Validate all Wiki IDs are unique ──

console.log("╔══════════════════════════════════════╗")
console.log("║   EDU Build-time Data Validation      ║")
console.log("╚══════════════════════════════════════╝")
console.log()

console.log(`Wiki entries: ${allWiki.length}`)
console.log(`Game cards: ${allCards.length}`)
console.log(`Enemies: ${allEnemies.length}`)
console.log()

// 1. Wiki ID uniqueness
const wikiIds = allWiki.map((e) => e.id)
const wikiIdSet = new Set(wikiIds)
const duplicateWikiIds = wikiIds.filter((id, i) => wikiIds.indexOf(id) !== i)
const uniqueDuplicateWikiIds = [...new Set(duplicateWikiIds)]
if (uniqueDuplicateWikiIds.length > 0) {
  for (const id of uniqueDuplicateWikiIds) {
    addError("wiki-id-unique", `Duplicate wiki entry id: "${id}"`)
  }
  console.log(`  ❌ Wiki ID uniqueness: ${uniqueDuplicateWikiIds.length} duplicate(s) found`)
} else {
  console.log(`  ✅ Wiki ID uniqueness: All ${allWiki.length} IDs are unique`)
}

// 2. Card attack/defense/ultimate values in range 0-999
let cardValueViolations = 0
for (const card of allCards) {
  for (const field of ["attack", "defense", "ultimate"] as const) {
    const val = card[field]
    if (typeof val !== "number" || val < 0 || val > 999) {
      addError("card-value-range", `Card "${card.id}" has invalid ${field}: ${val} (must be 0-999)`)
      cardValueViolations++
    }
  }
}
if (cardValueViolations > 0) {
  console.log(`  ❌ Card value range: ${cardValueViolations} violation(s) found`)
} else {
  console.log(
    `  ✅ Card value range: All ${allCards.length} cards have valid attack/defense/ultimate (0-999)`
  )
}

// 3. Enemy phases triggerHpPercent in descending order within each enemy
let phaseOrderViolations = 0
for (const enemy of allEnemies) {
  if (enemy.phases.length > 1) {
    for (let i = 1; i < enemy.phases.length; i++) {
      const prev = enemy.phases[i - 1]!.triggerHpPercent
      const curr = enemy.phases[i]!.triggerHpPercent
      if (curr >= prev) {
        addError(
          "enemy-phase-order",
          `Enemy "${enemy.id}" phase ${i} triggerHpPercent (${curr}) is not less than phase ${i - 1} (${prev})`
        )
        phaseOrderViolations++
      }
    }
  }
}
if (phaseOrderViolations > 0) {
  console.log(`  ❌ Enemy phase order: ${phaseOrderViolations} violation(s) found`)
} else {
  console.log(
    `  ✅ Enemy phase order: All ${allEnemies.length} enemies have descending triggerHpPercent`
  )
}

// 4. Wiki sourceLinks URLs start with http
let sourceLinkViolations = 0
for (const entry of allWiki) {
  if (entry.sourceLinks) {
    for (const link of entry.sourceLinks) {
      if (!link.url.startsWith("http://") && !link.url.startsWith("https://")) {
        addError(
          "source-link-url",
          `Wiki entry "${entry.id}" has invalid sourceLink URL: "${link.url}"`
        )
        sourceLinkViolations++
      }
    }
  }
}
if (sourceLinkViolations > 0) {
  console.log(`  ❌ Source link URLs: ${sourceLinkViolations} violation(s) found`)
} else {
  console.log(`  ✅ Source link URLs: All URLs are valid`)
}

// 5. Card effectType values are valid EffectType enum values
let effectTypeViolations = 0
for (const card of allCards) {
  if (!VALID_EFFECT_TYPES.has(card.effectType)) {
    addError(
      "card-effect-type",
      `Card "${card.id}" has invalid effectType: "${card.effectType as string}"`
    )
    effectTypeViolations++
  }
}
if (effectTypeViolations > 0) {
  console.log(`  ❌ Card effectType: ${effectTypeViolations} violation(s) found`)
} else {
  console.log(`  ✅ Card effectType: All ${allCards.length} cards have valid effectType`)
}

// ── Summary ──

console.log()
const errors = violations.filter((v) => v.severity === "error")
const warnings = violations.filter((v) => v.severity === "warning")

if (errors.length > 0) {
  console.log(`❌ Validation FAILED: ${errors.length} error(s), ${warnings.length} warning(s)`)
  console.log()
  for (const v of violations) {
    console.log(`   [${v.severity}] ${v.rule}: ${v.message}`)
  }
  process.exit(1)
} else if (warnings.length > 0) {
  console.log(`⚠️  Validation passed with ${warnings.length} warning(s)`)
  process.exit(0)
} else {
  console.log("✅ All validations passed!")
  process.exit(0)
}
