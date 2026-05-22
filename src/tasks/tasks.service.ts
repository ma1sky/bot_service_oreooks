import { API_SERVICE_LINK } from '../config/env.config';
import type { TaskDraft } from './tasks.types';
import BaseService from '../base/base.service';
import { taskResponseSchema, tasksListResponseSchema } from './tasks.schema';

class TaskService extends BaseService {
	constructor() {
		super(API_SERVICE_LINK);
	}

	async createTask(task: TaskDraft, tgId: number) {
		let deadlineISO: string | undefined;
		if (task.deadline) {
			if (task.deadline instanceof Date) {
				deadlineISO = task.deadline.toISOString();
			} else if (typeof task.deadline === 'string') {
				const date = new Date(task.deadline);
				if (!isNaN(date.getTime())) {
					deadlineISO = date.toISOString();
				}
			}
		}

		const res = await fetch(`${this.base}/users/${tgId}/tasks`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({
				authorId: tgId,
				title: task.title,
				description: task.description,
				deadline: deadlineISO,
				state: 'draft',
			}),
		});

		return this.request(res, taskResponseSchema);
	}

	async updateTask(task: TaskDraft, tgId: number) {
		if (!task.id) {
			throw new Error('Task id is required for update');
		}

		let deadlineISO: string | undefined;
		if (task.deadline) {
			if (task.deadline instanceof Date) {
				deadlineISO = task.deadline.toISOString();
			} else if (typeof task.deadline === 'string') {
				const date = new Date(task.deadline);
				if (!isNaN(date.getTime())) {
					deadlineISO = date.toISOString();
				}
			}
		}

		const res = await fetch(`${this.base}/users/${tgId}/tasks/${task.id}`, {
			method: 'PUT',
			headers: this.headers,
			body: JSON.stringify({
				title: task.title,
				description: task.description,
				deadline: deadlineISO,
				state: task.state,
			}),
		});

		return this.request(res, taskResponseSchema);
	}

	async getTasks(tgId: number) {
		const res = await fetch(`${this.base}/users/${tgId}/tasks`, {
			method: 'GET',
			headers: this.headers,
		});

		return this.request(res, tasksListResponseSchema);
	}

	async getTask(tgId: number, taskId: number) {
		const res = await fetch(`${this.base}/users/${tgId}/tasks/${taskId}`, {
			method: 'GET',
			headers: this.headers,
		});

		return this.request(res, taskResponseSchema);
	}

	async deleteTask(tgId: number, taskId: number) {
		const res = await fetch(`${this.base}/users/${tgId}/tasks/${taskId}`, {
			method: 'DELETE',
			headers: this.headers,
		});

		return this.request(res, taskResponseSchema);
	}

	async toggleTaskState(tgId: number, taskId: number) {
		const res = await fetch(`${this.base}/users/${tgId}/tasks/${taskId}`, {
			method: 'PUT',
			headers: this.headers,
		});

		return this.request(res, taskResponseSchema);
	}
}

export default new TaskService();
