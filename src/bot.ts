import { Telegraf, Markup, session } from 'telegraf'
import dotenv from 'dotenv'
dotenv.config()

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is missing in env');
}

const bot = new Telegraf(BOT_TOKEN)
console.log('TOKEN:', process.env.BOT_TOKEN?.slice(0, 10))

bot.start(ctx => {
    ctx.reply(`
        Привет, ${ctx.from.first_name}!
        Для авторизации нажми на кнопку:
    `,
    Markup.inlineKeyboard([
        Markup.button.callback('🚪 Авторизироваться', 'auth')
    ])    
    )
})

bot.catch((err, ctx) => {
  console.error('Ошибка:', err)
  ctx.reply('Что-то пошло не так 😢')
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));