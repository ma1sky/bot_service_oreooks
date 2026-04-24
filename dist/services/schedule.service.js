import { API_SERVICE_LINK } from "../config/env.config.js";
import BaseService from "./base.service.js";
class ScheduleService extends BaseService {
    async getSchedule(id, date) {
        let formattedDate = date.toISOString().split('T')[0];
        try {
            const res = await fetch(`${this.base}/users/${id}/schedule/${formattedDate}`, {
                method: 'GET',
                headers: this.headers
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
export default new ScheduleService(API_SERVICE_LINK);
//# sourceMappingURL=schedule.service.js.map