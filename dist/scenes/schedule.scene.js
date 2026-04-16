import { Markup, Scenes } from "telegraf";
import { getTodaySchedule } from "../api/schedule.api.js";
export const scheduleScene = new Scenes.BaseScene('scheduleScene');
scheduleScene.enter(async (ctx) => {
    ctx.reply(await getTodaySchedule(), Markup.inlineKeyboard([
        Markup.button.callback('▶️', 'openTomorrow'),
        Markup.button.callback('◀️', 'openYesterday'),
        Markup.button.callback('📋 Меню', 'openMenu')
    ]));
});
scheduleScene.action('openMenu', ctx => {
    ctx.scene.enter('menuScene');
});
scheduleScene.action('openYesterday', ctx => {
});
scheduleScene.action('openTomorrow', ctx => {
});
//# sourceMappingURL=schedule.scene.js.map