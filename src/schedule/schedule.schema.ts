import { z } from 'zod'

export const lessonSchema = z.object({
    lessonName: z.string(),
    lessonType: z.string(),
    lessonNumber: z.number(),
    start: z.date(),
    end: z.date(),
    teacher: z.string(),
    classroom: z.string()
})

export const scheduleSchema = z.object({
    week: z.number(),
    weekType: z.string(),
    dayOfWeek: z.string(),
    date: z.date(),
    lessons: z.array(lessonSchema)
})

export const scheduleResponseSchema = z.object({
    success: z.boolean(),
    schedule: scheduleSchema,
    reason: z.string().optional()
});

export type ScheduleResponse = z.infer<typeof scheduleResponseSchema>