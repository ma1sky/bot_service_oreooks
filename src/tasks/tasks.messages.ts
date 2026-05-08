import type { BotContext } from "../config/types"
import { Markup } from "telegraf"
import { TasksCacheSession, TaskSession } from "../session/session"

export async function renderCurrentTask(ctx: BotContext) {
	const tgId = ctx.from!.id;
	const task = await TaskSession.get(tgId);
	const cache = await TasksCacheSession.get(tgId);
	if (!cache) {
		return ctx.reply('Не найдено задач в кэше')
	}

	if(!task) {
		return ctx.reply('Нет задачи')
	}
	const total = cache.tasksIds.length
	const index = cache.currentIndex + 1

	await ctx.reply(
		`📚 Задача ${index}/${total}, ID:${task.id}\n\n` +
		`${task.state == 'draft'? '⚒️ В процессе': '✅ Выполнена'}` +
		`✏️ Название: ${task.title}\n` +
		`📃 Описание: ${task.description}\n` +
		`📆 Дедлайн: ${Intl.DateTimeFormat('ru-RU').format(task.deadline)}`,
		
		Markup.inlineKeyboard([
			[ Markup.button.callback('✏️ Создать задачу','create') ],
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
		])
	)
}