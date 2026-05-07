import { ZodType } from "zod";

export default abstract class BaseService {
	protected base: string;
	protected headers: HeadersInit;

	constructor(base: string) {
		this.base = `https://${base}`;
		this.headers = {
			"Content-Type": "application/json"
		};
	}

	protected async request<T>(
		res: Response,
		schema: ZodType<T>
	): Promise<T> {
		try {
			const json = await res.json();

			const parsed = schema.parse(json);

			return parsed;
		} catch (e) {
			throw new Error(
				e instanceof Error ? e.message : "Unknown API error"
			);
		}
	}
}