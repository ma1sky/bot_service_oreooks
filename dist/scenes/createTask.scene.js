import { Scenes } from 'telegraf';
import { sendTaskToApi } from '../api/tasks.api.js';
function getMessageText(ctx) {
    if (!ctx.message || !('text' in ctx.message)) {
        ctx.reply('Отправь текст');
        throw Error('Отправь текст');
    }
    return ctx.message.text;
}
export const createTaskScene = new Scenes.WizardScene('createTaskScene', async (ctx) => {
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
        await sendTaskToApi(ctx.wizard.state.title, ctx.wizard.state.description, ctx.wizard.state.deadline);
        await ctx.reply(`✅ Задача успешно создана!`);
        await ctx.reply(`
✏️ Название: ${ctx.wizard.state.title}\n
📃 Описание: ${ctx.wizard.state.description}\n
📆 Дедлайн: ${Intl.DateTimeFormat('ru-RU').format(ctx.wizard.state.deadline)}
            `);
    }
    catch {
        ctx.reply('❌ Не удалось создать задачу');
    }
    return ctx.scene.enter('menuScene');
});
//# sourceMappingURL=createTask.scene.js.map