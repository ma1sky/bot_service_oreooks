import BaseService from "./base.service.js";
declare class ScheduleService extends BaseService {
    getSchedule(id: number, date: Date): Promise<{
        success: boolean;
        data: any;
        reason?: never;
    } | {
        success: boolean;
        data?: never;
        reason?: never;
    } | {
        success: boolean;
        reason: string;
        data?: never;
    }>;
}
declare const _default: ScheduleService;
export default _default;
//# sourceMappingURL=schedule.service.d.ts.map