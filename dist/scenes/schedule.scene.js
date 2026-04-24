import { Markup, Scenes } from "telegraf";
import ScheduleService from "../services/schedule.service.js";
export const scheduleScene = new Scenes.BaseScene('scheduleScene');
scheduleScene.enter(async (ctx) => {
    ctx.scene.session;
    await ctx.reply('', {
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