import { Markup, Scenes } from 'telegraf';
export const menuScene = new Scenes.BaseScene('menuScene');
menuScene.enter(async (ctx) => {
    ctx.reply('Меню:', Markup.inlineKeyboard([
        Markup.button.callback('➕ Создать задачу', 'createTask'),
        Markup.button.callback('📚 Расписание на сегодня', 'todaySchedule')
    ]));
});
menuScene.action('createTask', async (ctx) => {
    ctx.answerCbQuery();
    ctx.scene.enter('createTaskScene');
});
menuScene.action('todaySchedule', async (ctx) => {
    ctx.answerCbQuery();
    await ctx.reply(' ');
});
//# sourceMappingURL=menu.scene.js.map