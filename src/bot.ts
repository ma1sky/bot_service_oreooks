import { Telegraf, session, Scenes } from 'telegraf'
import { loginScene } from './auth.scene.js';
import type { OreooksContext } from './auth.scene.js';
import { BOT_TOKEN } from './token.js';

const stage = new Scenes.Stage<OreooksContext>([loginScene]);
const bot = new Telegraf<OreooksContext>(BOT_TOKEN as string);

bot.use(session());
bot.use(stage.middleware());

bot.catch((err, ctx) => {
  console.error('Ошибка:', err)
  ctx.reply('Что-то пошло не так 😢')
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));