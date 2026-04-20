import { API_SERVICE_LINK } from "../config/env.config.js";
import type { AuthResult } from "../config/types.js";

export async function authUser(
    login: string,
    password: string,
    tg_id: number
): Promise<AuthResult> {

    try {
        const res = await fetch(`http://${API_SERVICE_LINK}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ login, password, tg_id })
        });


        console.log("STATUS:", res.status);
        
        let data: any = {};
        
        try {
            data = await res.json();
            console.log("BODY:", data);
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
        console.log(error);
        return { success: false, reason: "error 2" };
    }
}