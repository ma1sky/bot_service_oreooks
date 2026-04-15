import { Markup, Scenes } from "telegraf";
import type { BotContext } from "../context.js";
import { getTodaySchedule } from "../api/schedule.api.js";


export const scheduleScene = new Scenes.BaseScene<BotContext>('scheduleScene');

scheduleScene.enter(async ctx => {
    ctx.reply(await getTodaySchedule(), 
        Markup.inlineKeyboard([
            Markup.button.callback('▶️', 'openTomorrow'),
            Markup.button.callback('◀️', 'openYesterday'),
            Markup.button.callback('📋 Меню','openMenu')
        ])
    )
})

