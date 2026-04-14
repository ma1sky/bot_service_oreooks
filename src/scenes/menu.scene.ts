import { Markup, Scenes, Telegraf } from 'telegraf'
import type { SessionContext } from '../context.js';

export const menuScene = new Scenes.BaseScene<SessionContext>('menu');

menuScene.enter(ctx => {
    ctx.reply('Меню:', 
        Markup.inlineKeyboard([
            Markup.button.callback('➕ Создать задачу','createTask'),
            Markup.button.callback('📚 Расписание на сегодня', 'todaySchedule')
        ])
    )
})

menuScene.action('createTask', async ctx => {
    await ctx.answerCbQuery();
    await ctx.reply('');
})

menuScene.action('todaySchedule', async ctx => {
    await ctx.answerCbQuery();
    await ctx.reply('');
})

