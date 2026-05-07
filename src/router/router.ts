import { BotContext } from '../config/types'
import { SessionScenes } from '../config/types';
import { AuthHandler } from '../auth/auth.handler';
import { MenuHandler } from '../menu/menu.handler';
import { TasksHandler } from '../tasks/tasks.handler';
import { ScheduleHandler } from '../schedule/schedule.handler'; 
import { EventsHandler } from '../events/events.handler'
import { BaseHandler } from '../base/base.handler';


export class Router {
    private handlers: Record<SessionScenes, BaseHandler>;

    constructor() {
        this.handlers = {
            authScene: new AuthHandler(),
            menuScene: new MenuHandler(),
            scheduleScene: new ScheduleHandler(),
            tasksScene: new TasksHandler(),
            eventsScene: new EventsHandler()
        }
    }

    route(ctx: BotContext) {
    	const handler = this.handlers[ctx.session.scene];
	    return handler.handle(ctx);
    }
}

export default new Router();