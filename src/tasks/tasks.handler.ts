import { BotContext, MenuStep } from "../config/types";
import { BaseHandler } from "../base/base.handler";
import { getMessageText } from "../utils/utils";
import tasksValidator from "./tasks.validator";
import { SessionData, TasksCacheSession, TaskSession } from "../session/session";
import tasksService from "./tasks.service";
import type { TaskAction, NavAction, TaskFlowStep } from './tasks.types'
import { renderCurrentTask } from "./tasks.messages";
import router from "../router/router";

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

			if (task.deadline && typeof task.deadline === 'string') {
				task.deadline = new Date(task.deadline);
			}

			await tasksService.createTask(task, tgId);

			await SessionData.update(tgId, {
				scene: "menuScene",
				step: "menu" as MenuStep
			});

			await ctx.reply("✅ Задача создана");
			return router.route(ctx);
		},

        toggleState: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;
        },

        view: async (ctx: BotContext) => {
            return this.actions.view(ctx);
        }
 };
    
    public actions: Record<TaskAction, (ctx: BotContext) => Promise<any> > = {
        view: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;
            const result = await tasksService.getTasks(tgId)
            
            if(!result.success) {
                await ctx.reply(result.reason ?? 'Неизвестная ошибка');
                return;
            }

            const tasks = result.data

            if (!tasks || !tasks.length) {
                await renderCurrentTask(ctx);
                return; 
            }

            await TasksCacheSession.set(tgId, {
                tasksIds: tasks.map(task => task.id!),
                currentId: tasks[0]?.id!,
                currentIndex: 0
            })

            if (!tasks[0]) {
                return;
            }

            const { id, title, description, deadline, state } = tasks[0]
            
            await TaskSession.set(tgId, {
                id: id!,
                title: title,
                description: description,
                deadline: deadline,
                state: state as "draft" | "completed"
            })

            await renderCurrentTask(ctx);
            return;
        },

        createTask: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;

            await SessionData.update(tgId, {
                step: "title"
            });

            return ctx.reply("✏️ Введи заголовок задачи:");
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
	       
	       if ("callback_query" in ctx.update && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
	           const data = ctx.callbackQuery.data;
	           
	           console.log(`[TasksHandler] Callback query received: ${data}, tgId: ${tgId}`);
	           
	           await ctx.answerCbQuery().catch(() => {});

	           if (data in this.actions) {
	               console.log(`[TasksHandler] Action found: ${data}`);
	               return this.actions[data as TaskAction](ctx);
	           }

	           if (data in this.navigation) {
	               console.log(`[TasksHandler] Navigation found: ${data}`);
	               return this.navigation[data as NavAction](ctx);
	           }
	           
	           console.log(`[TasksHandler] Unknown callback data: ${data}`);
	       }

	       const session = await SessionData.get(tgId);
	       const step = session?.step as TaskFlowStep | undefined;
	       const scene = session?.scene;
	       
	       console.log(`[TasksHandler] No callback query, scene: ${scene}, step: ${step}`);

	       if (step && step in this.flow) {
	           console.log(`[TasksHandler] Executing flow step: ${step}`);
	           return this.flow[step](ctx);
	       }
	       
	       console.log(`[TasksHandler] No action taken`);
	   }
}