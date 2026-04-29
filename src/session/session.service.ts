import redis from '../config/redis.config'

export default class Session<Type> {
	private prefix: string;
	constructor(prefix: string) {
		this.prefix = prefix;
	}

	async get(userId: number): Promise<Type> {
		const data = await redis.get(this.key(userId));

		return data? JSON.parse(data) : {} as Type;
	}

	async set(userId: number, data: Type) {
		await redis.set(
			this.key(userId),
			JSON.stringify(data),
			"EX",
			60 * 60 * 24
		);
	}

	async update(userId: number, partial: Partial<Type>) {
		const current = await this.get(userId);

		const updated = {
			...current,
			...partial,
			updatedAt: Date.now(),
		};

		await this.set(userId, updated);
	}

	async clear(userId: number) {
		await redis.del(this.key(userId));
	}

	private key(userId: number) {
		return `${this.prefix}${userId}`;
	}
};