import { Scenes } from 'telegraf'
import type { BotContext } from '../config/types.js';
import tasksService from '../services/tasks.service.js';
import { getMessageText } from './utils/utils.js';

export const createTaskScene = new Scenes.WizardScene<BotContext>(
    'createTaskScene',
    
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
        
        try {
            let result = await tasksService.createTask(
                ctx.wizard.state.title as string,
                ctx.wizard.state.description as string,
                ctx.wizard.state.deadline,
                ctx.from?.id as number
            );

            if (!result.success) {
                ctx.reply('❌ Не удалось создать задачу:' + result.reason )
            } else {
                await ctx.reply(`✅ Задача успешно создана!`)
            }

        } catch {
            await ctx.reply('❌ Не удалось создать задачу')
        }
        
        return ctx.scene.enter('menuScene');
    },
);