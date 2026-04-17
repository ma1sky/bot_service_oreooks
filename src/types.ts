import { Scenes } from "telegraf"

export type TaskState = {
    title?: string
    description?: string
    deadline?: Date
}

export interface SessionData extends Scenes.WizardSessionData {
    auth : {
        step: string,
        login: string,
        isAuth: boolean
    },

    menu : {
        tasks: {
            title? : string,
            description?: string,
            deadline? : Date
        }[]
    },
}

export type BotContext = Scenes.WizardContext<SessionData> & {
    wizard: {
        state: TaskState;
    }
};

export type Schedule = {
    week: number,
    weekType: string,
    dayOfWeek: string,
    date: Date,
    lessons: {
        lesson_name: string
        lesson_type: string,
        lesson_number: number,
        start: Date,
        end: Date
        teacher: string,
        classroom: string
    }[]
}