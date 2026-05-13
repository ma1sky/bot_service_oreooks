import { Telegraf } from 'telegraf'
import { BOT_TOKEN } from './env.config'
import { SessionData } from '../session/session'
import { BotContext } from './types'
import { formatGreeting } from '../auth/auth.message'
import router from '../router/router';

export default function startBot(): Telegraf<BotContext> {
	const bot = new Telegraf<BotContext>(BOT_TOKEN as string);

	bot.use(async (ctx, next) => {
		if (ctx.message && "text" in ctx.message && ctx.message.text === "/start") {
			return next();
		}
		
		return router.route(ctx);
	});

	bot.start(async (ctx) => {
		const session = await SessionData.get(ctx.from.id);

		if (!session) {
			await SessionData.set(ctx.from.id, {
				scene: 'authScene',
				step: 'login'
			});
		}

		await ctx.reply(formatGreeting(ctx.from.first_name));
	});

	

	bot.catch((err, ctx) => {
		console.error(`Error for ${ctx.from?.id}:`, err)
	})

	bot.launch()

	return bot
}