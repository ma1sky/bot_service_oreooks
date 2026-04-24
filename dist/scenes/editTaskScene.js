import { Scenes } from 'telegraf';
import tasksService from '../services/tasks.service.js';
function getMessageText(ctx) {
    if (!ctx.message || !('text' in ctx.message)) {
        ctx.reply('Отправь текст');
        throw Error('Отправь текст');
    }
    return ctx.message.text;
}
export const editTaskScene = new Scenes.WizardScene('editTaskScene', async (ctx) => {
    await ctx.reply('✏️ Введи залоговок задачи: ');
    return ctx.wizard.next();
}, async (ctx) => {
    ctx.wizard.state.title = getMessageText(ctx);
    ctx.reply('📃 Введи описание задачи: ');
    return ctx.wizard.next();
}, async (ctx) => {
    ctx.wizard.state.description = getMessageText(ctx);
    ctx.reply('📆 Введи дату дедлайна в формате дд.мм.гггг:');
    return ctx.wizard.next();
}, async (ctx) => {
    let dateString = getMessageText(ctx);
    if (!dateString || isNaN(Date.parse(dateString))) {
        return ctx.reply('❌ Дата неправильного формата');
    }
    ctx.wizard.state.deadline = new Date(dateString);
    try {
        let task = {
            title: ctx.wizard.state.title,
            description: ctx.wizard.state.description,
            deadline: ctx.wizard.state.deadline,
            id: ctx.scene.session.tasksScene.currentIndex
        };
        let result = await tasksService.updateTask(task, ctx.from?.id);
        if (!result.success) {
            ctx.reply('❌ Не удалось отредактировать задачу:' + result.reason);
        }
        else {
            await ctx.reply(`✅ Задача успешно отредактирована!`);
        }
    }
    catch {
        await ctx.reply('❌ Не удалось отредактировать задачу');
    }
    return ctx.scene.enter('menuScene');
});
//# sourceMappingURL=editTaskScene.js.map