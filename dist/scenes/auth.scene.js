import { Scenes } from 'telegraf';
import { getApiToken } from '../api/auth.api.js';
export const loginScene = new Scenes.BaseScene('login');
loginScene.enter((ctx) => {
    ctx.scene.session.auth = {
        isAuth: false,
        login: '',
        step: 'login',
        token: ''
    };
    ctx.reply(`
    Привет ${ctx.from?.first_name}!👋
Добро пожаловать в Oreooks!
Тут ты можешь отслеживать свою успеваемость, смотреть расписание, искать преподавателей, ставить себе напоминания и задачи.
\n🪪 Введи номер студенческого для дальнейшей работы.`);
});
loginScene.on('text', (ctx) => {
    if (!ctx.scene.session.auth.isAuth) {
        return ctx.reply('Введите пароль:');
    }
    let login = ctx.scene.session.auth.login;
    let password = ctx.message.text;
    try {
        ctx.scene.session.auth.token = getApiToken(login, password);
        ctx.scene.session.auth.isAuth = true;
        ctx.reply(`Авторизация прошла успешно!`);
    }
    catch (err) {
        ctx.scene.session.auth.isAuth = false;
        return ctx.reply(`Произошла ошибка, попробуйте ввести данные заного. Сначала введите логин.`);
    }
    ctx.scene.enter('menu');
});
//# sourceMappingURL=auth.scene.js.map