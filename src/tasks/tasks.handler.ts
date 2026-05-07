import { BotContext, MenuStep } from "../config/types";
import { BaseHandler } from "../base/base.handler";
import { getMessageText } from "../utils/utils";
import tasksValidator from "./tasks.validator";
import { TaskSession } from "../session/session";
import { SessionData } from "../session/session";
import tasksService from "./tasks.service";
import type { TaskAction, NavAction, TaskFlowStep } from './tasks.types'

export class TasksHandler extends BaseHandler {

	private flow = {
		title: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const text = getMessageText(ctx);

			const result = tasksValidator.validateTitle(text);
			if (!result.success) {
				return ctx.reply(result.error.issues[0]?.message ?? 'Ошибка при валидации названия');
			}

			await TaskSession.update(tgId, {
				title: result.data
			});

			await SessionData.update(tgId, {
				step: "description"
			});

			return ctx.reply("📝 Введи описание:");
		},

		description: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const text = getMessageText(ctx);

			const result = tasksValidator.validateDescription(text);
			if (!result.success) {
				return ctx.reply(result.error.issues[0]?.message ?? 'Неизвестная при валидации описания');
			}

			await TaskSession.update(tgId, {
				description: result.data
			});

			await SessionData.update(tgId, {
				step: "deadline"
			});

			return ctx.reply("📆 Введи дату:");
		},

		deadline: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const text = getMessageText(ctx);

			const result = tasksValidator.validateDeadline(text);
			if (!result.success) {
				return ctx.reply(result.error.issues[0]?.message ?? 'Ошибка при валидации даты');
			}

			await TaskSession.update(tgId, {
				deadline: result.data
			});

			const task = await TaskSession.get(tgId);

			if (!task) {
				return ctx.reply("❌ Ошибка");
			}

			await tasksService.createTask(task, tgId);

			await SessionData.update(tgId, {
				scene: "menuScene",
				step: "menu" as MenuStep
			});

			return ctx.reply("✅ Задача создана");
		},

        toggleState: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
            
        }
	};
    
    private actions: Record<TaskAction, (ctx: BotContext) => Promise<any> > = {
        createTask: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;

            await SessionData.update(tgId, {
                step: "title"
            });

            return ctx.reply("✏️ Введи заголовок задачи:");
        },

        viewTasks: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;
            const tasks = await TaskSession.get(tgId);

        },

        editTask: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;

            await SessionData.update(tgId, {
                step: "title"
            });

            return ctx.reply("✏️ Введи заголовок задачи:");
        },

        deleteTask: async (ctx: BotContext) => {

        }
    };

	private navigation = {
		openMenu: async (ctx: BotContext) => {
			await SessionData.update(ctx.from!.id, {
				scene: "menuScene",
				step: "menu" as MenuStep
			});
		},

        prevTask: async (ctx: BotContext) => {

        },

        nextTask: async (ctx: BotContext) => {

        }
	};

	override async handle(ctx: BotContext) {
        const tgId = ctx.from!.id;
        const session = await SessionData.get(tgId);

        const step = session?.step as TaskFlowStep | undefined;

        if (step && step in this.flow) {
            return this.flow[step](ctx);
        }

        if ("callback_query" in ctx.update && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
            const data = ctx.callbackQuery.data;

            if (data in this.actions) {
                return this.actions[data as TaskAction](ctx);
            }

            if (data in this.navigation) {
                return this.navigation[data as NavAction](ctx);
            }
        }
    }
}