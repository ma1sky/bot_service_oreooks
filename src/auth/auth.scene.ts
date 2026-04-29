import { Scenes } from "telegraf";
import type { BotContext } from "../config/types";
import { formatGreeting } from "./auth.message";
import authService from "./auth.service";

export const authScene = new Scenes.BaseScene<BotContext>("auth");

authScene.enter(async (ctx) => {
	ctx.scene.session.authScene = {
        login: "",
        password: "",
        isAuth: false
    };

	ctx.reply(formatGreeting(ctx.from?.first_name as string));
});

authScene.on("text", async (ctx) => {
    const auth = ctx.scene.session.authScene;

    if (!auth.login) {
        auth.login = ctx.message.text;

        return ctx.reply("Введите пароль:");
    }

    if (!auth.password) {
        auth.password = ctx.message.text;

        try {
			console.log({
				login: auth.login,
				password: auth.password,
				tg_id: ctx.from.id
			});
            const result = await authService.authUser(
                auth.login,
                auth.password,
                ctx.from?.id as number
            );

            auth.isAuth = result.success;

            if (!result.success) {
                return ctx.reply("Ошибка авторизации: " + result.reason);
            }

            await ctx.reply("Авторизация успешна!");
            return ctx.scene.enter("menuScene");

        } catch (err) {
            return ctx.reply("Ошибка сервера. Попробуйте позже.");
        }
    }
});