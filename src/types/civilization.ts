export interface Civilization {
  id: string
  rank: number
  name: string
  nameEn: string
  color: string
  borderColor: string
  bgColor: string
  icon: string
  leader: string
  leaderWikiId: string
  capital?: string
  gdp?: string
  specialization: string
  description: string
  history: string
  currentStatus: string
  relationships: string[]
  wikiId: string
  href: string
  isHistorical?: boolean
  planets?: string[]
}

export interface CivilizationLeader {
  name: string
  title: string
  civilization: string
  civilizationColor: string
  wealth: string
  source: string
  era: string
  wikiId: string
}
