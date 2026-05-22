import { API_SERVICE_LINK } from '../config/env.config';
import BaseService from '../base/base.service';
import { authResponseSchema, AuthResponse } from './auth.schema';

class AuthService extends BaseService {
	constructor() {
		super(API_SERVICE_LINK);
	}

	async authUser(login: string, password: string, tgId: number): Promise<AuthResponse> {
		const res = await fetch(`${this.base}/auth`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ login, password, tgId }),
		});
		return this.request<AuthResponse>(res, authResponseSchema);
	}
}

export default new AuthService();
