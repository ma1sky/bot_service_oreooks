import { Scenes } from 'telegraf';
function getMessageText(ctx) {
    if (!ctx.message || !('text' in ctx.message)) {
        ctx.reply('Отправь текст');
        throw Error('Отправь текст');
    }
    return ctx.message.text;
}
export const createTaskScene = new Scenes.WizardScene('createTaskScene', async (ctx) => {
    await ctx.reply('📃 Введи название задачи: ');
    return ctx.wizard.next();
}, async (ctx) => {
    ctx.wizard.state.title = getMessageText(ctx);
    ctx.reply('📃 Введи описание задачи: ');
    return ctx.wizard.next();
}, async (ctx) => {
    ctx.wizard.state.description = getMessageText(ctx);
    ctx.reply('📆 Введите дату дедлайна в формате дд.мм.гггг: ');
    return ctx.wizard.next();
}, async (ctx) => {
    let dateString = getMessageText(ctx);
    if (!dateString || isNaN(Date.parse(dateString))) {
        return ctx.reply('❌ Дата неправильного формата');
    }
    ctx.wizard.state.deadline = new Date(dateString);
    return ctx.wizard.next();
}, async (ctx) => {
    ctx.reply(`
✅ Задача успешно создана!

✏️ Название: ${ctx.wizard.state.title}
📃 Описание: ${ctx.wizard.state.description}
📆 Дедлайн: ${ctx.wizard.state.deadline}
        `);
    return ctx.scene.enter('menuScene');
});
//# sourceMappingURL=createTask.scene.js.map