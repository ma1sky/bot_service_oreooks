import { API_SERVICE_LINK } from "../config/env.config";
import type { TaskDraft } from "./tasks.types";
import BaseService from "../base/base.service";

class TaskService extends BaseService {

    async createTask(task: TaskDraft, tgId: number) {
        try {
            const res = await fetch(`${this.base}/users/${tgId}/tasks`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    authorId: tgId,
                    title: task.title,
                    description: task.description,
                    deadline: task.deadline?.toISOString()
                }),
            });

            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        } catch (error) {
            console.error(error);
            return { success: false, reason: error };
        }
    }

    async updateTask(task: TaskDraft, tgId: number) {
        try {
            const res = await fetch(`${this.base}/users/${tgId}/tasks/${task.id}`, {
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
            const res = await fetch(`${this.base}/users/${tgId}/tasks`, {
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
            const res = await fetch(`${this.base}/users/${tgId}/tasks/${taskId}`, {
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