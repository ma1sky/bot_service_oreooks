// import { Scenes } from "telegraf"

// export type Task = {
//     id?: number,
//     title?: string,
//     description?: string,
//     deadline?: Date,
// }

// export type AuthResult = {
//     success: boolean,
//     reason?: string,
//     token?: string
// }

// export interface SessionData extends Scenes.WizardSessionData {
//   authScene: {
//     login: string
//   }

//   scheduleScene: {
//     currentScheduleID: number
//     currentDate: Date
//   }

//   tasksScene: {
//     current: number
//   }
// }

//export type BotContext = Scenes.WizardContext<SessionData>

import { Context } from "telegraf"

export type BotContext = Context & {
	session: SessionDraft
}

export type SceneHandler = (ctx: BotContext) => Promise<any>;

export type AuthStep = 
    | "login"
    | "password"


export type TaskStep =
    | "taskTitle"
    | "taskDescription"
    | "taskDeadline"

export type SessionScenes = 
    | "authScene"
    | "taskCreateScene"
    | "taskEditScene"
    | "menuScene"
    | "scheduleScene"
    | "tasksScene"
    | "eventsScene"

export type MenuStep = 
    | "enter"
    | "idle"

export type SessionDraft =
    | { scene: SessionScenes; step: AuthStep }
    | { scene: SessionScenes; step: TaskStep }
    | { scene: SessionScenes; step: MenuStep }
    | { scene: SessionScenes; step: 'schedule' }
    | { scene: SessionScenes; step: 'tasks' }
    | { scene: SessionScenes; step: ''}

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