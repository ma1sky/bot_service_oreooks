import { Markup, Scenes } from 'telegraf';
export const menuScene = new Scenes.BaseScene('menuScene');
menuScene.enter(async (ctx) => {
    ctx.reply('📋 Меню:', Markup.inlineKeyboard([
        Markup.button.callback('➕ Создать задачу', 'createTask'),
        Markup.button.callback('📚 Показать расписание', 'openSchedule')
    ]));
});
menuScene.action('createTask', async (ctx) => {
    ctx.answerCbQuery();
    ctx.scene.enter('createTaskScene');
});
menuScene.action('openSchedule', async (ctx) => {
    ctx.answerCbQuery();
    ctx.scene.enter('scheduleScene');
});
//# sourceMappingURL=menu.scene.js.map