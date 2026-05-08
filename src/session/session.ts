import { AuthDraft } from '../auth/auth.types';
import { TaskDraft, TasksCache } from '../tasks/tasks.types';
import redis from '../config/redis.config';
import { SessionDraft } from '../config/types'

export default class RedisClient<Type> {
	constructor(prefix: string, ttl: number = 86400) {
		this.prefix = prefix;
		this.ttl = ttl;
	}
	private ttl: number;
	private prefix: string;

	async get(key: number): Promise<Type | null> {
		const data = await redis.get(this.getKey(key));

		if (!data) return null;

		try {
			return JSON.parse(data);
		} catch {
			return null;
		}
	}
	async set(key: number, data: Type) {
		await redis.set(
			this.getKey(key),
			JSON.stringify(data),
			"EX",
			this.ttl
		);
	}

	async update(key: number, partial: Partial<Type>) {
		const current = await this.get(key);

		const base = current ?? ({} as Type);

		const updated: Type = {
			...base,
			...partial,
		};

		await this.set(key, updated);
	}

	async clear(key: number) {
		await redis.del(this.getKey(key));
	}

	getKey(key: number) {
		return `${this.prefix}:${key}`;
	}
};

export const AuthSession = new RedisClient<AuthDraft>('auth');
export const SessionData = new RedisClient<SessionDraft>('session');
export const TaskSession = new RedisClient<TaskDraft>("draft:task")
export const TasksCacheSession = new RedisClient<TasksCache>('tasks')