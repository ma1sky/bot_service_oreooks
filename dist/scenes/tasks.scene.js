import { BaseScene } from "telegraf/scenes";
import { Markup, Scenes } from "telegraf";
import { createTextChangeRange } from "typescript";
export const taskScene = new Scenes.BaseScene('taskScene');
taskScene.enter(ctx => {
    ctx.reply('dwq'),
        Markup.inlineKeyboard([
            [
                Markup.button.callback('◀️', 'openYesterday'),
                Markup.button.callback('📋 Меню', 'openMenu'),
                Markup.button.callback('▶️', 'openTomorrow'),
            ],
            [
                Markup.button.callback('✅ Завершить', 'markComplete'),
                Markup.button.callback('✏️ Редактировать', 'editTask'),
                Markup.button.callback('🗑️ Удалить', 'deleteTask')
            ]
        ]);
});
//# sourceMappingURL=tasks.scene.js.map