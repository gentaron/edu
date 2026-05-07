import type { CivilizationId, WikiId } from "@/platform/schemas/branded"

export interface Civilization {
  id: CivilizationId
  rank: number
  name: string
  nameEn: string
  color: string
  borderColor: string
  bgColor: string
  icon: string
  leader: string
  leaderWikiId: WikiId
  capital?: string
  gdp?: string
  specialization: string
  description: string
  history: string
  currentStatus: string
  relationships: string[]
  specializationEn?: string
  descriptionEn?: string
  historyEn?: string
  currentStatusEn?: string
  relationshipsEn?: string[]
  wikiId: WikiId
  href: string
  isHistorical?: boolean
  planets?: string[]
}

export interface CivilizationLeader {
  name: string
  nameEn?: string
  title: string
  titleEn?: string
  civilization: string
  civilizationEn?: string
  civilizationColor: string
  wealth: string
  wealthEn?: string
  source: string
  sourceEn?: string
  era: string
  eraEn?: string
  wikiId: WikiId
}
