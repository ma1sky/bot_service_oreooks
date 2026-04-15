import { Scenes, Context } from 'telegraf'

export interface SessionData extends Scenes.WizardSessionData {
    auth : {
        step: string,
        login: string,
        isAuth: boolean,
        token: string
    },

    menu? : {
        tasks: Task[]
    }
}

enum TaskStatus {
    completed = 'completed',
    inProgress = 'inProgress',
    canceled = 'canceled'
} 

type Task = {
    title? : string,
    description?: string,
    deadline? : Date
    status: TaskStatus
}

export type TaskState = {
  title?: string
  description?: string
  deadline?: Date
}

export type BotContext = Scenes.WizardContext<SessionData> & {
    wizard: {
        state: TaskState;
    }
};

// export interface SessionContext extends Context {
//   session: Scenes.WizardSession<SessionData>
//   scene: Scenes.SceneContextScene<SessionContext, SessionData>
//   wizard: Scenes.WizardContextWizard<SessionContext>
// }