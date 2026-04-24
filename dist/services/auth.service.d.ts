import BaseService from "./base.service.js";
declare class AuthService extends BaseService {
    authUser(login: string, password: string, tg_id: number): Promise<{
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
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map