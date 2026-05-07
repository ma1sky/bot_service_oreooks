// import { Markup, Scenes } from "telegraf";
// import type { BotContext } from "../config/types";
// import ScheduleService from "./schedule.service";


// export const scheduleScene = new Scenes.BaseScene<BotContext>('scheduleScene');

// scheduleScene.enter(async (ctx) => {

// 	ctx.scene.session

// 	await ctx.editMessageText('' ,{
// 		parse_mode: 'HTML',
// 		...Markup.inlineKeyboard([
// 			[
// 				Markup.button.callback('◀️', 'openYesterday'),
// 				Markup.button.callback('📋 Меню', 'openMenu'),
// 				Markup.button.callback('▶️', 'openTomorrow'),
// 			],
// 		]),
// 	});
// });

// scheduleScene.action('openMenu', async ctx => {
//     await ctx.scene.enter('menuScene');
// })

// scheduleScene.action('openYesterday', ctx => {
	
// })

// scheduleScene.action('openTomorrow', ctx => {
    
// })