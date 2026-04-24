import { API_SERVICE_LINK } from "../config/env.config.js";
import type { Task } from "../config/types.js";
import BaseService from "./base.service.js";

class TaskService extends BaseService {

    async createTask(title: string, description: string, deadline: Date, tgId: number) {
        try {
            const res = await fetch(`${this.base}/users/${tgId}/tasks`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({tgId, title, description, deadline: deadline.toISOString()}),
            });

            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        } catch (error) {
            console.error(error);
            return { success: false, reason: error };
        }
    }

    async updateTask(task: Task, tgId: number, taskId: number) {
        try {
            const res = await fetch(`${this.base}/${tgId}/tasks/${taskId}`, {
                method: "PUT",
                headers: this.headers,
                body: JSON.stringify(task),
            });

            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        } catch (error) {
            console.error(error);
            return { success: false, reason: "error" };
        }
    }

    async getTasks(tgId: number) {
        try {
            const res = await fetch(`${this.base}/${tgId}/tasks`, {
                method: "GET",
                headers: this.headers,
            });

            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        } catch (error) {
            console.error(error);
            return { success: false, reason: "error" };
        }
    }

    async deleteTask(tgId: number, taskId: number) {
        try {
            const res = await fetch(`${this.base}/${tgId}/tasks/${taskId}`, {
                method: "DELETE",
                headers: this.headers,
            });

            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        } catch (error) {
            console.error(error);
            return { success: false, reason: "error" };
        }
    }
}

export default new TaskService(API_SERVICE_LINK);