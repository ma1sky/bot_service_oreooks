import { Scenes } from 'telegraf'

export interface LoginSceneSession extends Scenes.SceneSessionData {
  step?: string
  login?: string
}

export type OreooksContext = Scenes.SceneContext<LoginSceneSession>


export const loginScene = new Scenes.BaseScene<OreooksContext>('login');

loginScene.enter((ctx) => {
  ctx.reply(`
    Привет ${ctx.from?.first_name}!👋\nДобро пожаловать в Oreooks. Тут ты можешь отслеживать свою успеваемость, смотреть расписание, искать преподавателей, ставить себе напоминания и задачи.\n
    🪪 Введи номер студенческого для дальнейшей работы.`);
});


loginScene.on('text', (ctx) => {
  if (!ctx.scene.session.login) {
    ctx.scene.session.login = ctx.message.text;
    return ctx.reply('Введите пароль:');
  }

  const login = ctx.scene.session.login;
  const password = ctx.message.text;

  ctx.reply(`Авторизация:\n${login}:${password}`);

  ctx.scene.leave();
});
