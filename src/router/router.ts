import { BotContext } from '../config/types'
import { SessionScenes, SceneHandler } from '../config/types';
import { authHandler } from '../auth/auth.handler';
import { menuHandler } from '../menu/menu.handler';
import { tasksViewHandler } from '../tasks/handlers/tasks.view.handler';
import { tasksCreateHandler } from '../tasks/handlers/tasks.create.handler';
import { tasksEditHandler } from '../tasks/handlers/tasks.edit.handler';
import { scheduleHandler } from '../schedule/schedule.handler'; 
import { eventsHandler } from '../events/events.handler'


class Router {
    private handlers: Record<SessionScenes, SceneHandler> = {
        authScene: authHandler,
        menuScene: menuHandler,
        scheduleScene: scheduleHandler,
        taskCreateScene: tasksCreateHandler,
        tasksScene: tasksViewHandler,
        taskEditScene: tasksEditHandler,
        eventsScene: eventsHandler
    }

    route(ctx: BotContext) {
    	const handler = this.handlers[ctx.session.scene];
	    return handler(ctx);
    }
}

export default new Router();