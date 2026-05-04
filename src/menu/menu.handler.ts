import { Markup } from "telegraf";
import type { BotContext } from "../config/types";
import { SessionData } from "../session/session";

export async function menuHandler(ctx: BotContext) {
    const tgId = ctx.from!.id;

    if ("callback_query" in ctx.update) {
        const data = ctx.callbackQuery.data;

        await ctx.answerCbQuery();

        switch (data) {
            case "createTask":
                await SessionData.update(tgId, {
                    scene: "createTaskScene",
                    step: "start"
                });
                return ctx.reply("Переход к созданию задачи");

            case "openSchedule":
                await SessionData.update(tgId, {
                    scene: "scheduleScene",
                    step: "start"
                });
                return ctx.reply("Открываю расписание");

            case "openTasks":
                await SessionData.update(tgId, {
                    scene: "tasksScene",
                    step: "start"
                });
                return ctx.reply("Открываю задачи");

            case "openEvents":
                await SessionData.update(tgId, {
                    scene: "eventsScene",
                    step: "start"
                });
                return ctx.reply("Открываю мероприятия");
        }

        return;
    }

    // 👉 если это обычное сообщение — показать меню
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