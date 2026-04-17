import { API_SERVICE_LINK } from "../config.js";

export async function authUser(login: string, password: string): Promise<boolean> {
    const res = await fetch(`${API_SERVICE_LINK}/auth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ login, password })
    })

    if (!res.ok) throw new Error("Auth failed")
    if (res.status === 404) return false;
    return true
}

export async function isAuth(id: number): Promise<boolean> {
    const res = await fetch(`${API_SERVICE_LINK}/users/${id}`, {
        method: 'GET',
    })

    if (res.status === 404) return false;
    if (!res.ok) throw new Error(`Server error: ${res.status}`)

    return true;
}