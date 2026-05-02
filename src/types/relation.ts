import type { WikiId, CivilizationId } from "@/platform/schemas/branded"

/** Union type for relation graph node IDs (crosses wiki and civilization domains) */
export type RelationNodeId = WikiId | CivilizationId

export interface RelationNode {
  id: RelationNodeId
  name: string
  nameEn?: string
  category: "キャラクター" | "組織" | "文明"
  tier?: string
  image?: string
  description: string
  era?: string
  subCategory?: string
}

export interface RelationEdge {
  source: RelationNodeId
  target: RelationNodeId
  type: "所属" | "指導" | "同盟" | "対立" | "関連" | "歴史的"
  description: string
}
