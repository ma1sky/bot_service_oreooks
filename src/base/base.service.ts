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
		if (!res.ok) {
			const errorText = await this.getResponseText(res);
			throw new Error(`API error ${res.status}: ${errorText}`);
		}

		const contentType = res.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			const text = await res.text();
			throw new Error(`Expected JSON but got ${contentType}: ${text.substring(0, 200)}`);
		}

		try {
			const json = await res.json();
			const parsed = schema.parse(json);
			return parsed;
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(`API response validation failed: ${e.message}`);
			}
			throw new Error("Unknown API error");
		}
	}

	private async getResponseText(res: Response): Promise<string> {
		try {
			return await res.text();
		} catch {
			return `Failed to read response body (status: ${res.status})`;
		}
	}
}