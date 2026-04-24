import type { Task } from "../config/types.js";
import BaseService from "./base.service.js";
declare class TaskService extends BaseService {
    createTask(title: string, description: string, deadline: Date, tgId: number): Promise<{
        success: boolean;
        data: any;
        reason?: never;
    } | {
        success: boolean;
        data?: never;
        reason?: never;
    } | {
        success: boolean;
        reason: unknown;
    }>;
    updateTask(task: Task, tgId: number, taskId: number): Promise<{
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
    getTasks(tgId: number): Promise<{
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
    deleteTask(tgId: number, taskId: number): Promise<{
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
declare const _default: TaskService;
export default _default;
//# sourceMappingURL=tasks.service.d.ts.map