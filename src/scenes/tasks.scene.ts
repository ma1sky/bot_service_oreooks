import { BaseScene } from "telegraf/scenes";
import type { BotContext } from "../context.js";
import { Markup, Scenes } from "telegraf";

export const taskScene = new Scenes.BaseScene<BotContext>('taskScene');

taskScene.enter(ctx => {
    ctx.reply('dwq'),
    Markup.inlineKeyboard([
        [
            Markup.button.callback('◀️', 'openYesterday'),
            Markup.button.callback('📋 Меню', 'openMenu'),
            Markup.button.callback('▶️', 'openTomorrow'),
        ],
        [
            Markup.button.callback('✅ Завершить','markComplete'),
            Markup.button.callback('✏️ Редактировать','editTask'),
            Markup.button.callback('🗑️ Удалить','deleteTask')
        ]
    ])
})