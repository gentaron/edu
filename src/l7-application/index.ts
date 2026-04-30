/* ═══════════════════════════════════════════
   L7 APPLICATION — Feature Modules
   Feature-level modules that compose L3-L6.
   No direct access to L1 or L2.
   Each feature module provides a cohesive API for a specific feature.
   ═══════════════════════════════════════════ */

/*
 * L7 Feature Modules:
 *
 * 1. WikiFeature — Wiki browsing, search, entry display
 *    Uses: L3 WikiRepository, L6 WikiEntryCard
 *
 * 2. CardGameFeature — Card game deck building and battle
 *    Uses: L3 CardRepository, L4 Battle/Deck state, L5 BattleFSM
 *
 * 3. StoryFeature — Story archive, reading, navigation
 *    Uses: L3 StoryRepository, L6 StoryChapterCard
 *
 * 4. CivilizationFeature — Civilization pages, leaders
 *    Uses: L3 CivilizationRepository
 *
 * 5. TimelineFeature — Timeline display with filters
 *    Uses: L3 ContentRepository
 *
 * 6. TechnologyFeature — Technology catalog display
 *    Uses: L3 ContentRepository
 *
 * 7. UniverseFeature — Character detail pages (Iris, Mina, etc.)
 *    Uses: L3 ContentRepository, L3 WikiRepository
 *
 * 8. RankingFeature — IRIS ranking page
 *    Uses: L3 WikiRepository
 *
 * Each feature module will export:
 * - Data hooks (useWikiEntry, useBattleState, etc.)
 * - Action creators (dispatchBattleAction, etc.)
 * - Server-side data loaders for SSR/SSG
 */

// Wiki Feature
export { WikiRepository } from "@/l3-network/repositories/wiki.repository"

// Card Game Feature
export { CardRepository } from "@/l3-network/repositories/card.repository"

// Story Feature
export { StoryRepository } from "@/l3-network/repositories/story.repository"

// Civilization Feature
export { CivilizationRepository } from "@/l3-network/repositories/civilization.repository"

// Content Feature (Timeline, Tech, Characters, Factions)
export { ContentRepository } from "@/l3-network/repositories/content.repository"

// State (from L4)
export { useBattleStore, useDeckStore } from "@/l4-transport/state"

// Battle FSM (from L5)
export { battleFSMReducer, initialBattleFSMState } from "@/l5-session/battle-fsm"
