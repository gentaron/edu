import { describe, it, expect } from "vitest"
import { TOP_CIVILIZATIONS } from "@/domains/civilizations/top.data"
import { CivilizationRepository } from "@/domains/civilizations/civ.repository"
import type { CivilizationId } from "@/platform/schemas/branded"

/* ═══════════════════════════════════════════
   TOP_CIVILIZATIONS Data Tests
   ═══════════════════════════════════════════ */
describe("TOP_CIVILIZATIONS", () => {
  it("has exactly 5 civilizations", () => {
    expect(TOP_CIVILIZATIONS).toHaveLength(5)
  })

  it("has no duplicate IDs", () => {
    const ids = TOP_CIVILIZATIONS.map((c) => c.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it("every civilization has required fields", () => {
    const requiredFields = [
      "id",
      "rank",
      "name",
      "nameEn",
      "color",
      "borderColor",
      "bgColor",
      "icon",
      "leader",
      "specialization",
      "description",
      "history",
      "currentStatus",
    ] as const
    for (const civ of TOP_CIVILIZATIONS) {
      for (const field of requiredFields) {
        expect(civ).toHaveProperty(field)
      }
    }
  })

  it("ranks are 1-5 sequential", () => {
    for (let i = 0; i < TOP_CIVILIZATIONS.length; i++) {
      expect(TOP_CIVILIZATIONS[i]!.rank).toBe(i + 1)
    }
  })

  it("every civilization has non-empty name", () => {
    for (const civ of TOP_CIVILIZATIONS) {
      expect(civ.name.length).toBeGreaterThan(0)
    }
  })

  it("every civilization has non-empty nameEn", () => {
    for (const civ of TOP_CIVILIZATIONS) {
      expect(civ.nameEn.length).toBeGreaterThan(0)
    }
  })

  it("every civilization has non-empty leader", () => {
    for (const civ of TOP_CIVILIZATIONS) {
      expect(civ.leader.length).toBeGreaterThan(0)
    }
  })

  it("every civilization has non-empty description", () => {
    for (const civ of TOP_CIVILIZATIONS) {
      expect(civ.description.length).toBeGreaterThan(0)
    }
  })

  it("every civilization has planets array", () => {
    for (const civ of TOP_CIVILIZATIONS) {
      expect(Array.isArray(civ.planets)).toBe(true)
      expect(civ.planets.length).toBeGreaterThan(0)
    }
  })

  it("every civilization has relationships array", () => {
    for (const civ of TOP_CIVILIZATIONS) {
      expect(Array.isArray(civ.relationships)).toBe(true)
      expect(civ.relationships.length).toBeGreaterThan(0)
    }
  })

  it("every civilization has href", () => {
    for (const civ of TOP_CIVILIZATIONS) {
      expect(civ.href.length).toBeGreaterThan(0)
      expect(civ.href).toMatch(/^\//)
    }
  })

  it("every civilization has wikiId", () => {
    for (const civ of TOP_CIVILIZATIONS) {
      expect(civ.wikiId.length).toBeGreaterThan(0)
    }
  })
})

/* ═══════════════════════════════════════════
   Civilization Repository Tests
   ═══════════════════════════════════════════ */
describe("CivilizationRepository", () => {
  it("findById returns civilization for valid ID", () => {
    const result = CivilizationRepository.findById("granbell" as CivilizationId)
    expect(result).toBeDefined()
    expect(result!.name).toBe("グランベル")
  })

  it("findById returns undefined for non-existent ID", () => {
    expect(CivilizationRepository.findById("nonexistent" as CivilizationId)).toBeUndefined()
  })

  it("getAll returns all civilizations", () => {
    const all = CivilizationRepository.getAll()
    expect(all.length).toBeGreaterThanOrEqual(5)
  })

  it("getTop returns exactly 5 civilizations", () => {
    expect(CivilizationRepository.getTop()).toHaveLength(5)
  })

  it("getTop matches TOP_CIVILIZATIONS", () => {
    const top = CivilizationRepository.getTop()
    for (let i = 0; i < top.length; i++) {
      expect(top[i]!.id).toBe(TOP_CIVILIZATIONS[i]!.id)
    }
  })

  it("findByHref returns correct civilization", () => {
    const result = CivilizationRepository.findByHref("/civilizations/granbell")
    expect(result).toBeDefined()
    expect(result!.id).toBe("granbell")
  })

  it("findByHref returns undefined for non-existent href", () => {
    expect(CivilizationRepository.findByHref("/civilizations/nonexistent")).toBeUndefined()
  })

  it("getAllLeaders returns leaders", () => {
    const leaders = CivilizationRepository.getAllLeaders()
    expect(leaders.length).toBeGreaterThan(0)
  })
})
