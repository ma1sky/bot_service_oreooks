import { Telegraf } from 'telegraf'
import { BOT_TOKEN } from './env.config'
import { SessionData } from '../session/session'
import { BotContext } from './types'
import { formatGreeting } from '../auth/auth.message'
import router from '../router/router';

export default function startBot(): Telegraf<BotContext> {
	const bot = new Telegraf<BotContext>(BOT_TOKEN as string);

	bot.use(async (ctx, next) => {
		const id = ctx.from?.id
		if (!id) return

		ctx.session = await SessionData.get(id) ?? {
			scene: 'authScene',
			step: 'login'
		}

		await next()

		await SessionData.set(id, ctx.session)
	})

	bot.start(async (ctx) => {
		await SessionData.set(ctx.from.id, {
			scene: 'authScene',
			step: 'login'
		})

		await ctx.reply(formatGreeting(ctx.from!.first_name));
		return await router.route(ctx); 
	})

	bot.on(["message", "callback_query"], async (ctx) => {
		return await router.route(ctx);
	})

	bot.catch((err, ctx) => {
		console.error(`Error for ${ctx.from?.id}:`, err)
	})

	bot.launch()

	return bot
}