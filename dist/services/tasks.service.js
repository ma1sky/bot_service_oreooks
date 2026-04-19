import { API_SERVICE_LINK } from "../config/env.config.js";
export async function sendTaskToApi(title, description, deadline, id) {
    const res = await fetch(`${API_SERVICE_LINK}/user/${id}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ id, title, description, deadline })
    });
    if (!res.ok)
        throw new Error('Error adding task');
    return await res.status;
}
//# sourceMappingURL=tasks.service.js.map