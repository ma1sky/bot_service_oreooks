import { Telegraf, session, Scenes } from 'telegraf'
import { BOT_TOKEN } from './env.config';
import { authScene } from '../auth/auth.scene';
import { menuScene } from '../menu/menu.scene';
import { createTaskScene } from '../tasks/scenes/tasks.create.scene';
import { scheduleScene } from '../schedule/schedule.scene';
import { tasksScene } from '../tasks/scenes/tasks.show.scene';
import { editTaskScene } from '../tasks/scenes/tasks.edit.scene';
import { SessionData } from '../session/session';

export default function startBot(): Telegraf {
	const bot = new Telegraf(BOT_TOKEN as string);
	
	bot.on('message', async ctx => {
		const tgId = ctx.from.id;
		const session = await SessionData.get(tgId);
		if (!session.scene) {

		} else {

		}
	});
	
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
