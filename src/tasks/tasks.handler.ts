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

			if (task.id) {
				await tasksService.updateTask(task, tgId);
				await ctx.reply("✅ Задача обновлена");
			} else {
				await tasksService.createTask(task, tgId);
				await ctx.reply("✅ Задача создана");
			}

			// Clear task draft from session after successful save
			await TaskSession.clear(tgId);

			await SessionData.update(tgId, {
				scene: "tasksScene",
				step: "view" as MenuStep
			});

			return router.route(ctx);
		},

		toggleState: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const cache = await TasksCacheSession.get(tgId);
			if (!cache) {
				return ctx.reply("Нет задач");
			}

			const task = await TaskSession.get(tgId);
			if (!task) {
				return ctx.reply("Нет текущей задачи");
			}

			if (task.deadline && typeof task.deadline === 'string') {
				task.deadline = new Date(task.deadline);
			}

			const newState = task.state === "draft" ? "completed" : "draft";
			const updatedTask = {
				...task,
				state: newState as "draft" | "completed"
			};

			const result = await tasksService.updateTask(updatedTask, tgId);
			if (result.success && result.task) {
				await TaskSession.update(tgId, {
					state: newState
				});
			} else {
				await ctx.reply(result.reason ?? "Не удалось обновить задачу");
				return;
			}

			return renderCurrentTask(ctx);
		},

		view: async (ctx: BotContext) => {
			return this.actions.view(ctx);
		}
	};

	public actions: Record<TaskAction, (ctx: BotContext) => Promise<any>> = {
		view: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			await SessionData.update(tgId, {
				scene: "tasksScene",
				step: "view"
			});
			try {
				const result = await tasksService.getTasks(tgId)

				if (!result.success) {
					await ctx.reply(result.reason ?? 'Неизвестная ошибка');
					return;
				}

				const tasks = result.tasks

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
					state: (state || "draft") as "draft" | "completed"
				})

				await renderCurrentTask(ctx);
			} catch (error) {
				console.error(`Error in view action:`, error);
				await ctx.reply('Произошла непредвиденная ошибка');
			}
			return;
		},

		createTask: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;

			await TaskSession.set(tgId, {});

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
			const tgId = ctx.from!.id;
			const cache = await TasksCacheSession.get(tgId);
			const result = await tasksService.deleteTask(tgId, cache?.currentId!);
			if (result.success) {
				// Clear TaskSession since the current task is deleted
				await TaskSession.clear(tgId);

				if (!cache) {
					// No cache, go to menu
					await SessionData.update(tgId, {
						scene: "menuScene",
						step: "menu" as MenuStep
					});
					return router.route(ctx);
				}

				const newTasksIds = cache.tasksIds.filter(id => id !== cache.currentId);
				
				if (newTasksIds.length === 0) {
					await TasksCacheSession.clear(tgId);
					await SessionData.update(tgId, {
						scene: "menuScene",
						step: "menu" as MenuStep
					});
					await ctx.reply("✅ Задача удалена. Задач больше нет.");
					return router.route(ctx);
				}

				const newIndex = cache.currentIndex - 1 === -1 ? 0 : cache.currentIndex - 1;
				const newCurrentId = newTasksIds[newIndex];
				
				if (newCurrentId === undefined) {
					console.error('newCurrentId is undefined, using first task');
					const fallbackId = newTasksIds[0];
					if (fallbackId === undefined) {
						await TasksCacheSession.clear(tgId);
						await SessionData.update(tgId, {
							scene: "menuScene",
							step: "menu" as MenuStep
						});
						await ctx.reply("✅ Задача удалена. Задач больше нет.");
						return router.route(ctx);
					}
					await TasksCacheSession.update(tgId, {
						tasksIds: newTasksIds,
						currentIndex: 0,
						currentId: fallbackId
					});
					
					const taskResult = await tasksService.getTask(tgId, fallbackId);
					if (taskResult.success && taskResult.task) {
						const taskData: any = {
							id: taskResult.task.id,
							title: taskResult.task.title,
							description: taskResult.task.description,
							state: taskResult.task.state
						};
						
						if (taskResult.task.deadline) {
							taskData.deadline = new Date(taskResult.task.deadline);
						}
						
						await TaskSession.set(tgId, taskData);
					}
				} else {
					await TasksCacheSession.update(tgId, {
						tasksIds: newTasksIds,
						currentIndex: newIndex,
						currentId: newCurrentId
					});

					const taskResult = await tasksService.getTask(tgId, newCurrentId);
					if (taskResult.success && taskResult.task) {
						const taskData: any = {
							id: taskResult.task.id,
							title: taskResult.task.title,
							description: taskResult.task.description,
							state: taskResult.task.state
						};
						
						if (taskResult.task.deadline) {
							taskData.deadline = new Date(taskResult.task.deadline);
						}
						
						await TaskSession.set(tgId, taskData);
					} else {
						console.error('Failed to fetch remaining task after deletion:', taskResult.reason);
					}
				}

				await SessionData.update(tgId, {
					scene: "tasksScene",
					step: "view"
				});

				return await renderCurrentTask(ctx);
			}
		},

		toggleState: async (ctx: BotContext) => {
			return this.flow.toggleState(ctx);
		}
	};

	private navigation = {
		openMenu: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			
			await TaskSession.clear(tgId);
			await TasksCacheSession.clear(tgId);
			
			await SessionData.update(tgId, {
				scene: "menuScene",
				step: "menu" as MenuStep
			});

			return router.route(ctx);
		},

		prevTask: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const cache = await TasksCacheSession.get(tgId);

			if (!cache) {
				return;
			}

			if (cache?.currentIndex <= 0) {
				return;
			}

			const newIndex = cache.currentIndex - 1;
			const newCurrentId = cache.tasksIds[newIndex] ?? 0;

			const result = await tasksService.getTask(tgId, newCurrentId);
			if (result.success && result.task) {
				const taskData: any = {
					id: result.task.id,
					title: result.task.title,
					description: result.task.description,
					state: result.task.state
				};
				
				if (result.task.deadline) {
					taskData.deadline = new Date(result.task.deadline);
				}
				
				await TaskSession.set(tgId, taskData);
				
				await TasksCacheSession.update(tgId, {
					currentIndex: newIndex,
					currentId: newCurrentId
				});

				await renderCurrentTask(ctx);
			} else {
				console.error('Failed to fetch task data for navigation:', result.reason);
			}
		},

		nextTask: async (ctx: BotContext) => {
			const tgId = ctx.from!.id;
			const cache = await TasksCacheSession.get(tgId);

			if (!cache) {
				return;
			}

			if (cache?.currentIndex >= cache.tasksIds.length - 1) {
				return;
			}

			const newIndex = cache.currentIndex + 1;
			const newCurrentId = cache.tasksIds[newIndex] ?? 0;

			const result = await tasksService.getTask(tgId, newCurrentId);
			if (result.success && result.task) {
				const taskData: any = {
					id: result.task.id,
					title: result.task.title,
					description: result.task.description,
					state: result.task.state
				};
				
				if (result.task.deadline) {
					taskData.deadline = new Date(result.task.deadline);
				}
				
				await TaskSession.set(tgId, taskData);
				
				await TasksCacheSession.update(tgId, {
					currentIndex: newIndex,
					currentId: newCurrentId
				});

				await renderCurrentTask(ctx);
			} else {
				console.error('Failed to fetch task data for navigation:', result.reason);
			}
		}
	};

	override async handle(ctx: BotContext) {
		const tgId = ctx.from!.id;

		if ("callback_query" in ctx.update && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
			const data = ctx.callbackQuery.data;

			console.log(`[TasksHandler] Callback query received: ${data}, tgId: ${tgId}`);

			await ctx.answerCbQuery().catch(() => { });

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