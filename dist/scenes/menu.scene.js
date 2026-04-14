import { Markup, Scenes, Telegraf } from 'telegraf';
export const menuScene = new Scenes.BaseScene('menu');
menuScene.enter(ctx => {
    ctx.reply('Меню:', Markup.inlineKeyboard([
        Markup.button.callback('➕ Создать задачу', 'createTask'),
        Markup.button.callback('📚 Расписание на сегодня', 'todaySchedule')
    ]));
});
menuScene.action('createTask', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('');
});
menuScene.action('todaySchedule', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('');
});
//# sourceMappingURL=menu.scene.js.map