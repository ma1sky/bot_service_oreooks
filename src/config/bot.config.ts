import { Telegraf, session, Scenes } from 'telegraf'
import type { BotContext } from './types';
import { BOT_TOKEN } from './env.config';
import { authScene } from '../auth/auth.scene';
import { menuScene } from '../menu/menu.scene';
import { createTaskScene } from '../tasks/create.scene';
import { scheduleScene } from '../schedule/schedule.scene';
import { tasksScene } from '../tasks/tasks.scene';
import { editTaskScene } from '../tasks/edit.scene';

export default function startBot(): Telegraf<BotContext> {
	
	const stage = new Scenes.Stage<BotContext>([authScene, menuScene, createTaskScene, scheduleScene, tasksScene, editTaskScene]);
	
	const bot = new Telegraf<BotContext>(BOT_TOKEN as string);
	
	bot.use(session());
	bot.use(stage.middleware());
	bot.start(ctx => ctx.scene.enter('auth'));
	
	bot.catch((err, ctx) => {
		console.error('Ошибка:', err)
		ctx.reply('Что-то пошло не так!')
	})
	
	try {
		bot.launch({
			dropPendingUpdates: true  
		})
		console.log('Bot started')
	} catch (err) {
		console.error('Bot launch failed:', err)
		process.exitCode = 1;
	}
	return bot;
}
