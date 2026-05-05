import { BotContext } from '../config/types'
import { SessionScenes } from '../config/types';
import { AuthHandler } from '../auth/auth.handler';
import { MenuHandler } from '../menu/menu.handler';
import { TasksViewHandler } from '../tasks/handlers/tasks.view.handler';
import { TasksCreateHandler } from '../tasks/handlers/tasks.create.handler';
import { TasksEditHandler } from '../tasks/handlers/tasks.edit.handler';
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
            taskCreateScene: new TasksCreateHandler(),
            tasksScene: new TasksViewHandler(),
            taskEditScene: new TasksEditHandler(),
            eventsScene: new EventsHandler()
        }
    }

    route(ctx: BotContext) {
    	const handler = this.handlers[ctx.session.scene];
	    return handler.handle(ctx);
    }
}

export default new Router();