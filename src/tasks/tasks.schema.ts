import { z } from 'zod';

export const titleSchema = z
    .string()
    .min(2, "❌ Слишком короткое название")
    .max(64, "❌ Слишком длинное название");

export const descriptionSchema = z
    .string()
    .min(2, "❌ Слишком короткое описание")
    .max(256, "❌ Слишком длинное описание");

export const deadlineSchema = z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, "Неверный формат даты")
    .transform((val) => {
        const [dd, mm, yyyy] = val.split('.');
        return new Date(+yyyy!, +mm! - 1, +dd!);
    })

export const taskSchema = z.object({
    id: z.number().optional(),
    title: titleSchema,
    description: descriptionSchema,
    deadline: deadlineSchema,
    state: z.enum(["draft", "completed"]).optional().default("draft")
});

export const taskResponseSchema = z.object({
    success: z.boolean(),
    reason: z.string().optional(),
    task: taskSchema.optional()
});

export type TaskResponse = z.infer<typeof taskResponseSchema>;

export const tasksListResponseSchema = z.object({
	success: z.boolean(),
	tasks: z.array(taskSchema).optional(),
	reason: z.string().optional(),
});