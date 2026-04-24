import { API_SERVICE_LINK } from "../config/env.config.js";
import BaseService from "./base.service.js";
class AuthService extends BaseService {
    async authUser(login, password, tg_id) {
        try {
            const res = await fetch(`${this.base}/auth`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({ login, password, tg_id })
            });
            const data = await this.parseResponse(res);
            return this.checkResponse(res.status, data);
        }
        catch (error) {
            if (error instanceof Error) {
                return { success: false, reason: error.message };
            }
            else {
                return { success: false, reason: "Unknown error" };
            }
        }
    }
}
export default new AuthService(API_SERVICE_LINK);
//# sourceMappingURL=auth.service.js.map