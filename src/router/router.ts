import { BotContext } from '../config/types'
import { SessionScenes } from '../config/types';
import { AuthHandler } from '../auth/auth.handler';
import { MenuHandler } from '../menu/menu.handler';
import { TasksHandler } from '../tasks/tasks.handler';
import { ScheduleHandler } from '../schedule/schedule.handler'; 
import { EventsHandler } from '../events/events.handler'
import { BaseHandler } from '../base/base.handler';
import { SessionData } from '../session/session';


class Router {
    private handlers: Record<SessionScenes, BaseHandler>;

    constructor() {
        this.handlers = {
            authScene: new AuthHandler(),
            menuScene: new MenuHandler(),
            scheduleScene: new ScheduleHandler(),
            tasksScene: new TasksHandler(),
            eventsScene: new EventsHandler()
        };
    }

    async route(ctx: BotContext) {
        const tgId = ctx.from?.id;
        if (!tgId) return;

        const session = await SessionData.get(tgId);

        const scene = session?.scene;

        if (!scene || !(scene in this.handlers)) {
            await SessionData.set(tgId, {
                scene: "authScene",
                step: "login"
            });

            return this.handlers.authScene.handle(ctx);
        }

        return this.handlers[scene].handle(ctx);
    }
}

export default new Router();