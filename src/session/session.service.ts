import redis from '../config/redis.config'

type BaseSession = {
  updatedAt?: number
}

export default class Session<Type extends BaseSession> {
	private prefix: string;

	constructor(prefix: string) {
		this.prefix = prefix;
	}

	async get(key: number): Promise<Type> {
		const data = await redis.get(this.key(key));

		return data? JSON.parse(data) : {} as Type;
	}

	async set(key: number, data: Type) {
		await redis.set(
			this.key(key),
			JSON.stringify(data),
			"EX",
			60 * 60 * 24
		);
	}

	async update(key: number, partial: Partial<Type>) {
		const current = await this.get(key);

		const updated = {
			...current,
			...partial,
			updatedAt: Date.now(),
		};

		await this.set(key, updated);
	}

	async clear(key: number) {
		await redis.del(this.key(key));
	}

	private key(key: number) {
		return `${this.prefix}:${key}`;
	}
};