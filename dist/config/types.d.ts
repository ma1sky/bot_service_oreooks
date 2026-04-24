import { Scenes } from "telegraf";
export type Task = {
    id?: number;
    title?: string;
    description?: string;
    deadline?: Date;
};
export type AuthResult = {
    success: boolean;
    reason?: string;
    token?: string;
};
export interface SessionData extends Scenes.WizardSessionData {
    authScene: {
        login: string;
        password: string;
        isAuth?: boolean;
    };
    tasksScene: {
        currentIndex: number;
        currentsTaskID: number;
        tasks: Task[];
    };
    scheduleScene: {
        currentScheduleIndex: number;
        currentScheduleID: number;
        currentDate: Date;
        schedules: Schedule[];
    };
}
export type BotContext = Scenes.WizardContext<SessionData> & {
    wizard: {
        state: Task;
    };
};
export type Schedule = {
    week: number;
    weekType: string;
    dayOfWeek: string;
    date: Date;
    lessons: {
        lesson_name: string;
        lesson_type: string;
        lesson_number: number;
        start: Date;
        end: Date;
        teacher: string;
        classroom: string;
    }[];
};
//# sourceMappingURL=types.d.ts.map