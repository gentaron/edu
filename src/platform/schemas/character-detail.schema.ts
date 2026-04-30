import { z } from "zod/v4"

export const IrisTimelineEntrySchema = z.object({
  year: z.string().min(1),
  event: z.string().min(1),
  loc: z.string().min(1),
})

export const IrisAbilitySchema = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  color: z.string().min(1),
})

export const IrisRelationSchema = z.object({
  name: z.string().min(1),
  note: z.string().min(1),
  color: z.string().min(1),
})

export const MinaTimelineEntrySchema = z.object({
  age: z.string().min(1),
  year: z.string().min(1),
  event: z.string().min(1),
})

export const PlatformEntrySchema = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  type: z.enum(["PORTAL", "SOCIAL", "ARCHIVE", "MUSIC", "VISUAL", "STORY"]),
  color: z.string().min(1),
  bg: z.string().min(1),
  url: z.string().min(1),
})

export type IrisTimelineEntry = z.infer<typeof IrisTimelineEntrySchema>
export type IrisAbility = z.infer<typeof IrisAbilitySchema>
export type IrisRelation = z.infer<typeof IrisRelationSchema>
export type MinaTimelineEntry = z.infer<typeof MinaTimelineEntrySchema>
export type PlatformEntry = z.infer<typeof PlatformEntrySchema>
