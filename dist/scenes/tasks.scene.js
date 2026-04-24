import { Markup, Scenes } from 'telegraf';
import { formatTask } from '../messages/tasks.messages.js';
import tasksService from '../services/tasks.service.js';
export const tasksScene = new Scenes.BaseScene('tasksScene');
function getSession(ctx) {
    if (!ctx.scene.session.tasksScene) {
        ctx.scene.session.tasksScene = {
            tasks: [],
            currentIndex: 0
        };
    }
    return ctx.scene.session.tasksScene;
}
tasksScene.enter(async (ctx) => {
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
        const tasks = Array.isArray(res.data?.tasks) ? res.data.tasks : [];
        if (!tasks.length) {
            await ctx.reply('У вас пока нет задач');
            return ctx.scene.enter('menuScene');
        }
        const state = getSession(ctx);
        state.tasks = tasks;
        state.currentIndex = 0;
        await renderCurrentTask(ctx);
    }
    catch (error) {
        console.error(error);
        await ctx.reply('Ошибка открытия задач');
        return ctx.scene.enter('menuScene');
    }
});
async function renderCurrentTask(ctx) {
    const state = getSession(ctx);
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
tasksScene.action('nextTask', async (ctx) => {
    await ctx.answerCbQuery();
    const state = getSession(ctx);
    if (state.currentIndex < state.tasks.length - 1) {
        state.currentIndex++;
    }
    await renderCurrentTask(ctx);
});
tasksScene.action('prevTask', async (ctx) => {
    await ctx.answerCbQuery();
    const state = getSession(ctx);
    if (state.currentIndex > 0) {
        state.currentIndex--;
    }
    await renderCurrentTask(ctx);
});
tasksScene.action('openMenu', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.scene.enter('menuScene');
});
tasksScene.action('deleteTask', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        if (!ctx.from?.id)
            return;
        const state = getSession(ctx);
        const task = state.tasks[state.currentIndex];
        if (!task)
            return;
        const res = await tasksService.deleteTask(ctx.from.id, task.id);
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
tasksScene.action('markComplete', async (ctx) => {
    await ctx.answerCbQuery('Пока не реализовано');
});
tasksScene.action('editTask', async (ctx) => {
    await ctx.answerCbQuery('Пока не реализовано');
});
//# sourceMappingURL=tasks.scene.js.map