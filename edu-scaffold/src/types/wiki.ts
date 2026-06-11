import type { WikiId } from "@/platform/schemas/branded"

export type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史"

export interface SourceLink {
  url: string
  label: string
}

export interface LeaderEntry {
  id: WikiId
  name: string
  nameEn?: string
  role: string
  era?: string
}

export interface WikiEntry {
  id: WikiId
  name: string
  nameEn?: string
  category: Category
  subCategory?: string
  description: string
  descriptionEn?: string
  era?: string
  affiliation?: string
  tier?: string
  image?: string
  sourceLinks?: SourceLink[]
  leaders?: LeaderEntry[]
}
