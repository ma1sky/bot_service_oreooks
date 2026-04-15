import { Scenes } from 'telegraf';
import { sendTaskToApi } from '../api/taskCRUD.api.js';
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
    ctx.reply('📆 Введи дату дедлайна в формате дд.мм.гггг: \n Если дедлайна нет, то просто введи "-"');
    return ctx.wizard.next();
}, async (ctx) => {
    let dateString = getMessageText(ctx);
    if (!dateString || isNaN(Date.parse(dateString))) {
        return ctx.reply('❌ Дата неправильного формата');
    }
    let date = new Date(dateString);
    ctx.wizard.state.deadline = date;
    try {
        await sendTaskToApi(ctx.wizard.state.title, ctx.wizard.state.description, ctx.wizard.state.deadline);
        ctx.reply(`
✅ Задача успешно создана!

✏️ Название: ${ctx.wizard.state.title}
📃 Описание: ${ctx.wizard.state.description}
📆 Дедлайн: ${date.getDay()}.${date.getMonth()}.${date.getFullYear()}
            `);
    }
    catch {
        ctx.reply('❌ Не удалось создать задачу');
    }
    return ctx.scene.enter('menuScene');
});
//# sourceMappingURL=createTask.scene.js.map