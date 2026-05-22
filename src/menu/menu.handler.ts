import type { BotContext } from '../config/types';
import { SessionData } from '../session/session';
import { BaseHandler } from '../base/base.handler';
import { showMenu } from './menu.messages';
import { TasksHandler } from '../tasks/tasks.handler';
import { ScheduleHandler } from '../schedule/schedule.handler';
import { EventsHandler } from '../events/events.handler';
export class MenuHandler extends BaseHandler {
	private actions = {
		openTasks: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			await SessionData.update(tgId, {
				scene: 'tasksScene',
				step: 'view',
			});
			await ctx.answerCbQuery();
			const tasksHandler = new TasksHandler();
			return tasksHandler.actions.view(ctx);
		},
		openSchedule: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			await SessionData.update(tgId, {
				scene: 'scheduleScene',
				step: 'schedule',
			});
			await ctx.answerCbQuery();
			const scheduleHandler = new ScheduleHandler();
			return scheduleHandler.actions.view(ctx);
		},
		openEvents: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			await SessionData.update(tgId, {
				scene: 'eventsScene',
				step: 'events',
			});
			await ctx.answerCbQuery();
			const eventsHandler = new EventsHandler();
			return eventsHandler.actions.view(ctx);
		},
	};
	override async handle(ctx: BotContext) {
		const tgId = ctx.from!.id;
		const session = await SessionData.get(tgId);
		if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
			const data = ctx.callbackQuery.data;
			await ctx.answerCbQuery();
			if (data in this.actions) {
				await this.actions[data as keyof typeof this.actions](ctx);
				return;
			}
		}
		if (session?.scene === 'menuScene') {
			await showMenu(ctx);
		}
		return;
	}
}