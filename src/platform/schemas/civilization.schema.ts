import { z } from "zod/v4"

export const CivilizationSchema = z.object({
  id: z.string().min(1),
  rank: z.number().int().positive(),
  name: z.string().min(1),
  nameEn: z.string().min(1),
  color: z.string().min(1),
  borderColor: z.string().min(1),
  bgColor: z.string().min(1),
  icon: z.string().min(1),
  leader: z.string().min(1),
  leaderWikiId: z.string().min(1),
  capital: z.string().optional(),
  gdp: z.string().optional(),
  specialization: z.string().min(1),
  description: z.string().min(1),
  history: z.string().min(1),
  currentStatus: z.string().min(1),
  relationships: z.array(z.string()),
  wikiId: z.string().min(1),
  href: z.string().min(1),
  isHistorical: z.boolean().optional(),
  planets: z.array(z.string()).optional(),
})

export const CivilizationLeaderSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  civilization: z.string().min(1),
  civilizationColor: z.string().min(1),
  wealth: z.string().min(1),
  source: z.string().min(1),
  era: z.string().min(1),
  wikiId: z.string().min(1),
})

export type Civilization = z.infer<typeof CivilizationSchema>
export type CivilizationLeader = z.infer<typeof CivilizationLeaderSchema>
