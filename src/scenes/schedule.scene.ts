import { Markup, Scenes } from "telegraf";
import type { BotContext } from "../context.js";
import { getTodaySchedule } from "../api/schedule.api.js";


export const scheduleScene = new Scenes.BaseScene<BotContext>('scheduleScene');

scheduleScene.enter(async (ctx) => {
  await ctx.reply(await getTodaySchedule(), {
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

scheduleScene.action('openMenu', ctx => {
    ctx.scene.enter('menuScene');
})

scheduleScene.action('openYesterday', ctx => {

})

scheduleScene.action('openTomorrow', ctx => {
    
})