import { Scenes } from 'telegraf'
import type { BotContext } from '../../config/types'
import tasksService from '../tasks.service'
import { getMessageText } from '../../utils/utils'

type CreateTaskState = {
	title?: string
	description?: string
	deadline?: Date
}

export const createTaskScene = new Scenes.WizardScene<BotContext>(
	'createTaskScene',

	async (ctx) => {
		await ctx.reply('✏️ Введи заголовок задачи:')
		return ctx.wizard.next()
	},

	async (ctx) => {
		const state = ctx.wizard.state as CreateTaskState

		state.title = getMessageText(ctx)

		await ctx.reply('📃 Введи описание задачи:')
		return ctx.wizard.next()
	},

	async (ctx) => {
		const state = ctx.wizard.state as CreateTaskState

		state.description = getMessageText(ctx)

		await ctx.reply('📆 Введи дату дедлайна (дд.мм.гггг):')
		return ctx.wizard.next()
	},

	async (ctx) => {
		const state = ctx.wizard.state as CreateTaskState

		const dateString = getMessageText(ctx)

		const match = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)

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

		state.deadline = deadline

		try {
			const result = await tasksService.createTask(
				state.title!,
				state.description!,
				state.deadline,
				ctx.from!.id
			)

			if (!result.success) {
				await ctx.reply('❌ Не удалось создать задачу: ' + result.reason)
				return ctx.scene.enter('menuScene')
			}

			await ctx.reply('✅ Задача успешно создана!')
		} catch (err) {
			console.error(err)
			await ctx.reply('❌ Ошибка при создании задачи')
		}

		return ctx.scene.enter('menuScene')
	}
)