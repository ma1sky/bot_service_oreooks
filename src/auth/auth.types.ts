import { z } from "zod";
import { authSchema } from "./auth.schema";

export type AuthDraft = {
	login: string
}

export type AuthDto = z.infer<typeof authSchema>;

export const authResponseSchema = z.object({
	success: z.boolean(),
	token: z.string().optional(),
	reason: z.string().optional()
});

export type AuthResult =
	| { success: true; token: string }
	| { success: false; reason: string };