import { Telegraf, session, Scenes } from 'telegraf'
import type { BotContext } from './context.js';
import { BOT_TOKEN } from './token.js';
import { loginScene } from './scenes/auth.scene.js';
import { menuScene } from './scenes/menu.scene.js';
import { createTaskScene } from './scenes/createTask.scene.js';
import { scheduleScene } from './scenes/schedule.scene.js';

const stage = new Scenes.Stage<BotContext>([loginScene, menuScene, createTaskScene, scheduleScene]);
const bot = new Telegraf<BotContext>(BOT_TOKEN as string);

bot.use(session());
bot.use(stage.middleware());
bot.start(ctx => ctx.scene.enter('login'));

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

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));