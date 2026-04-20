import { API_SERVICE_LINK } from "../config/env.config.js";
export async function authUser(login, password, tg_id) {
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
        let data = {};
        try {
            data = await res.json();
        }
        catch {
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
    }
    catch (error) {
        return { success: false, reason: "error" };
    }
}
//# sourceMappingURL=auth.service.js.map