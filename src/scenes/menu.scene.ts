import { Markup, Scenes } from 'telegraf'
import type { BotContext } from '../context.js';

export const menuScene = new Scenes.BaseScene<BotContext>('menuScene');

menuScene.enter(async ctx => {
    await ctx.reply('📋 Меню:', 
        Markup.inlineKeyboard([
            [Markup.button.callback('➕ Создать задачу','createTask')],
            [Markup.button.callback('📆 Показать расписание', 'openSchedule')],
            [Markup.button.callback('📚 Показать задачи','openTasks')],
        ])
    )
})

menuScene.action('createTask', async ctx => {
    ctx.answerCbQuery();
    ctx.scene.enter('createTaskScene');
})

menuScene.action('openSchedule', async ctx => {
    ctx.answerCbQuery();
    ctx.scene.enter('scheduleScene');
})

menuScene.action('openTasks', async ctx => {
    ctx.answerCbQuery();
    ctx.scene.enter('tasksScene')
})