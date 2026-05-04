import { Telegraf } from 'telegraf'
import { BOT_TOKEN } from './env.config'
import { SessionData } from '../session/session'
import { BotContext } from './types'
import { formatGreeting } from '../auth/auth.message'
import router from '../router/router'

export default function startBot(): Telegraf<BotContext> {
	const bot = new Telegraf<BotContext>(BOT_TOKEN as string)

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

	bot.on(["message", "callback_query"], async (ctx) => {
		router.route(ctx);
	})

	bot.start(async (ctx) => {
		ctx.session = {
			scene: 'authScene',
			step: 'login'
		}

		await SessionData.set(ctx.from.id, ctx.session)

		return await ctx.reply(formatGreeting(ctx.from!.first_name));
		
	})

	bot.catch((err, ctx) => {
		console.error(`Error for ${ctx.from?.id}:`, err)
	})

	bot.launch()

	return bot
}