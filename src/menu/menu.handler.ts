import { Markup } from "telegraf";
import type { BotContext, MenuStep } from "../config/types";
import { SessionData } from "../session/session";
import router from '../router/router'
import { BaseHandler } from "../base/base.handler";

export class MenuHandler extends BaseHandler {
    private actions = {
        createTask: async (tgId: number) => {
            await SessionData.update(tgId, {
                scene: "taskCreateScene",
                step: "title"
            });
        },
        openSchedule: async (tgId: number) => {
            await SessionData.update(tgId, {
                scene: "scheduleScene",
                step: "schedule"
            });
        },
        openTasks: async (tgId: number) => {
            await SessionData.update(tgId, {
                scene: "tasksScene",
                step: "tasks"
            });
        },
        openEvents: async (tgId: number) => {
            await SessionData.update(tgId, {
                scene: "eventsScene",
                step: ""
            });
        }
    };

    override async handle(ctx: BotContext) {
        const tgId = ctx.from!.id;

        if (ctx.session.step === "menu" as MenuStep) {
            await ctx.reply(
                "📋 Меню:",
                Markup.inlineKeyboard([
                    [Markup.button.callback("➕ Создать задачу", "createTask")],
                    [Markup.button.callback("📆 Показать расписание", "openSchedule")],
                    [Markup.button.callback("📚 Показать задачи", "openTasks")],
                    [Markup.button.callback("📍 Контрольные мероприятия", "openEvents")]
                ])
            );

            ctx.session.step = "idle";
            return;
        }

        if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
            const data = ctx.callbackQuery.data;

            await ctx.answerCbQuery();

            if (data in this.actions) {
                await this.actions[data as keyof typeof this.actions](tgId);

                return router.route(ctx);
            }
        }
    }
}