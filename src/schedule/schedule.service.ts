import { API_SERVICE_LINK } from '../config/env.config';
import BaseService from '../base/base.service';
import { ScheduleResponse, scheduleResponseSchema } from './schedule.schema';

class ScheduleService extends BaseService {
	constructor() {
		super(API_SERVICE_LINK);
	}

	async getSchedule(tgId: number, date: Date): Promise<ScheduleResponse> {
		const formattedDate = date.toISOString().split('T')[0];
		const res = await fetch(`${this.base}/users/${tgId}/schedule/${formattedDate}`, {
			method: 'GET',
			headers: this.headers,
		});

		return this.request<ScheduleResponse>(res, scheduleResponseSchema);
	}
}

export default new ScheduleService();
