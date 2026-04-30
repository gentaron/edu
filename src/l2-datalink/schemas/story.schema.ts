import { z } from "zod/v4"

export const StoryMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  titleJa: z.string().min(1),
  label: z.string().min(1),
  fileName: z.string().min(1),
  fileNameAlt: z.string().min(1),
  relatedEntries: z.array(z.string().min(1)),
  era: z.string().optional(),
  chapter: z.number().int().positive(),
  chapterOrder: z.number().int().min(0),
  isEnSource: z.boolean(),
})

export const ChapterMetaSchema = z.object({
  id: z.number().int().positive(),
  titleJa: z.string().min(1),
  titleEn: z.string().min(1),
  era: z.string().min(1),
  description: z.string().min(1),
  descriptionEn: z.string().min(1),
  color: z.string().min(1),
  gradient: z.string().min(1),
})

export type StoryMeta = z.infer<typeof StoryMetaSchema>
export type ChapterMeta = z.infer<typeof ChapterMetaSchema>
