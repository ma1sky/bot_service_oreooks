import { API_SERVICE_LINK } from "../config.js";

export async function sendTaskToApi(title: string, description: string, deadline: Date, id: number): Promise<number> {
    const res = await fetch(`${API_SERVICE_LINK}/user/${id}/tasks`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ id, title, description, deadline })
    })
    
    if (!res.ok) throw new Error('Error adding task')
    return await res.status;
}