import type { BotContext } from "../config/types"
import { Markup } from "telegraf"
import { TasksCacheSession, TaskSession } from "../session/session"

const keyboard = Markup.inlineKeyboard([
			[ Markup.button.callback('✏️ Создать задачу','createTask') ],
			[
				Markup.button.callback('◀️', 'prevTask'),
				Markup.button.callback('📋 Меню', 'openMenu'),
				Markup.button.callback('▶️', 'nextTask')
			],
			[
				Markup.button.callback('✅ Завершить', 'toggleState'),
				Markup.button.callback('✏️ Редактировать', 'editTask'),
				Markup.button.callback('🗑️ Удалить', 'deleteTask')
			]
		])

export async function renderCurrentTask(ctx: BotContext) {
	const tgId = ctx.from!.id;
	const task = await TaskSession.get(tgId);
	const cache = await TasksCacheSession.get(tgId);
	if (!cache) {
		return ctx.reply('📭 Не найдено задач в кэше', keyboard)
	}

	if(!task) {
		return ctx.reply('📭 Задач нет', keyboard)
	}
	const total = cache.tasksIds.length
	const index = cache.currentIndex + 1

	await ctx.reply(
		`📚 Задача ${index}/${total}, ID:${task.id}\n\n` +
		`${task.state == 'draft'? '⚒️ В процессе': '✅ Выполнена'}` +
		`✏️ Название: ${task.title}\n` +
		`📃 Описание: ${task.description}\n` +
		`📆 Дедлайн: ${task.deadline && !isNaN(new Date(task.deadline).getTime()) ? Intl.DateTimeFormat('ru-RU').format(new Date(task.deadline)) : 'Не указан'}`,
		
		keyboard
	)
}