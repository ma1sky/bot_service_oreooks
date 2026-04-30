import { API_SERVICE_LINK } from "../config/env.config";
import BaseService from "../base/base.service";

class AuthService extends BaseService {
    async authUser(login: string, password: string, tg_id: number) {
        try {
            const res = await fetch(`${this.base}/auth`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({ login, password, tg_id })
            });
            
            console.log(`${this.base}/auth`);

            const data = await this.parseResponse(res);

            return this.checkResponse(res.status, data);

        } catch(error) {
            if (error instanceof Error) {
                return { success: false, reason: error.message };
            } else {
                return { success: false, reason: "Unknown error"}
            }
        }
    }
}

export default new AuthService(API_SERVICE_LINK);