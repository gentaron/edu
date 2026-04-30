/* ═══════════════════════════════════════════
   _INFRA — Build-time Data Validation
   Run with: npx tsx src/_infra/validate-data.ts
   Validates all L1 data against L2 schemas.
   ═══════════════════════════════════════════ */

import {
  validateWikiEntries,
  validateGameCards,
  validateEnemies,
  validateCivilizations,
  validateStoryMetas,
  validateTimelinePeriods,
  validateTechEntries,
  validateFactionTrees,
  runAllInvariants,
  type InvariantViolation,
  type WikiEntry,
  type GameCard,
  type Enemy,
  type Civilization,
  type StoryMeta,
} from "@/l2-datalink"
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
import {
  TOP_CIVILIZATIONS,
  OTHER_CIVILIZATIONS,
  HISTORICAL_CIVILIZATIONS,
} from "@/domains/civilizations/civ.data"
import { ALL_STORIES } from "@/domains/stories/stories.meta"
import { TIMELINE_DATA } from "@/lib/timeline-data"
import { TECH_DATA } from "@/lib/tech-data"
import { FACTION_TREES } from "@/lib/faction-data"

function logResult(
  name: string,
  result: { success: boolean; errors?: Array<{ path: string; message: string }> }
) {
  if (result.success) {
    console.log(`  ✅ ${name}: OK`)
  } else {
    console.log(`  ❌ ${name}: ${result.errors!.length} errors`)
    for (const err of result.errors!) {
      console.log(`     - ${err.path}: ${err.message}`)
    }
  }
}

function logInvariants(violations: InvariantViolation[]) {
  if (violations.length === 0) {
    console.log("  ✅ Cross-data invariants: All clear")
  } else {
    console.log(`  ⚠️  Cross-data invariants: ${violations.length} issues`)
    for (const v of violations) {
      console.log(`     [${v.severity}] ${v.rule}: ${v.message}`)
    }
  }
}

console.log("╔══════════════════════════════════════╗")
console.log("║   EDU Data Validation (Build-time)   ║")
console.log("╚══════════════════════════════════════╝")
console.log()

// Validate individual data sets (cast readonly to mutable for validators)
logResult("Wiki Characters", validateWikiEntries([...WIKI_CHARACTERS]))
logResult("Wiki Characters New", validateWikiEntries([...WIKI_CHARACTERS_NEW]))
logResult("Wiki Organizations", validateWikiEntries([...WIKI_ORGANIZATIONS]))
logResult("Wiki Geography", validateWikiEntries([...WIKI_GEOGRAPHY]))
logResult("Wiki Technology", validateWikiEntries([...WIKI_TECHNOLOGY]))
logResult("Wiki Terms", validateWikiEntries([...WIKI_TERMS]))
logResult("Wiki History", validateWikiEntries([...WIKI_HISTORY]))
logResult("Game Cards", validateGameCards([...ALL_CARDS]))
logResult("Enemies", validateEnemies([...ENEMIES]))
logResult("Top Civilizations", validateCivilizations([...TOP_CIVILIZATIONS]))
logResult("Other Civilizations", validateCivilizations([...OTHER_CIVILIZATIONS]))
logResult("Historical Civilizations", validateCivilizations([...HISTORICAL_CIVILIZATIONS]))
logResult("Stories", validateStoryMetas([...ALL_STORIES]))
logResult("Timeline Periods", validateTimelinePeriods([...TIMELINE_DATA]))
logResult("Tech Entries", validateTechEntries([...TECH_DATA]))
logResult("Faction Trees", validateFactionTrees([...FACTION_TREES]))

console.log()

// Cross-data invariant checks
const allWiki = [
  ...WIKI_CHARACTERS,
  ...WIKI_CHARACTERS_NEW,
  ...WIKI_ORGANIZATIONS,
  ...WIKI_GEOGRAPHY,
  ...WIKI_TECHNOLOGY,
  ...WIKI_TERMS,
  ...WIKI_HISTORY,
]
const allCivs = [...TOP_CIVILIZATIONS, ...OTHER_CIVILIZATIONS, ...HISTORICAL_CIVILIZATIONS]
const violations = runAllInvariants({
  wikiEntries: allWiki as WikiEntry[],
  cards: [...ALL_CARDS] as GameCard[],
  enemies: [...ENEMIES] as Enemy[],
  civilizations: allCivs as Civilization[],
  stories: [...ALL_STORIES] as StoryMeta[],
})
logInvariants(violations)

console.log()
console.log("Validation complete.")

// Exit with error if any validation failed
const hasErrors = violations.some((v) => v.severity === "error")
if (hasErrors) {
  process.exit(1)
}
