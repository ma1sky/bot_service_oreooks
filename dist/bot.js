import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN ?? '';
const bot = new Telegraf(BOT_TOKEN);
bot.start(ctx => {
    ctx.reply('Выбери кнопку', Markup.inlineKeyboard([
        [Markup.button.callback('Жми', 'Comand')]
    ]));
});
bot.action('comand', (ctx) => {
    ctx.answerCbQuery('Нажато!');
    ctx.reply('Ты нажал кнопку');
});
//# sourceMappingURL=bot.js.map