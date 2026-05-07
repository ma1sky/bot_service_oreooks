import { BaseHandler } from "../base/base.handler";
import { BotContext, TaskStep } from "../config/types";
import { SessionData } from "../session/session";
import { TaskSession } from "../session/session";
import { getMessageText } from "../utils/utils";
import tasksService from "./tasks.service";

export class TasksCreateHandler extends BaseHandler {

    private actions = {
        view: async (ctx: BotContext) => {

        },

        enter: async (ctx: BotContext) => {
            const tgId = ctx.from!.id; 
            await SessionData.update(tgId, {
                step: 'title' as TaskStep
            })
            return ctx.reply('✏️ Введи заголовок задачи:')
        },

        title: async (ctx: BotContext) => {
            const tgId = ctx.from!.id; 
            const title = getMessageText(ctx);

            await TaskSession.update(tgId, {
                title: title
            })

            await SessionData.update(tgId, {
                step: "description" as TaskStep
            });

            return ctx.reply("📝 Введи описание:");
        },

        description: async (ctx: BotContext) => {
            const tgId = ctx.from!.id; 

            const description = getMessageText(ctx);
            
            await TaskSession.update(tgId, {
                description: description
            })

            await SessionData.update(tgId, {
                step: "deadline" as TaskStep
            });

            return await ctx.reply('📆 Введи дату дедлайна (дд.мм.гггг):')
        },

        deadline: async (ctx: BotContext) => {
            const tgId = ctx.from!.id; 
            const taskSession = await TaskSession.get(tgId);
            const dateString = getMessageText(ctx);
            const match = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

            if (!match) {
                await ctx.reply('❌ Неверный формат даты. Используй дд.мм.гггг')
                return
            }
            

            const [, dd, mm, yyyy] = match
		    const deadline = new Date(Number(yyyy), Number(mm) - 1, Number(dd))

            if (isNaN(deadline.getTime())) {
                await ctx.reply('❌ Некорректная дата')
                return
            }

            await SessionData.update(tgId, {
                scene: "menuScene",
                step: "enter"
            });

            await TaskSession.update(tgId, {
                state: "draft",
                deadline: deadline
            })

            const task = await TaskSession.get(tgId);

            if (!task) {
                return await ctx.reply('Не удалось создать задачу.')
            }

            if(!taskSession) {
                return
            }

            await tasksService.createTask(task, tgId)

            return 
        }
    }

    private isTaskStep(step: string): step is TaskStep {
        return step === "title" || step === "description" || step === "deadline" || step === 'enter';
    }

    override async handle(ctx: BotContext) {
        const tgId = ctx.from!.id
        const session = await SessionData.get(tgId)
        const step = session?.step;

        if(step && this.isTaskStep(step)) {
            await this.actions[step](ctx)
        }
    }
}