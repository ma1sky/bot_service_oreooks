import { API_SERVICE_LINK } from "../config/env.config.js";
import BaseService from "./base.service.js";
class TaskService extends BaseService {
    async createTask(title, description, deadline, tgId) {
        const url = `${this.base}/users/${tgId}/tasks`;
        const payload = {
            tgId,
            title,
            description,
            deadline: deadline.toISOString()
        };
        try {
            console.log('========== CREATE TASK DEBUG ==========');
            console.log('URL:', url);
            console.log('METHOD:', 'POST');
            console.log('HEADERS:', this.headers);
            console.log('BODY:', payload);
            const res = await fetch(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(payload)
            });
            console.log('STATUS:', res.status);
            console.log('STATUS TEXT:', res.statusText);
            console.log('OK:', res.ok);
            const data = await this.parseResponse(res);
            console.log('RESPONSE DATA:', data);
            console.log('======================================');
            return this.checkResponse(res.status, data);
        }
        catch (error) {
            console.log('========== FETCH ERROR ==========');
            if (error instanceof Error) {
                console.error('NAME:', error.name);
                console.error('MESSAGE:', error.message);
                console.error('STACK:', error.stack);
            }
            else {
                console.error('UNKNOWN ERROR:', error);
            }
            console.log('URL:', url);
            console.log('BODY:', payload);
            console.log('================================');
            return {
                success: false,
                reason: error instanceof Error ? error.message : 'fetch_error'
            };
        }
    }
    async updateTask(task, tgId, taskId) {
        try {
            const res = await fetch(`${this.base}/${tgId}/tasks/${taskId}`, {
                method: "PUT",
                headers: this.headers,
                body: JSON.stringify(task),
            });
            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        }
        catch (error) {
            console.error(error);
            return { success: false, reason: "error" };
        }
    }
    async getTasks(tgId) {
        try {
            const res = await fetch(`${this.base}/${tgId}/tasks`, {
                method: "GET",
                headers: this.headers,
            });
            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        }
        catch (error) {
            console.error(error);
            return { success: false, reason: "error" };
        }
    }
    async deleteTask(tgId, taskId) {
        try {
            const res = await fetch(`${this.base}/${tgId}/tasks/${taskId}`, {
                method: "DELETE",
                headers: this.headers,
            });
            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        }
        catch (error) {
            console.error(error);
            return { success: false, reason: "error" };
        }
    }
}
export default new TaskService(API_SERVICE_LINK);
//# sourceMappingURL=tasks.service.js.map