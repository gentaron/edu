/* ═══════════════════════════════════════════
   L7 APPLICATION — Feature Modules (deprecated)
   Re-exports from domain repositories and platform.
   ═══════════════════════════════════════════ */

// Wiki Feature
export { WikiRepository } from "@/domains/wiki/wiki.repository"

// Card Game Feature
export { CardRepository } from "@/domains/cards/cards.repository"

// Story Feature
export { StoryRepository } from "@/domains/stories/stories.repository"

// Civilization Feature
export { CivilizationRepository } from "@/domains/civilizations/civ.repository"

// Content Feature
export { ContentRepository } from "@/domains/wiki/content.repository"

// State (from L4/platform)
export { useBattleStore, useDeckStore } from "@/lib/stores"

// Battle FSM (from L5/domains)
export { battleFSMReducer, initialBattleFSMState } from "@/domains/battle/battle.fsm"
