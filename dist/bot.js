import { Telegraf, session, Scenes } from 'telegraf';
import { loginScene } from './auth.scene.js';
import { BOT_TOKEN } from './token.js';
const stage = new Scenes.Stage([loginScene]);
const bot = new Telegraf(BOT_TOKEN);
bot.use(session());
bot.use(stage.middleware());
bot.catch((err, ctx) => {
    console.error('Ошибка:', err);
    ctx.reply('Что-то пошло не так 😢');
});
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=bot.js.map