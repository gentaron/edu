import { z } from "zod/v4"

export const RelationNodeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameEn: z.string().optional(),
  category: z.enum(["キャラクター", "組織", "文明"]),
  tier: z.string().optional(),
  image: z.string().optional(),
  description: z.string().min(1),
  era: z.string().optional(),
  subCategory: z.string().optional(),
})

export const RelationEdgeSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  type: z.enum(["所属", "指導", "同盟", "対立", "関連", "歴史的"]),
  description: z.string().min(1),
})

export type RelationNode = z.infer<typeof RelationNodeSchema>
export type RelationEdge = z.infer<typeof RelationEdgeSchema>
