import type { Telegraf } from 'telegraf';
import startBot from './config/bot.config.js';
import type { BotContext } from './config/types.js';
const bot: Telegraf<BotContext> = startBot();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));