import { Markup, Scenes } from "telegraf";
import { getSchedule } from "../services/schedule.service.js";
export const scheduleScene = new Scenes.BaseScene('scheduleScene');
scheduleScene.enter(async (ctx) => {
    await ctx.reply(await getSchedule(ctx.from?.id, new Date(Date.now())), {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [
                Markup.button.callback('◀️', 'openYesterday'),
                Markup.button.callback('📋 Меню', 'openMenu'),
                Markup.button.callback('▶️', 'openTomorrow'),
            ],
        ]),
    });
});
scheduleScene.action('openMenu', async (ctx) => {
    await ctx.scene.enter('menuScene');
});
scheduleScene.action('openYesterday', ctx => {
});
scheduleScene.action('openTomorrow', ctx => {
});
//# sourceMappingURL=schedule.scene.js.map