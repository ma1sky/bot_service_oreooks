import { Scenes } from "telegraf";
import type { BotContext } from "../config/types";
import { formatGreeting } from "./auth.message";
import authService from "./auth.service";
import { SessionDraft } from "../session/session.types";
import { AuthSession, SessionData } from "../session/session";

export const authScene = new Scenes.BaseScene<BotContext>("authScene");

authScene.enter(async (ctx) => {
    const tgId = ctx.from!.id;

    await SessionData.set(tgId, {
        scene: "authScene",
        step: "login"
    });

    await ctx.reply(formatGreeting(ctx.from!.first_name));
});

authScene.on("text", async (ctx) => {
    const tgId: number = ctx.from.id;
    const session: SessionDraft = await SessionData.get(tgId);

    switch (session.step) {
        case "login": {
            await AuthSession.update(tgId, {
                login: ctx.message.text
            });

            await SessionData.set(tgId, {
                scene: "authScene",
                step: "password"
            });

            return ctx.reply("Теперь введите пароль:");
        }

        case "password": {
            await AuthSession.update(tgId, {
                password: ctx.message.text
            });

            const auth = await AuthSession.get(tgId);
            const res = await authService.authUser(
                auth.login,
                auth.password,
                tgId
            );

            if (!res.success) {
                await SessionData.set(tgId, {
                    scene: "authScene",
                    step: "login"
                });

                return ctx.reply("Ошибка авторизации: " + res.reason);
            }

            await ctx.reply("Авторизация успешна!");
            await AuthSession.clear(tgId);
            await SessionData.set(tgId, {
                scene: "menuScene",
                step: "menu"
            });

            return ctx.scene.enter("menuScene");
        }
    }
});