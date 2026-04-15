import { Scenes } from 'telegraf'
import type { BotContext } from '../context.js';
import { getApiToken } from '../api/auth.api.js';

export const loginScene = new Scenes.BaseScene<BotContext>('login');

loginScene.enter(async ctx => {
  ctx.scene.session.auth = {
      isAuth : false,
      login : '',
      step : 'login',
      token : ''
    }

  ctx.reply(`
    👋 Привет ${ctx.from?.first_name}!\n
Добро пожаловать в Oreooks! 🫡
Тут ты можешь отслеживать свою успеваемость, смотреть расписание, искать преподавателей, ставить себе напоминания и задачи.
\n🪪 Введи номер студенческого для дальнейшей работы.`);
});

loginScene.on('text', async (ctx) => {
  if (!ctx.scene.session.auth.isAuth) {
    ctx.scene.session.auth.isAuth = true;
    ctx.scene.session.auth.login = ctx.message.text;
    return ctx.reply('Введите пароль:');
  }

  let login = ctx.scene.session.auth.login;
  let password = ctx.message.text;

  try {
    ctx.scene.session.auth.token = await getApiToken(login, password);
    ctx.scene.session.auth.isAuth = true;
    await ctx.reply(`Авторизация прошла успешно!`);
    
  } catch(err) {
    ctx.scene.session.auth.isAuth = false;
    return await ctx.reply(`Произошла ошибка, попробуйте ввести данные заного. Сначала введите логин.`)
  }

  ctx.scene.enter('menuScene');
});