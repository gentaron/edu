import { z } from "zod/v4"

export const CategorySchema = z.enum(["キャラクター", "用語", "組織", "地理", "技術", "歴史"])

export const SourceLinkSchema = z.object({
  url: z.string().min(1),
  label: z.string().min(1),
})

export const LeaderEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameEn: z.string().optional(),
  role: z.string().min(1),
  era: z.string().optional(),
})

export const WikiEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameEn: z.string().optional(),
  category: CategorySchema,
  subCategory: z.string().optional(),
  description: z.string().min(1),
  era: z.string().optional(),
  affiliation: z.string().optional(),
  tier: z.string().optional(),
  image: z.string().optional(),
  sourceLinks: z.array(SourceLinkSchema).optional(),
  leaders: z.array(LeaderEntrySchema).optional(),
})

export type Category = z.infer<typeof CategorySchema>
export type SourceLink = z.infer<typeof SourceLinkSchema>
export type LeaderEntry = z.infer<typeof LeaderEntrySchema>
export type WikiEntry = z.infer<typeof WikiEntrySchema>
