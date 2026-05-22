import { API_SERVICE_LINK } from '../config/env.config';
import BaseService from '../base/base.service';
import { EventsResponse, eventsResponseSchema } from './events.schema';
class EventsService extends BaseService {
  constructor() {
    super(API_SERVICE_LINK);
  }
  async getEvents(tgId: number, date: Date): Promise<EventsResponse> {
    const formattedDate = date.toISOString().split('T')[0];
    const res = await fetch(`${this.base}/users/${tgId}/events/${formattedDate}`, {
      method: 'GET',
      headers: this.headers,
    });
    return this.request<EventsResponse>(res, eventsResponseSchema);
  }
}
export default new EventsService();