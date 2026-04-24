import { Scenes } from 'telegraf'
import type { BotContext } from '../config/types.js';
import tasksService from '../services/tasks.service.js';
import type { Task } from '../config/types.js';

function getMessageText(ctx: BotContext): string {
    if (!ctx.message || !('text' in ctx.message)) {
        ctx.reply('Отправь текст');
        throw Error('Отправь текст');
    }

    return ctx.message.text;
}

export const editTaskScene = new Scenes.WizardScene<BotContext>(
    'editTaskScene',
    
    async ctx => {
        await ctx.reply('✏️ Введи залоговок задачи: ');
        return ctx.wizard.next();
    },

    async ctx => {
        ctx.wizard.state.title = getMessageText(ctx);
        ctx.reply('📃 Введи описание задачи: ');
        return ctx.wizard.next();
    },

    async ctx => {
        ctx.wizard.state.description = getMessageText(ctx);
        ctx.reply('📆 Введи дату дедлайна в формате дд.мм.гггг:')
        return ctx.wizard.next();
    },

    async ctx => {
        let dateString: string = getMessageText(ctx)

        if (!dateString || isNaN(Date.parse(dateString))) {
            return ctx.reply('❌ Дата неправильного формата')
        }
        
        ctx.wizard.state.deadline = new Date(dateString);

        let currentIndex = ctx.scene.session.tasksScene.currentIndex
        let currentTask = ctx.scene.session.tasksScene.tasks[currentIndex]
        try {
            let task: Task = {
                title: ctx.wizard.state.title as string,
                description: ctx.wizard.state.description as string,
                deadline: ctx.wizard.state.deadline,
                id: currentTask?.id as number
            }
            let result = await tasksService.updateTask(task, ctx.from?.id as number);

            if (!result.success) {
                ctx.reply('❌ Не удалось отредактировать задачу:' + result.reason )
            } else {
                await ctx.reply(`✅ Задача успешно отредактирована!`)
            }

        } catch {
            await ctx.reply('❌ Не удалось отредактировать задачу')
        }
        
        return ctx.scene.enter('menuScene');
    },
);