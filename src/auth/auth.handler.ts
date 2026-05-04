import type { BotContext, MenuStep } from "../config/types";
import authService from "./auth.service";
import { AuthSession } from "../session/session";
import { SessionData } from "../session/session";
import { SessionDraft } from "../config/types";
import router from '../router/router';
import { BaseHandler } from "../base/base.handler";

export class AuthHandler extends BaseHandler {
    private actions = {
        login: async (ctx: BotContext) => {
            const tgId: number = ctx.from!.id
            if (!ctx.message || !("text" in ctx.message)) {
                return ctx.reply("Отправьте текст");
            }

            const text = ctx.message.text;

            await AuthSession.update(tgId, {
                login: text
            });

            await SessionData.set(tgId, {
                scene: "authScene",
                step: "password"
            });

            return ctx.reply("Теперь введите пароль:");
        }, 
        
        password: async (ctx: BotContext) => {
            const tgId: number = ctx.from!.id
            if (!ctx.message || !("text" in ctx.message)) {
                return ctx.reply("Отправьте текст");
            }

            const text = ctx.message.text;

            await AuthSession.update(tgId, {
                    password: text
                });

                const auth = await AuthSession.get(tgId);
                
                if (!auth?.login || !auth?.password) {
                    await AuthSession.clear(ctx.from!.id);
                    await SessionData.set(ctx.from!.id, {
                        scene: "authScene",
                        step: "login"
                    } as SessionDraft)
                    return ctx.reply('Введите данные заново.')
                }
                
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
                    step: "menu" as MenuStep
                });

                return router.route(ctx)
        }
    }

    override async handle(ctx: BotContext) {
        if (!ctx.message || !("text" in ctx.message)) {
                return ctx.reply("Отправьте текст");
        }
        const text = ctx.message.text;
    }
}