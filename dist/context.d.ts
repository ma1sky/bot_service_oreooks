import { Scenes, Context } from 'telegraf';
export interface SessionData extends Scenes.WizardSessionData {
    auth: {
        step: string;
        login: string;
        isAuth: boolean;
        token: string;
    };
    menu?: {
        tasks: task[];
    };
}
declare enum TaskStatus {
    completed = 0,
    inProgress = 1,
    canceled = 2
}
type task = {
    title?: string;
    descrition?: string;
    deadline?: Date;
    status: TaskStatus;
};
export interface SessionContext extends Context {
    session: Scenes.WizardSession<SessionData>;
    scene: Scenes.SceneContextScene<SessionContext, SessionData>;
    wizard: Scenes.WizardContextWizard<SessionContext>;
}
export {};
//# sourceMappingURL=context.d.ts.map