import type { BotContext, MenuStep } from "../config/types";
import { SessionData } from "../session/session";
import router from '../router/router'
import { BaseHandler } from "../base/base.handler";
import { showMenu } from "./menu.messages";
import { TasksHandler } from "../tasks/tasks.handler";

export class MenuHandler extends BaseHandler {
    private actions = {
        openTasks: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;

            await SessionData.update(tgId, {
                scene: "tasksScene",
                step: "view"
            });

            await ctx.answerCbQuery();

            // 🔥 ВАЖНО: вручную запускаем router
            return router.route(ctx);
        },

        openSchedule: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;

            await SessionData.update(tgId, {
                scene: "scheduleScene",
                step: "schedule"
            });

            return;
        },

        openEvents: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;

            await SessionData.update(tgId, {
                scene: "eventsScene",
                step: "events"
            });

            return;
        }
    };

    override async handle(ctx: BotContext) {
        const tgId = ctx.from!.id;
        const session = await SessionData.get(tgId);

        if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
            const data = ctx.callbackQuery.data;

            await ctx.answerCbQuery();

            if (data in this.actions) {
                await this.actions[data as keyof typeof this.actions](ctx);

                return;
            }
        }

        if (session?.scene === "menuScene" && !ctx.callbackQuery) {
            await showMenu(ctx);
        }
        return;
    }
}