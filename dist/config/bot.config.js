import { Telegraf, session, Scenes } from 'telegraf';
import { BOT_TOKEN } from './env.config.js';
import { authScene } from '../scenes/auth.scene.js';
import { menuScene } from '../scenes/menu.scene.js';
import { createTaskScene } from '../scenes/createTask.scene.js';
import { scheduleScene } from '../scenes/schedule.scene.js';
import { tasksScene } from '../scenes/tasks.scene.js';
import { editTaskScene } from '../scenes/editTaskScene.js';
export default function startBot() {
    const stage = new Scenes.Stage([authScene, menuScene, createTaskScene, scheduleScene, tasksScene, editTaskScene]);
    const bot = new Telegraf(BOT_TOKEN);
    bot.use(session());
    bot.use(stage.middleware());
    bot.start(ctx => ctx.scene.enter('auth'));
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