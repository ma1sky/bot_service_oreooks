import { Telegraf, session, Scenes } from 'telegraf';
import { BOT_TOKEN } from './env.config.js';
import { loginScene } from '../scenes/auth.scene.js';
import { menuScene } from '../scenes/menu.scene.js';
import { createTaskScene } from '../scenes/createTask.scene.js';
import { scheduleScene } from '../scenes/schedule.scene.js';
export default function startBot() {
    const stage = new Scenes.Stage([loginScene, menuScene, createTaskScene, scheduleScene]);
    const bot = new Telegraf(BOT_TOKEN);
    bot.use(session());
    bot.use(stage.middleware());
    bot.start(ctx => ctx.scene.enter('login'));
    bot.catch((err, ctx) => {
        console.error('Ошибка:', err);
        ctx.reply('Что-то пошло не так!');
    });
    try {
        bot.launch({
            dropPendingUpdates: true
        });
        console.log('Bot started');
    }
    catch (err) {
        console.error('Bot launch failed:', err);
        process.exitCode = 1;
    }
    return bot;
}
//# sourceMappingURL=bot.config.js.map