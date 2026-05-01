export default class BaseService {
    constructor(base: string) {
        this.base = `http://${base}`;

    }
    protected base: string;

    protected headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
    };

    protected async parseResponse(res: Response) {
        try {
            return await res.json();
        } catch {
            return null
        }
    }

    protected checkResponse(status: number, data?: any) {
        switch (status) {
            case 200:
            case 201: return { success: true, data };
            case 204: return { success: true };
            case 401: return { success: false, reason: "invalid" };
            case 404: return { success: false, reason: "not_found" };
            case 500: return { success: false, reason: "server_error" };
            default: return { success: false, reason: "error" };
        }
    }
}