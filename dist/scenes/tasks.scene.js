import { Markup, Scenes } from "telegraf";
import { formatTask } from "../messages/tasks.messages.js";
export const taskScene = new Scenes.BaseScene('taskScene');
taskScene.enter(ctx => {
    let { id, title, description, deadline } = ctx.scene.session.taskScene.tasks[0];
    ctx.reply(formatTask(title, description, deadline)),
        Markup.inlineKeyboard([
            [
                Markup.button.callback('◀️', 'openNext'),
                Markup.button.callback('📋 Меню', 'openMenu'),
                Markup.button.callback('▶️', 'openPrevious'),
            ],
            [
                Markup.button.callback('✅ Завершить', 'markComplete'),
                Markup.button.callback('✏️ Редактировать', 'editTask'),
                Markup.button.callback('🗑️ Удалить', 'deleteTask')
            ]
        ]);
});
taskScene.action('deleteTask', ctx => {
});
taskScene.action('markComplete', ctx => {
});
taskScene.action('editTask', ctx => {
});
//# sourceMappingURL=tasks.scene.js.map