import { Markup } from "telegraf";
import type { BotContext } from "../config/types";
import { SessionData } from "../session/session";
import router from '../router/router'

export async function menuHandler(ctx: BotContext) {
    const tgId = ctx.from!.id;

    if ("callback_query" in ctx.update) {
        if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
	        return;
        }

        const data = ctx.callbackQuery.data;
        await ctx.answerCbQuery();

        switch (data) {
            case "createTask": {
                await SessionData.update(tgId, {
                    scene: "taskCreateScene",
                    step: "taskTitle"
                });
                break;
            }
            case "openSchedule": {
                await SessionData.update(tgId, {
                    scene: "scheduleScene",
                    step: "schedule"
                });
                break;
            }

            case "openTasks":
                await SessionData.update(tgId, {
                    scene: "tasksScene",
                    step: "tasks"
                });

            case "openEvents":
                await SessionData.update(tgId, {
                    scene: "eventsScene",
                    step: ""
                });
            }
        return router.route(ctx);
    }

    return ctx.reply(
        "📋 Меню:",
        Markup.inlineKeyboard([
            [Markup.button.callback("➕ Создать задачу", "createTask")],
            [Markup.button.callback("📆 Показать расписание", "openSchedule")],
            [Markup.button.callback("📚 Показать задачи", "openTasks")],
            [Markup.button.callback("📍 Контрольные мероприятия", "openEvents")]
        ])
    );
}