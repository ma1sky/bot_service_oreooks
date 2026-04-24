export default class BaseService {
    constructor(base: string);
    protected base: string;
    protected headers: {
        "Content-Type": string;
        Accept: string;
    };
    protected parseResponse(res: Response): Promise<any>;
    protected checkResponse(status: number, data?: any): {
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
    };
}
//# sourceMappingURL=base.service.d.ts.map