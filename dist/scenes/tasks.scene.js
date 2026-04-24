import { Markup, Scenes } from 'telegraf';
import { formatTask } from '../messages/tasks.messages.js';
import tasksService from '../services/tasks.service.js';
export const taskScene = new Scenes.BaseScene('tasksScene');
taskScene.enter(async (ctx) => {
    try {
        const tgId = ctx.from?.id;
        if (!tgId) {
            await ctx.reply('Не удалось определить пользователя');
            return ctx.scene.enter('menuScene');
        }
        const res = await tasksService.getTasks(tgId);
        if (!res.success) {
            await ctx.reply('Ошибка загрузки задач: ' + String(res.reason));
            return ctx.scene.enter('menuScene');
        }
        const tasks = Array.isArray(res.data) ? res.data : [];
        if (!tasks.length) {
            await ctx.reply('У вас пока нет задач');
            return ctx.scene.enter('menuScene');
        }
        ctx.scene.session.tasksScene.tasks = tasks;
        ctx.scene.session.tasksScene.currentIndex = 0;
        await renderCurrentTask(ctx);
    }
    catch (error) {
        console.error(error);
        await ctx.reply('Ошибка открытия задач');
        return ctx.scene.enter('menuScene');
    }
});
async function renderCurrentTask(ctx) {
    const state = ctx.scene.session.tasksScene;
    const task = state.tasks[state.currentIndex];
    if (!task) {
        await ctx.reply('Задача не найдена');
        return ctx.scene.enter('menuScene');
    }
    const total = state.tasks.length;
    const index = state.currentIndex + 1;
    await ctx.reply(`📚 Задача ${index}/${total}\n\n` +
        formatTask(task.title, task.description, new Date(task.deadline)), Markup.inlineKeyboard([
        [
            Markup.button.callback('◀️', 'prevTask'),
            Markup.button.callback('📋 Меню', 'openMenu'),
            Markup.button.callback('▶️', 'nextTask')
        ],
        [
            Markup.button.callback('✅ Завершить', 'markComplete'),
            Markup.button.callback('✏️ Редактировать', 'editTask'),
            Markup.button.callback('🗑️ Удалить', 'deleteTask')
        ]
    ]));
}
taskScene.action('nextTask', async (ctx) => {
    await ctx.answerCbQuery();
    const state = ctx.scene.session.tasksScene;
    if (state.currentIndex < state.tasks.length - 1) {
        state.currentIndex++;
    }
    await renderCurrentTask(ctx);
});
taskScene.action('prevTask', async (ctx) => {
    await ctx.answerCbQuery();
    const state = ctx.scene.session.tasksScene;
    if (state.currentIndex > 0) {
        state.currentIndex--;
    }
    await renderCurrentTask(ctx);
});
taskScene.action('openMenu', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.scene.enter('menuScene');
});
taskScene.action('deleteTask', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        const state = ctx.scene.session.tasksScene;
        const task = state.tasks[state.currentIndex];
        const res = await tasksService.deleteTask(ctx.from.id, task?.id);
        if (!res.success) {
            return ctx.reply('Ошибка удаления задачи');
        }
        state.tasks.splice(state.currentIndex, 1);
        if (!state.tasks.length) {
            await ctx.reply('Все задачи удалены');
            return ctx.scene.enter('menuScene');
        }
        if (state.currentIndex >= state.tasks.length) {
            state.currentIndex = state.tasks.length - 1;
        }
        await renderCurrentTask(ctx);
    }
    catch (error) {
        console.error(error);
        await ctx.reply('Ошибка удаления');
    }
});
taskScene.action('markComplete', async (ctx) => {
    await ctx.answerCbQuery('Пока не реализовано');
});
taskScene.action('editTask', async (ctx) => {
    await ctx.answerCbQuery('Пока не реализовано');
});
//# sourceMappingURL=tasks.scene.js.map