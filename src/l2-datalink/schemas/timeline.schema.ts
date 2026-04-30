import { z } from "zod/v4"

export const TlEvSchema = z.object({
  text: z.string().min(1),
  loc: z.string().optional(),
})

export const TimelinePeriodSchema = z.object({
  period: z.string().min(1),
  range: z.string().min(1),
  color: z.string().min(1),
  borderColor: z.string().min(1),
  events: z.array(TlEvSchema).min(1),
})

export type TlEv = z.infer<typeof TlEvSchema>
export type TimelinePeriod = z.infer<typeof TimelinePeriodSchema>
