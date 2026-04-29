export type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史"

export interface SourceLink {
  url: string
  label: string
}

export interface LeaderEntry {
  id: string
  name: string
  nameEn?: string
  role: string
  era?: string
}

export interface WikiEntry {
  id: string
  name: string
  nameEn?: string
  category: Category
  subCategory?: string
  description: string
  era?: string
  affiliation?: string
  tier?: string
  image?: string
  sourceLinks?: SourceLink[]
  leaders?: LeaderEntry[]
}
