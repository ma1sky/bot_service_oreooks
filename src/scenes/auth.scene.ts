import { Scenes } from "telegraf";
import type { BotContext } from "../config/types.js";
import { authUser } from "../services/auth.service.js";
import { formatGreeting } from "../messages/auth.message.js";

export const authScene = new Scenes.BaseScene<BotContext>("auth");

authScene.enter(async (ctx) => {
	ctx.scene.session.auth = {
        login: "",
        password: "",
        step: "login",
        isAuth: false
    };

	ctx.reply(formatGreeting(ctx.from?.first_name as string));
});

authScene.on("text", async (ctx) => {
    const auth = ctx.scene.session.auth;

    if (!auth.login) {
        auth.login = ctx.message.text;
        auth.step = "password";

        return ctx.reply("Введите пароль:");
    }

    if (!auth.password) {
        auth.password = ctx.message.text;

        try {
            const result = await authUser(
                auth.login,
                auth.password,
                ctx.from?.id as number
            );

            auth.isAuth = result.success;

            if (!result.success) {
                return ctx.reply("Ошибка авторизации" + result.reason);
            }

            await ctx.reply("Авторизация успешна!");
            return ctx.scene.enter("menuScene");

        } catch (err) {
            return ctx.reply("Ошибка сервера. Попробуйте позже.");
        }
    }
});