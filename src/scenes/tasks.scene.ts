import type { BotContext } from "../config/types.js";
import { Markup, Scenes } from "telegraf";
import { formatTask } from "../messages/tasks.messages.js";
import type { Task } from "../config/types.js";
import tasksService from "../services/tasks.service.js";

export const taskScene = new Scenes.BaseScene<BotContext>('taskScene');

taskScene.enter(async ctx => {
    let res = await tasksService.getTasks(ctx.from?.id as number);

    if (!res.success) {
        ctx.reply('Ошибка! Не удалось получить задачи из базы данных!' + res.reason)
        ctx.scene.enter('menuScene')
    }

    ctx.scene.session.taskScene.tasks = res.data;

    let { id, title, description, deadline } = ctx.scene.session.taskScene.tasks[0] as Task;
    
    ctx.reply(formatTask(title as string, description as string, deadline as Date)),
        Markup.inlineKeyboard([
            [
                Markup.button.callback('◀️', 'openNext'),
                Markup.button.callback('📋 Меню', 'openMenu'),
                Markup.button.callback('▶️', 'openPrevious'),
            ],
            [
                Markup.button.callback('✅ Завершить','markComplete'),
                Markup.button.callback('✏️ Редактировать','editTask'),
                Markup.button.callback('🗑️ Удалить','deleteTask')
            ]
        ])
})

taskScene.action('deleteTask', ctx => {

})

taskScene.action('markComplete', ctx => {

})

taskScene.action('editTask', ctx => {

})