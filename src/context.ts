import { Scenes, Context } from 'telegraf'

export interface SessionData extends Scenes.WizardSessionData {
    auth : {
        step: string,
        login: string,
        isAuth: boolean,
        token: string
    },

    menu? : {
        tasks: task[]
    }
}

enum TaskStatus {
    completed,
    inProgress,
    canceled
} 

type task = {
    title? : string,
    descrition?: string,
    deadline? : Date
    status: TaskStatus
}

export interface SessionContext extends Context {
  session: Scenes.WizardSession<SessionData>
  scene: Scenes.SceneContextScene<SessionContext, SessionData>
  wizard: Scenes.WizardContextWizard<SessionContext>
}