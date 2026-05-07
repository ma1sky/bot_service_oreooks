import type { BotContext, MenuStep } from "../config/types";
import authService from "./auth.service";
import { AuthSession, SessionData } from "../session/session";
import router from "../router/router";
import { BaseHandler } from "../base/base.handler";
import { AuthStep } from "../config/types";
import authValidator from "./auth.validator";
import { getMessageText } from "../utils/utils";

export class AuthHandler extends BaseHandler {
	private actions = {
		login: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const text = getMessageText(ctx);

			const result = authValidator.validateLogin(text);

			if (!result.success) {
				return ctx.reply(
					result.error.issues[0]?.message ?? "Неверные данные"
				);
			}

			await AuthSession.update(tgId, {
				login: result.data
			});

			await SessionData.update(tgId, {
				step: "password"
			});

			return ctx.reply("🔑 Теперь введите пароль:");
		},

		password: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const password = getMessageText(ctx);

			const parsedPassword =
				authValidator.validatePassword(password);

			if (!parsedPassword.success) {
				return ctx.reply(
					parsedPassword.error.issues[0]?.message ?? "Неверные данные"
				);
			}

			const auth = await AuthSession.get(tgId);

			if (!auth?.login) {
				await SessionData.update(tgId, {
					scene: "authScene",
					step: "login"
				});

				return ctx.reply("Введите логин заново");
			}

			try {
				await authService.authUser(
					auth.login,
					parsedPassword.data,
					tgId
				);

				await AuthSession.clear(tgId);

				await SessionData.update(tgId, {
					scene: "menuScene",
					step: "menu" as MenuStep
				});

				await ctx.reply("✅ Авторизация успешна!");

				return router.route(ctx);
			} catch (e) {
				await AuthSession.clear(tgId);

				await SessionData.update(tgId, {
					scene: "authScene",
					step: "login"
				});

				return ctx.reply(
					e instanceof Error
						? e.message
						: "Ошибка авторизации"
				);
			}
		}
	};

	private isAuthStep(step: string): step is AuthStep {
		return step === "login" || step === "password";
	}

	override async handle(ctx: BotContext): Promise<void> {
        const tgId = ctx.from!.id;
        const session = await SessionData.get(tgId);
        const step = session?.step;

        if (step && this.isAuthStep(step)) {
            await this.actions[step](ctx);
        }
    }
}