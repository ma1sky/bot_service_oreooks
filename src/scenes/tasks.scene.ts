import { Markup, Scenes } from 'telegraf'
import type { BotContext, Task } from '../config/types.js'
import { formatTask } from '../messages/tasks.messages.js'
import tasksService from '../services/tasks.service.js'
import { getSession } from './utils/utils.js'

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
  } catch (error) {
    console.error(error)
    await ctx.reply('Ошибка открытия задач')
    return ctx.scene.enter('menuScene')
  }
})

async function renderCurrentTask(ctx: BotContext) {
  const state = getSession(ctx)
  const task = state.tasks[state.currentIndex]

  if (!task || !task.id) {
    await ctx.reply('Задача не найдена')
    return ctx.scene.enter('menuScene')
  }

  const total = state.tasks.length
  const index = state.currentIndex + 1

  await ctx.reply(
    `📚 Задача ${index}/${total}, ID:${task.id}\n\n` +
      formatTask(
        task.title ?? '',
        task.description ?? '',
        task.deadline ? new Date(task.deadline) : new Date()
      ),
    Markup.inlineKeyboard([
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


if (!task?.id) return

state.tasks = state.tasks.filter((t: Task) => t.id !== task.id)
  
  if (state.tasks.length === 0) {
    await ctx.reply('Все задачи удалены')
    return ctx.scene.enter('menuScene')
  }

  state.currentIndex = Math.min(state.currentIndex, state.tasks.length - 1)

  await renderCurrentTask(ctx)
})

tasksScene.action('markComplete', async (ctx) => {
  await ctx.answerCbQuery('Пока не реализовано')
})

tasksScene.action('editTask', async (ctx) => {
  await ctx.answerCbQuery()
  return ctx.scene.enter('editTaskScene')
})