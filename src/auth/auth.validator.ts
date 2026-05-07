import {
    loginSchema,
    passwordSchema,
    authSchema
} from "./auth.schema";

class AuthValidator {
    validateLogin(login: string) {
        return loginSchema.safeParse(login);
    }

    validatePassword(password: string) {
        return passwordSchema.safeParse(password);
    }

    validateAuth(data: unknown) {
        return authSchema.safeParse(data);
    }
}

export default new AuthValidator();