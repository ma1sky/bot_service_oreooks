import { Scenes } from 'telegraf';
import tasksService from '../services/tasks.service.js';
import { getMessageText } from './utils/utils.js';
export const createTaskScene = new Scenes.WizardScene('createTaskScene', async (ctx) => {
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
    try {
        const result = await tasksService.createTask(state.title, state.description, state.deadline, ctx.from.id);
        if (!result.success) {
            await ctx.reply('❌ Не удалось создать задачу: ' + result.reason);
            return ctx.scene.enter('menuScene');
        }
        await ctx.reply('✅ Задача успешно создана!');
    }
    catch (err) {
        console.error(err);
        await ctx.reply('❌ Ошибка при создании задачи');
    }
    return ctx.scene.enter('menuScene');
});
//# sourceMappingURL=createTask.scene.js.map