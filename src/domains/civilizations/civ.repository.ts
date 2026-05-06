/* ═══════════════════════════════════════════
   Civilizations Domain — Civilization Repository
   Data access layer for civilization data.
   ═══════════════════════════════════════════ */

import {
  TOP_CIVILIZATIONS,
  OTHER_CIVILIZATIONS,
  HISTORICAL_CIVILIZATIONS,
  CIVILIZATION_LEADERS,
} from "./civ.data"
import type { CivilizationId } from "@/platform/schemas/branded"
import type { Civilization, CivilizationLeader } from "@/types"

const allCivs: Civilization[] = [
  ...TOP_CIVILIZATIONS,
  ...OTHER_CIVILIZATIONS,
  ...HISTORICAL_CIVILIZATIONS,
]

const civById = new Map<CivilizationId, Civilization>()
for (const civ of allCivs) {
  civById.set(civ.id, civ)
}

export const CivilizationRepository = {
  /** Find civilization by ID */
  findById(id: CivilizationId): Civilization | undefined {
    return civById.get(id)
  },

  /** Get all civilizations (active first, then historical) */
  getAll(): readonly Civilization[] {
    return allCivs
  },

  /** Get top civilizations (active, ranked) */
  getTop(): readonly Civilization[] {
    return TOP_CIVILIZATIONS
  },

  /** Get other civilizations (active, unranked) */
  getOther(): readonly Civilization[] {
    return OTHER_CIVILIZATIONS
  },

  /** Get historical civilizations */
  getHistorical(): readonly Civilization[] {
    return HISTORICAL_CIVILIZATIONS
  },

  /** Get all civilization leaders */
  getAllLeaders(): readonly CivilizationLeader[] {
    return CIVILIZATION_LEADERS
  },

  /** Find by href (route path) */
  findByHref(href: string): Civilization | undefined {
    return allCivs.find((c) => c.href === href)
  },
}
