import { z } from 'zod';
export const eventSchema = z.object({
  id: z.number(),
  alias: z.string().nullable(),
  name: z.string().nullable(),
  type: z.string(),
  week: z.number(),
  currentGrade: z.number().nullable(),
  maxGrade: z.number(),
  disciplineId: z.number(),
});
export const eventsResponseSchema = z.object({
  success: z.boolean(),
  events: z.array(eventSchema).optional(),
  reason: z.string().optional(),
});
export type Event = z.infer<typeof eventSchema>;
export type EventsResponse = z.infer<typeof eventsResponseSchema>;