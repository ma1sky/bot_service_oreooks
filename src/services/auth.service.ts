import { API_SERVICE_LINK } from "../config/env.config.js";
import type { AuthResult } from "../config/types.js";

export async function authUser(
    login: string,
    password: string,
    tg_id: number
): Promise<AuthResult> {

    const res = await fetch(`${API_SERVICE_LINK}/auth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ login, password, tg_id })
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 200) {
        return { success: true, token: data.token };
    }

    if (res.status === 404) {
        return { success: false, reason: "not_found" };
    }

    if (res.status === 401) {
        return { success: false, reason: "invalid" };
    }

    return { success: false, reason: "error" };
}