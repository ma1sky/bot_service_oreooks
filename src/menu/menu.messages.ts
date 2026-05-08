import { BotContext } from "../config/types";
import { Markup } from "telegraf";

export async function showMenu(ctx: BotContext) { 
    await ctx.reply(
        "📋 Меню:",
        Markup.inlineKeyboard([
            [Markup.button.callback("📆 Показать расписание", "openSchedule")],
            [Markup.button.callback("📚 Показать задачи", "openTasks")],
            [Markup.button.callback("📍 Контрольные мероприятия", "openEvents")]
        ])
    )
    return;
}