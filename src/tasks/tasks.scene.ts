import { Scenes } from 'telegraf'
import type { BotContext, Task } from '../config/types'
import tasksService from './tasks.service'
import { getSession } from "../utils/utils"
import { renderCurrentTask } from './tasks.messages'

export const tasksScene = new Scenes.BaseScene<BotContext>('tasksScene')

tasksScene.enter(async (ctx) => {
  try {
    const tgId = ctx.from?.id

    if (!tgId) {
      await ctx.reply('Не удалось определить пользователя')
      return ctx.scene.enter('menuScene')
    }

    const res = await tasksService.getTasks(tgId)

    if (!res.success) {
      await ctx.reply('Ошибка загрузки задач: ' + String(res.reason))
      return ctx.scene.enter('menuScene')
    }

    const tasks: Task[] = Array.isArray(res.data?.tasks) ? res.data.tasks : []

    if (tasks.length === 0) {
      await ctx.reply('У вас пока нет задач')
      return ctx.scene.enter('menuScene')
    }

    const state = getSession(ctx)
    state.tasks = tasks
    state.currentIndex = 0

    await renderCurrentTask(ctx)
  } catch {
    await ctx.reply('Ошибка открытия задач')
    return ctx.scene.enter('menuScene')
  }
})

tasksScene.action('nextTask', async (ctx) => {
  await ctx.answerCbQuery()

  const state = getSession(ctx)

  if (state.currentIndex < state.tasks.length - 1) {
    state.currentIndex++
  }

  await renderCurrentTask(ctx)
})

tasksScene.action('prevTask', async (ctx) => {
  await ctx.answerCbQuery()

  const state = getSession(ctx)

  if (state.currentIndex > 0) {
    state.currentIndex--
  }

  await renderCurrentTask(ctx)
})

tasksScene.action('openMenu', async (ctx) => {
  await ctx.answerCbQuery()
  return ctx.scene.enter('menuScene')
})

tasksScene.action('deleteTask', async (ctx) => {
  await ctx.answerCbQuery()

  const tgId = ctx.from?.id
  if (!tgId) return

  const state = getSession(ctx)
  const task = state.tasks[state.currentIndex]

  if (!task?.id) return

  const res = await tasksService.deleteTask(tgId, task.id)

  if (!res.success) {
    await ctx.reply('Ошибка удаления задачи: ' + res.reason)
    return
  }

  state.tasks = state.tasks.filter((t: Task) => t.id !== task.id)

  if (state.tasks.length === 0) {
    await ctx.reply('Все задачи удалены')
    return ctx.scene.enter('menuScene')
  }

  state.currentIndex = Math.min(state.currentIndex, state.tasks.length - 1)

  await renderCurrentTask(ctx)
})

tasksScene.action('markComplete', async (ctx) => {
  await ctx.answerCbQuery();
  
})

tasksScene.action('editTask', async (ctx) => {
  await ctx.answerCbQuery()

  const state = getSession(ctx)
  const task = state.tasks[state.currentIndex]

  if (!task?.id) return

  return ctx.scene.enter('editTaskScene', {
    taskId: task.id
  })
})