import { z } from "zod/v4"

export const TechEntrySchema = z.object({
  id: z.string().regex(/^[\da-z-]+$/),
  name: z.string().min(1),
  nameEn: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
  borderColor: z.string().min(1),
  bgGlow: z.string().min(1),
  tag: z.string().min(1),
  tagColor: z.string().min(1),
  physics: z.string().min(1),
  applications: z.array(z.string().min(1)).min(1),
})

export type TechEntry = z.infer<typeof TechEntrySchema>
