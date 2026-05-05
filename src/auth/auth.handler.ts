import type { BotContext, MenuStep } from "../config/types";
import authService from "./auth.service";
import { AuthSession, SessionData } from "../session/session";
import { SessionDraft } from "../config/types";
import router from '../router/router';
import { BaseHandler } from "../base/base.handler";
import { AuthStep } from "../config/types";

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

    private isAuthStep(step: string): step is AuthStep {
        return step === "login" || step === "password";
    }

    override async handle(ctx: BotContext) {
        const tgId = ctx.from!.id
        const session = await SessionData.get(tgId)
        const step = session?.step

        if(step && this.isAuthStep(step)) {
            await this.actions[step](ctx);
        }

        return router.route(ctx);
    }
}