import type { BotContext } from '../config/types';
import { Markup } from 'telegraf';
import { TasksCacheSession, TaskSession } from '../session/session';
export async function renderCurrentTask(ctx: BotContext) {
	const tgId = ctx.from!.id;
	const task = await TaskSession.get(tgId);
	const cache = await TasksCacheSession.get(tgId);
	const noTaskkeyboard = Markup.inlineKeyboard([
		[Markup.button.callback('✏️ Создать задачу', 'createTask')],
		[Markup.button.callback('📋 Меню', 'openMenu')],
	]);
	if (!cache) {
		return ctx.reply('📭 Не найдено задач в кэше', noTaskkeyboard);
	}
	if (!task) {
		return ctx.reply('📭 Задач нет', noTaskkeyboard);
	}
	const keyboard = Markup.inlineKeyboard([
		[Markup.button.callback('✏️ Создать задачу', 'createTask')],
		[
			Markup.button.callback('◀️', 'prevTask'),
			Markup.button.callback('📋 Меню', 'openMenu'),
			Markup.button.callback('▶️', 'nextTask'),
		],
		[
			Markup.button.callback(
				`${task.state == 'draft' ? '✅ Завершить' : '⚒️ В работу'}`,
				'toggleState',
			),
			Markup.button.callback('✏️ Редактировать', 'editTask'),
			Markup.button.callback('🗑️ Удалить', 'deleteTask'),
		],
	]);
	const total = cache.tasksIds.length;
	const index = cache.currentIndex + 1;
	const messageText =
		`📚 Задача ${index}/${total}, ID:${task.id}\n\n` +
		`${task.state == 'draft' ? '⚒️ В процессе' : '✅ Выполнена'}\n` +
		`✏️ Название: ${task.title}\n` +
		`📃 Описание: ${task.description}\n` +
		`📆 Дедлайн: ${task.deadline && !isNaN(new Date(task.deadline).getTime()) ? Intl.DateTimeFormat('ru-RU').format(new Date(task.deadline)) : 'Не указан'}`;
	try {
		await ctx.editMessageText(messageText, keyboard);
	} catch (error) {
		console.error('Error editing message:', error);
		await ctx.reply(messageText, keyboard);
	}
}