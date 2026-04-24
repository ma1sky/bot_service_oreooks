import { Scenes } from 'telegraf';
import tasksService from '../services/tasks.service.js';
import { getMessageText, getSession } from './utils/utils.js';
export const editTaskScene = new Scenes.WizardScene('editTaskScene', async (ctx) => {
    await ctx.reply('✏️ Введи заголовок задачи:');
    return ctx.wizard.next();
}, async (ctx) => {
    const state = ctx.wizard.state;
    state.title = getMessageText(ctx);
    await ctx.reply('📃 Введи описание задачи:');
    return ctx.wizard.next();
}, async (ctx) => {
    const state = ctx.wizard.state;
    state.description = getMessageText(ctx);
    await ctx.reply('📆 Введи дату дедлайна (дд.мм.гггг):');
    return ctx.wizard.next();
}, async (ctx) => {
    const state = ctx.wizard.state;
    const dateString = getMessageText(ctx);
    const match = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) {
        await ctx.reply('❌ Неверный формат даты. Используй дд.мм.гггг');
        return;
    }
    const [, dd, mm, yyyy] = match;
    const deadline = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (isNaN(deadline.getTime())) {
        await ctx.reply('❌ Некорректная дата');
        return;
    }
    state.deadline = deadline;
    if (!state.taskId) {
        await ctx.reply('❌ Задача не найдена');
        return ctx.scene.enter('tasksScene');
    }
    try {
        const task = {
            id: state.taskId,
            title: state.title,
            description: state.description,
            deadline: state.deadline
        };
        const result = await tasksService.updateTask(task, ctx.from.id);
        if (!result.success) {
            await ctx.reply('❌ Не удалось отредактировать задачу: ' + result.reason);
            return ctx.scene.enter('menuScene');
        }
        await ctx.reply('✅ Задача успешно отредактирована!');
    }
    catch (err) {
        console.error(err);
        await ctx.reply('❌ Не удалось отредактировать задачу');
    }
    return ctx.scene.enter('menuScene');
});
//# sourceMappingURL=editTaskScene.js.map