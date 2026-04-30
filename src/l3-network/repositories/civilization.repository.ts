/* ═══════════════════════════════════════════
   L3 NETWORK — Civilization Repository
   Data access layer for civilization data.
   ═══════════════════════════════════════════ */

import {
  TOP_CIVILIZATIONS,
  OTHER_CIVILIZATIONS,
  HISTORICAL_CIVILIZATIONS,
  CIVILIZATION_LEADERS,
} from "@/l1-physical/civilizations"
import type { Civilization, CivilizationLeader } from "@/l2-datalink"

const allCivs: Civilization[] = [
  ...TOP_CIVILIZATIONS,
  ...OTHER_CIVILIZATIONS,
  ...HISTORICAL_CIVILIZATIONS,
]

const civById = new Map<string, Civilization>()
for (const civ of allCivs) {
  civById.set(civ.id, civ)
}

export class CivilizationRepository {
  /** Find civilization by ID */
  static findById(id: string): Civilization | undefined {
    return civById.get(id)
  }

  /** Get all civilizations (active first, then historical) */
  static getAll(): readonly Civilization[] {
    return allCivs
  }

  /** Get top civilizations (active, ranked) */
  static getTop(): readonly Civilization[] {
    return TOP_CIVILIZATIONS
  }

  /** Get other civilizations (active, unranked) */
  static getOther(): readonly Civilization[] {
    return OTHER_CIVILIZATIONS
  }

  /** Get historical civilizations */
  static getHistorical(): readonly Civilization[] {
    return HISTORICAL_CIVILIZATIONS
  }

  /** Get all civilization leaders */
  static getAllLeaders(): readonly CivilizationLeader[] {
    return CIVILIZATION_LEADERS
  }

  /** Find by href (route path) */
  static findByHref(href: string): Civilization | undefined {
    return allCivs.find((c) => c.href === href)
  }
}
