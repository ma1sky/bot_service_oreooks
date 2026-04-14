import { Scenes } from 'telegraf'
import type { SessionContext } from '../context.js';
import { getApiToken } from '../api/auth.api.js';

export const loginScene = new Scenes.BaseScene<SessionContext>('login');

loginScene.enter((ctx) => {
  ctx.reply(`
    Привет ${ctx.from?.first_name}!👋
Добро пожаловать в Oreooks!
Тут ты можешь отслеживать свою успеваемость, смотреть расписание, искать преподавателей, ставить себе напоминания и задачи.
\n🪪 Введи номер студенческого для дальнейшей работы.`);
});


loginScene.on('text', (ctx) => {
  if (!ctx.scene.session.auth.isAuth) {

    ctx.scene.session.auth = {
      isAuth : false,
      login : ctx.message.text,
      step : 'login',
      token : ''
    }

    return ctx.reply('Введите пароль:');
  }

  let login = ctx.scene.session.auth.login;
  let password = ctx.message.text;

  try {
    ctx.scene.session.auth.token = getApiToken(login, password);
    ctx.scene.session.auth.isAuth = true;
    ctx.reply(`Авторизация прошла успешно!`);
    
  } catch(err) {
    ctx.scene.session.auth.isAuth = false;
    return ctx.reply(`Произошла ошибка, попробуйте ввести данные заного. Сначала введите логин.`)
  }

  ctx.scene.enter('menu');
});