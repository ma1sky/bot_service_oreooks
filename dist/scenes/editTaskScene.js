import { Scenes } from 'telegraf';
import tasksService from '../services/tasks.service.js';
import { getMessageText } from './utils/utils.js';
export const editTaskScene = new Scenes.WizardScene('editTaskScene', async (ctx) => {
    console.log('================ ENTER EDIT SCENE ================');
    console.log('FROM:', ctx.from);
    console.log('SESSION:', JSON.stringify(ctx.session, null, 2));
    console.log('WIZARD STATE INIT:', ctx.wizard.state);
    await ctx.reply('✏️ Введи заголовок задачи:');
    return ctx.wizard.next();
}, async (ctx) => {
    const state = ctx.wizard.state;
    const text = getMessageText(ctx);
    console.log('================ STEP 1 TITLE ================');
    console.log('INPUT:', text);
    state.title = text;
    console.log('STATE:', state);
    await ctx.reply('📃 Введи описание задачи:');
    return ctx.wizard.next();
}, async (ctx) => {
    const state = ctx.wizard.state;
    const text = getMessageText(ctx);
    console.log('================ STEP 2 DESCRIPTION ================');
    console.log('INPUT:', text);
    state.description = text;
    console.log('STATE:', state);
    await ctx.reply('📆 Введи дату дедлайна (дд.мм.гггг):');
    return ctx.wizard.next();
}, async (ctx) => {
    const state = ctx.wizard.state;
    console.log('================ STEP 3 DATE ================');
    console.log('STATE BEFORE DATE:', state);
    const dateString = getMessageText(ctx);
    console.log('DATE INPUT:', dateString);
    const match = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) {
        console.log('❌ INVALID DATE FORMAT');
        await ctx.reply('❌ Неверный формат даты');
        return;
    }
    const [, dd, mm, yyyy] = match;
    const deadline = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (isNaN(deadline.getTime())) {
        console.log('❌ INVALID DATE VALUE');
        await ctx.reply('❌ Некорректная дата');
        return;
    }
    state.deadline = deadline;
    console.log('UPDATED STATE:', state);
    if (!state.taskId) {
        console.log('❌ TASK ID MISSING');
        console.log('FINAL STATE:', state);
        await ctx.reply('❌ Задача не найдена (taskId отсутствует)');
        return ctx.scene.enter('tasksScene');
    }
    console.log('TASK ID:', state.taskId);
    const task = {
        id: state.taskId,
        title: state.title,
        description: state.description,
        deadline: state.deadline
    };
    console.log('TASK TO UPDATE:', task);
    try {
        const result = await tasksService.updateTask(task, ctx.from.id);
        console.log('SERVICE RESULT:', result);
        if (!result.success) {
            console.log('❌ UPDATE FAILED');
            await ctx.reply('❌ Не удалось отредактировать задачу: ' + result.reason);
            return ctx.scene.enter('menuScene');
        }
        console.log('✅ UPDATE SUCCESS');
        await ctx.reply('✅ Задача успешно отредактирована!');
    }
    catch (err) {
        console.error('❌ EXCEPTION:', err);
        await ctx.reply('❌ Не удалось отредактировать задачу');
    }
    return ctx.scene.enter('menuScene');
});
//# sourceMappingURL=editTaskScene.js.map