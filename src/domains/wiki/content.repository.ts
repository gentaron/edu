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

export class ContentRepository {
  // ── Timeline ──
  static getTimeline(): readonly TimelinePeriod[] {
    return TIMELINE_DATA
  }

  static getTimelineLocationColors(): Readonly<Record<string, string>> {
    return locColor
  }

  // ── Technology ──
  static getTechEntries(): readonly TechEntry[] {
    return TECH_DATA as unknown as readonly TechEntry[]
  }

  static findTechById(id: string): TechEntry | undefined {
    return (TECH_DATA as unknown as TechEntry[]).find((t) => t.id === id)
  }

  // ── Character Details ──
  static getIrisTimeline(): readonly IrisTimelineEntry[] {
    return IRIS_TIMELINE
  }

  static getIrisAbilities(): readonly IrisAbility[] {
    return IRIS_ABILITIES
  }

  static getIrisRelations(): readonly IrisRelation[] {
    return IRIS_RELATIONS
  }

  static getMinaTimeline(): readonly MinaTimelineEntry[] {
    return MINA_TIMELINE
  }

  // ── Liminal / Platforms ──
  static getPlatforms(): readonly PlatformEntry[] {
    return PLATFORMS as unknown as readonly PlatformEntry[]
  }

  // ── Factions ──
  static getFactionTrees(): readonly FactionTree[] {
    return FACTION_TREES
  }

  // ── Relations ──
  static getRelationNodes(): RelationNode[] {
    return getRelationNodes()
  }

  static getRelationEdges(): RelationEdge[] {
    return getRelationEdges()
  }

  static getEntityById(id: string): RelationNode | undefined {
    return getEntityById(id)
  }

  static getRelationsForEntity(id: string): { node: RelationNode; edge: RelationEdge }[] {
    return getRelationsForEntity(id)
  }
}
