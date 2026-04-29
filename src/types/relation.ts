export interface RelationNode {
  id: string
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
  source: string
  target: string
  type: "所属" | "指導" | "同盟" | "対立" | "関連" | "歴史的"
  description: string
}
