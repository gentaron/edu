/* ═══════════════════════════════════════════
   L3 NETWORK — Content Repository
   Data access for timeline, tech, character details, factions, and relations.
   ═══════════════════════════════════════════ */

import { TIMELINE_DATA, locColor } from "@/lib/timeline-data"
import { TECH_DATA } from "@/lib/tech-data"
import { IRIS_TIMELINE, IRIS_ABILITIES, IRIS_RELATIONS } from "@/lib/iris-data"
import { MINA_TIMELINE } from "@/lib/mina-data"
import { PLATFORMS } from "@/lib/liminal-data"
import { FACTION_TREES } from "@/lib/faction-data"
import {
  getRelationNodes,
  getRelationEdges,
  getEntityById,
  getRelationsForEntity,
} from "@/lib/relation-data"
import type {
  TimelinePeriod,
  TechEntry,
  IrisTimelineEntry,
  IrisAbility,
  IrisRelation,
  MinaTimelineEntry,
  PlatformEntry,
  FactionTree,
  RelationNode,
  RelationEdge,
} from "@/platform/schemas"

export const ContentRepository = {
  // ── Timeline ──
  getTimeline(): readonly TimelinePeriod[] {
    return TIMELINE_DATA
  },

  getTimelineLocationColors(): Readonly<Record<string, string>> {
    return locColor
  },

  // ── Technology ──
  getTechEntries(): readonly TechEntry[] {
    return TECH_DATA as unknown as readonly TechEntry[]
  },

  findTechById(id: string): TechEntry | undefined {
    return (TECH_DATA as unknown as TechEntry[]).find((t) => t.id === id)
  },

  // ── Character Details ──
  getIrisTimeline(): readonly IrisTimelineEntry[] {
    return IRIS_TIMELINE
  },

  getIrisAbilities(): readonly IrisAbility[] {
    return IRIS_ABILITIES
  },

  getIrisRelations(): readonly IrisRelation[] {
    return IRIS_RELATIONS
  },

  getMinaTimeline(): readonly MinaTimelineEntry[] {
    return MINA_TIMELINE
  },

  // ── Liminal / Platforms ──
  getPlatforms(): readonly PlatformEntry[] {
    return PLATFORMS as unknown as readonly PlatformEntry[]
  },

  // ── Factions ──
  getFactionTrees(): readonly FactionTree[] {
    return FACTION_TREES
  },

  // ── Relations ──
  getRelationNodes(): RelationNode[] {
    return getRelationNodes()
  },

  getRelationEdges(): RelationEdge[] {
    return getRelationEdges()
  },

  getEntityById(id: string): RelationNode | undefined {
    return getEntityById(id)
  },

  getRelationsForEntity(id: string): { node: RelationNode; edge: RelationEdge }[] {
    return getRelationsForEntity(id)
  },
}
