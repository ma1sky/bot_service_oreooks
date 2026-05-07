import { z } from "zod";

export const loginSchema = z.string()
    .min(3, "❌ Логин слишком короткий")
    .max(32, "❌ Логин слишком длинный");

export const passwordSchema = z.string()
    .min(6, "❌ Пароль слишком короткий")
    .max(64, "❌ Пароль слишком длинный");

export const authSchema = z.object({
    login: loginSchema,
    password: passwordSchema
});

export const authResponseSchema = z.object({
    success: z.boolean(),
    token: z.string().optional(),
    reason: z.string().optional()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;