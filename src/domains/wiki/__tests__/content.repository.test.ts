import { describe, it, expect } from "vitest"
import { ContentRepository } from "@/domains/wiki/content.repository"

describe("ContentRepository", () => {
  /* ── Timeline ── */
  describe("Timeline", () => {
    it("getTimeline returns non-empty array", () => {
      const timeline = ContentRepository.getTimeline()
      expect(timeline.length).toBeGreaterThan(0)
    })

    it("timeline entries have required fields", () => {
      const timeline = ContentRepository.getTimeline()
      for (const period of timeline) {
        expect(period).toHaveProperty("period")
        expect(period).toHaveProperty("range")
        expect(period).toHaveProperty("color")
        expect(period).toHaveProperty("borderColor")
        expect(period).toHaveProperty("events")
        expect(period.events.length).toBeGreaterThan(0)
      }
    })

    it("getTimelineLocationColors returns non-empty map", () => {
      const colors = ContentRepository.getTimelineLocationColors()
      expect(Object.keys(colors).length).toBeGreaterThan(0)
    })

    it("location color values are valid color strings", () => {
      const colors = ContentRepository.getTimelineLocationColors()
      for (const value of Object.values(colors)) {
        expect(typeof value).toBe("string")
        expect(value.length).toBeGreaterThan(0)
      }
    })
  })

  /* ── Technology ── */
  describe("Technology", () => {
    it("getTechEntries returns non-empty array", () => {
      const entries = ContentRepository.getTechEntries()
      expect(entries.length).toBeGreaterThan(0)
    })

    it("tech entries have required fields", () => {
      const entries = ContentRepository.getTechEntries()
      for (const entry of entries) {
        expect(entry).toHaveProperty("id")
        expect(entry).toHaveProperty("name")
        expect(entry).toHaveProperty("nameEn")
        expect(entry).toHaveProperty("applications")
        expect(entry.applications.length).toBeGreaterThan(0)
      }
    })

    it("findTechById finds existing tech", () => {
      const entries = ContentRepository.getTechEntries()
      const firstId = entries[0]!.id
      const tech = ContentRepository.findTechById(firstId)
      expect(tech).toBeDefined()
      expect(tech!.id).toBe(firstId)
    })

    it("findTechById returns undefined for non-existent tech", () => {
      const tech = ContentRepository.findTechById("nonexistent-tech")
      expect(tech).toBeUndefined()
    })
  })

  /* ── Character Details (Iris) ── */
  describe("Iris Character Details", () => {
    it("getIrisTimeline returns non-empty array", () => {
      const timeline = ContentRepository.getIrisTimeline()
      expect(timeline.length).toBeGreaterThan(0)
    })

    it("getIrisAbilities returns non-empty array", () => {
      const abilities = ContentRepository.getIrisAbilities()
      expect(abilities.length).toBeGreaterThan(0)
    })

    it("getIrisRelations returns non-empty array", () => {
      const relations = ContentRepository.getIrisRelations()
      expect(relations.length).toBeGreaterThan(0)
    })
  })

  /* ── Character Details (Mina) ── */
  describe("Mina Character Details", () => {
    it("getMinaTimeline returns non-empty array", () => {
      const timeline = ContentRepository.getMinaTimeline()
      expect(timeline.length).toBeGreaterThan(0)
    })
  })

  /* ── Platforms / Liminal ── */
  describe("Platforms", () => {
    it("getPlatforms returns non-empty array", () => {
      const platforms = ContentRepository.getPlatforms()
      expect(platforms.length).toBeGreaterThan(0)
    })

    it("platform entries have required fields", () => {
      const platforms = ContentRepository.getPlatforms()
      for (const platform of platforms) {
        expect(platform).toHaveProperty("name")
      }
    })
  })

  /* ── Factions ── */
  describe("Factions", () => {
    it("getFactionTrees returns non-empty array", () => {
      const trees = ContentRepository.getFactionTrees()
      expect(trees.length).toBeGreaterThan(0)
    })

    it("faction trees have required fields", () => {
      const trees = ContentRepository.getFactionTrees()
      for (const tree of trees) {
        expect(tree).toHaveProperty("name")
        expect(tree).toHaveProperty("color")
        expect(tree).toHaveProperty("description")
        expect(tree).toHaveProperty("keyMembers")
        expect(tree).toHaveProperty("nodes")
      }
    })
  })

  /* ── Relations ── */
  describe("Relations", () => {
    it("getRelationNodes returns non-empty array", () => {
      const nodes = ContentRepository.getRelationNodes()
      expect(nodes.length).toBeGreaterThan(0)
    })

    it("relation nodes have required fields", () => {
      const nodes = ContentRepository.getRelationNodes()
      for (const node of nodes) {
        expect(node).toHaveProperty("id")
        expect(node).toHaveProperty("name")
      }
    })

    it("getRelationEdges returns non-empty array", () => {
      const edges = ContentRepository.getRelationEdges()
      expect(edges.length).toBeGreaterThan(0)
    })

    it("relation edges have required fields", () => {
      const edges = ContentRepository.getRelationEdges()
      for (const edge of edges) {
        expect(edge).toHaveProperty("source")
        expect(edge).toHaveProperty("target")
        expect(edge).toHaveProperty("type")
      }
    })

    it("getEntityById finds existing entity", () => {
      const nodes = ContentRepository.getRelationNodes()
      const firstNode = nodes[0]!
      const entity = ContentRepository.getEntityById(firstNode.id)
      expect(entity).toBeDefined()
      expect(entity!.id).toBe(firstNode.id)
    })

    it("getEntityById returns undefined for non-existent entity", () => {
      const entity = ContentRepository.getEntityById("nonexistent-entity")
      expect(entity).toBeUndefined()
    })

    it("getRelationsForEntity returns relations for existing entity", () => {
      const nodes = ContentRepository.getRelationNodes()
      const firstNode = nodes[0]!
      const relations = ContentRepository.getRelationsForEntity(firstNode.id)
      // May be empty for some entities but the function should not throw
      expect(Array.isArray(relations)).toBe(true)
    })

    it("getRelationsForEntity returns empty for non-existent entity", () => {
      const relations = ContentRepository.getRelationsForEntity("nonexistent")
      expect(relations).toHaveLength(0)
    })
  })
})
