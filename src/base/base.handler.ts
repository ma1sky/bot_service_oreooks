import { BotContext } from '../config/types';
export class BaseHandler {
	async handle(ctx: BotContext): Promise<void> {
		ctx.reply('Hello, world!');
		return;
	}
}