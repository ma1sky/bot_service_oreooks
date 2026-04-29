import { Scenes } from 'telegraf'
import type { BotContext, Task } from '../config/types'
import tasksService from './tasks.service'
import { getMessageText } from '../utils/utils'

type EditTaskState = {
  taskId?: number
  title?: string
  description?: string
  deadline?: Date
}

export const editTaskScene = new Scenes.WizardScene<BotContext>(
  'editTaskScene',

  async (ctx) => {
    await ctx.reply('✏️ Введи заголовок задачи:')
    return ctx.wizard.next()
  },

  async (ctx) => {
    const state = ctx.wizard.state as EditTaskState

    state.title = getMessageText(ctx)

    await ctx.reply('📃 Введи описание задачи:')
    return ctx.wizard.next()
  },

  async (ctx) => {
    const state = ctx.wizard.state as EditTaskState

    state.description = getMessageText(ctx)

    await ctx.reply('📆 Введи дату дедлайна (дд.мм.гггг):')
    return ctx.wizard.next()
  },

  async (ctx) => {
    const state = ctx.wizard.state as EditTaskState

    const dateString = getMessageText(ctx)

    const match = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)

    if (!match) {
      await ctx.reply('❌ Неверный формат даты')
      return
    }

    const [, dd, mm, yyyy] = match
    const deadline = new Date(Number(yyyy), Number(mm) - 1, Number(dd))

    if (isNaN(deadline.getTime())) {
      await ctx.reply('❌ Некорректная дата')
      return
    }

    state.deadline = deadline

    if (!state.taskId) {
      await ctx.reply('❌ Задача не найдена')
      return ctx.scene.enter('tasksScene')
    }

    try {
      const task: Task = {
        id: state.taskId,
        title: state.title!,
        description: state.description!,
        deadline: state.deadline!
      }

      const result = await tasksService.updateTask(task, ctx.from!.id)

      if (!result.success) {
        await ctx.reply('❌ Не удалось отредактировать задачу: ' + result.reason)
        return ctx.scene.enter('menuScene')
      }

      await ctx.reply('✅ Задача успешно отредактирована!')
    } catch {
      await ctx.reply('❌ Не удалось отредактировать задачу')
    }

    return ctx.scene.enter('menuScene')
  }
)