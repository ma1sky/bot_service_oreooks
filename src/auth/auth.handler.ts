import type { BotContext, MenuStep } from '../config/types';
import authService from './auth.service';
import { AuthSession, SessionData } from '../session/session';
import { BaseHandler } from '../base/base.handler';
import { AuthStep } from '../config/types';
import authValidator from './auth.validator';
import { getMessageText } from '../utils/utils';
import { Markup } from 'telegraf';

export class AuthHandler extends BaseHandler {
	private actions = {
		login: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const text = getMessageText(ctx);

			const result = authValidator.validateLogin(text);

			if (!result.success) {
				await ctx.reply(result.error.issues[0]?.message ?? 'Неверные данные');
				return;
			}

			await AuthSession.update(tgId, {
				login: result.data,
			});

			await SessionData.update(tgId, {
				step: 'password',
			});

			await ctx.reply('🔑 Теперь введите пароль:');
		},

		password: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const password = getMessageText(ctx);

			const parsed = authValidator.validatePassword(password);

			if (!parsed.success) {
				await ctx.reply(parsed.error.issues[0]?.message ?? 'Неверные данные');
				return;
			}

			const auth = await AuthSession.get(tgId);

			if (!auth?.login) {
				await SessionData.update(tgId, {
					scene: 'authScene',
					step: 'login',
				});

				await ctx.reply('Введите логин заново');
				return;
			}

			try {
				await authService.authUser(auth.login, parsed.data, tgId);

				await AuthSession.clear(tgId);

				await SessionData.update(tgId, {
					scene: 'menuScene',
					step: 'menu' as MenuStep,
				});

				await ctx.reply('✅ Авторизация успешна!');
				await ctx.reply(
					'📋 Меню:',
					Markup.inlineKeyboard([
						[Markup.button.callback('📆 Показать расписание', 'openSchedule')],
						[Markup.button.callback('📚 Показать задачи', 'openTasks')],
						[Markup.button.callback('📍 Контрольные мероприятия', 'openEvents')],
					]),
				);
				return;
			} catch (e) {
				await AuthSession.clear(tgId);

				await SessionData.update(tgId, {
					scene: 'authScene',
					step: 'login',
				});

				await ctx.reply(e instanceof Error ? e.message : 'Ошибка авторизации');

				return;
			}
		},
	};

	private isAuthStep(step: string): step is AuthStep {
		return step === 'login' || step === 'password';
	}

	override async handle(ctx: BotContext): Promise<void> {
		if (ctx.callbackQuery) {
			if ('data' in ctx.callbackQuery) {
				await ctx.answerCbQuery().catch(() => {});
			}
			return;
		}

		if (!ctx.message || !('text' in ctx.message)) {
			return;
		}

		const session = await SessionData.get(ctx.from!.id);
		const step = session?.step;

		if (step && this.isAuthStep(step)) {
			try {
				await this.actions[step](ctx);
			} catch (error) {
				if (error instanceof Error && error.message === 'Отправь текст') {
					return;
				}
				throw error;
			}
		}
	}
}
