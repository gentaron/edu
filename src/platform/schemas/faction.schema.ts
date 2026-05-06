import { z } from "zod/v4"

export const FactionNodeSchema = z.object({
  year: z.string().min(1),
  name: z.string().min(1),
  children: z.array(z.string()).optional(),
})

export const FactionTreeSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  dotColor: z.string().min(1),
  textColor: z.string().min(1),
  description: z.string().min(1),
  keyMembers: z.array(z.string().min(1)).min(1),
  alliances: z.string().min(1),
  nodes: z.array(FactionNodeSchema).min(1),
})

export type FactionNode = z.infer<typeof FactionNodeSchema>
export type FactionTree = z.infer<typeof FactionTreeSchema>
