import { BaseHandler } from '../base/base.handler';
import type { BotContext } from '../config/types';
import { SessionData } from '../session/session';
import scheduleService from './schedule.service';
import { formatSchedule } from './schedule.messages';
import { Markup } from 'telegraf';
import { ScheduleAction } from './schedule.types';

export class ScheduleHandler extends BaseHandler {
	public actions: Record<ScheduleAction, (ctx: BotContext) => Promise<void>> = {
		view: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;

			await SessionData.update(tgId, {
				scene: 'scheduleScene',
				step: 'schedule',
			});

			return this.actions.openToday(ctx);
		},

		openToday: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const today = new Date();

			try {
				const result = await scheduleService.getSchedule(tgId, today);

				if (!result.success || !result.schedule) {
					ctx.reply(`📭 Расписание на сегодня не найдено.\n${result.reason || ''}`, {
						parse_mode: 'HTML',
					});
					return;
				}

				const messageText = await formatSchedule(result.schedule);

				const keyboard = Markup.inlineKeyboard([
					[
						Markup.button.callback('◀️', 'openYesterday'),
						Markup.button.callback('📋 Меню', 'openMenu'),
						Markup.button.callback('▶️', 'openTomorrow'),
					],
				]);

				try {
					await ctx.editMessageText(messageText, {
						parse_mode: 'HTML',
						...keyboard,
					});
				} catch {
					await ctx.reply(messageText, {
						parse_mode: 'HTML',
						...keyboard,
					});
				}
			} catch (error) {
				console.error('Error fetching today schedule:', error);
				await ctx.reply('❌ Не удалось загрузить расписание на сегодня. Попробуйте позже.');
			}
		},

		openTomorrow: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);

			try {
				const result = await scheduleService.getSchedule(tgId, tomorrow);

				if (!result.success || !result.schedule) {
					ctx.reply(`📭 Расписание на завтра не найдено.\n${result.reason || ''}`, {
						parse_mode: 'HTML',
					});
					return;
				}

				const messageText = await formatSchedule(result.schedule);

				const keyboard = Markup.inlineKeyboard([
					[
						Markup.button.callback('◀️', 'openToday'),
						Markup.button.callback('📋 Меню', 'openMenu'),
						Markup.button.callback('▶️', 'nextDay'),
					],
				]);

				try {
					await ctx.editMessageText(messageText, {
						parse_mode: 'HTML',
						...keyboard,
					});
				} catch {
					await ctx.reply(messageText, {
						parse_mode: 'HTML',
						...keyboard,
					});
				}
			} catch (error) {
				console.error('Error fetching tomorrow schedule:', error);
				await ctx.reply('❌ Не удалось загрузить расписание на завтра. Попробуйте позже.');
			}
		},

		openYesterday: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);

			try {
				const result = await scheduleService.getSchedule(tgId, yesterday);

				if (!result.success || !result.schedule) {
					ctx.reply(`📭 Расписание на вчера не найдено.\n${result.reason || ''}`, {
						parse_mode: 'HTML',
					});
					return;
				}

				const messageText = await formatSchedule(result.schedule);

				const keyboard = Markup.inlineKeyboard([
					[
						Markup.button.callback('◀️', 'prevDay'),
						Markup.button.callback('📋 Меню', 'openMenu'),
						Markup.button.callback('Сегодня ▶️', 'openToday'),
					],
				]);

				try {
					await ctx.editMessageText(messageText, {
						parse_mode: 'HTML',
						...keyboard,
					});
				} catch {
					await ctx.reply(messageText, {
						parse_mode: 'HTML',
						...keyboard,
					});
				}
			} catch (error) {
				console.error('Error fetching yesterday schedule:', error);
				await ctx.reply('❌ Не удалось загрузить расписание на вчера. Попробуйте позже.');
			}
		},

		openMenu: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;

			await SessionData.update(tgId, {
				scene: 'menuScene',
				step: 'enter',
			});

			const { showMenu } = await import('../menu/menu.messages');
			await showMenu(ctx);
		},
	};

	override async handle(ctx: BotContext) {
		const tgId = ctx.from!.id;

		if ('callback_query' in ctx.update && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
			const data = ctx.callbackQuery.data;

			console.log(`[ScheduleHandler] Callback query: ${data}, tgId: ${tgId}`);

			await ctx.answerCbQuery().catch(() => {});

			if (data in this.actions) {
				return this.actions[data as ScheduleAction](ctx);
			}

			console.log(`[ScheduleHandler] Unknown callback data: ${data}`);
			return;
		}

		return this.actions.openToday(ctx);
	}
}
