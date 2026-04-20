import { API_SERVICE_LINK } from "../config/env.config.js";
import type { AuthResult } from "../config/types.js";

export async function authUser(
    login: string,
    password: string,
    tg_id: number
): Promise<AuthResult> {

    try {
        const res = await fetch(`${API_SERVICE_LINK}/auth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ login, password, tg_id })
        });

        const text = await res.text();

        console.log("STATUS:", res.status);
        console.log("BODY:", text);

        let data: any = {};

        try {
            data = await res.json();
        } catch {
            return { success: false, reason: "error" };
        }

        switch (res.status) {
            case 200:
                return { success: true, token: data.token };

            case 404:
                return { success: false, reason: "not_found" };

            case 401:
                return { success: false, reason: "invalid" };

            default:
                return { success: false, reason: "error" };
        }

    } catch (error) {
        return { success: false, reason: "error 2" };
    }
}