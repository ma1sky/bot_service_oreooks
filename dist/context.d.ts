import { Scenes } from 'telegraf';
export interface SessionData extends Scenes.WizardSessionData {
    auth: {
        step: string;
        login: string;
        isAuth: boolean;
        token: string;
    };
    menu: {
        tasks: Task[];
    };
    schedule: {
        weekType: string;
        days: Day[];
    };
}
type Day = {};
declare enum TaskStatus {
    completed = "completed",
    inProgress = "inProgress",
    canceled = "canceled"
}
type Task = {
    title?: string;
    description?: string;
    deadline?: Date;
    status: TaskStatus;
};
export type TaskState = {
    title?: string;
    description?: string;
    deadline?: Date;
};
export type BotContext = Scenes.WizardContext<SessionData> & {
    wizard: {
        state: TaskState;
    };
};
export {};
//# sourceMappingURL=context.d.ts.map