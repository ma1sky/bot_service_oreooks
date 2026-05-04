import { BotContext } from '../config/types'
import { SessionScenes } from '../config/types';
import { AuthHandler } from '../auth/auth.handler';
import { MenuHandler } from '../menu/menu.handler';
import { tasksViewHandler } from '../tasks/handlers/tasks.view.handler';
import { tasksCreateHandler } from '../tasks/handlers/tasks.create.handler';
import { tasksEditHandler } from '../tasks/handlers/tasks.edit.handler';
import { scheduleHandler } from '../schedule/schedule.handler'; 
import { eventsHandler } from '../events/events.handler'
import { BaseHandler } from '../base/base.handler';


export class Router {
    private handlers: Record<SessionScenes, BaseHandler>;

    constructor() {
        this.handlers = {
            authScene: new AuthHandler(),
            menuScene: new MenuHandler(),
            scheduleScene: scheduleHandler,
            taskCreateScene: tasksCreateHandler,
            tasksScene: tasksViewHandler,
            taskEditScene: tasksEditHandler,
            eventsScene: eventsHandler
        }
    }

    route(ctx: BotContext) {
    	const handler = this.handlers[ctx.session.scene];
	    return handler.handle(ctx);
    }
}

export default new Router();