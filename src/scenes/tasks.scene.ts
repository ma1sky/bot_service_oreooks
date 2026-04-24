import { Markup, Scenes } from 'telegraf'
import type { BotContext, Task } from '../config/types.js'
import { formatTask } from '../messages/tasks.messages.js'
import tasksService from '../services/tasks.service.js'
import { getSession } from './utils/utils.js'

export const tasksScene = new Scenes.BaseScene<BotContext>('tasksScene')

tasksScene.enter(async (ctx) => {
  console.log('\n================ ENTER TASKS SCENE ================')
  console.log('FROM:', ctx.from)

  try {
    const tgId = ctx.from?.id

    if (!tgId) {
      console.log('❌ NO TG ID')
      await ctx.reply('Не удалось определить пользователя')
      return ctx.scene.enter('menuScene')
    }

    const res = await tasksService.getTasks(tgId)

    console.log('TASKS SERVICE RESPONSE:', res)

    if (!res.success) {
      console.log('❌ SERVICE FAILED:', res.reason)
      await ctx.reply('Ошибка загрузки задач: ' + String(res.reason))
      return ctx.scene.enter('menuScene')
    }

    const tasks: Task[] = Array.isArray(res.data?.tasks) ? res.data.tasks : []

    console.log('TASKS LOADED:', tasks.length)
    console.log('TASKS:', tasks)

    if (tasks.length === 0) {
      console.log('⚠️ EMPTY TASK LIST')
      await ctx.reply('У вас пока нет задач')
      return ctx.scene.enter('menuScene')
    }

    const state = getSession(ctx)

    console.log('SESSION BEFORE SET:', state)

    state.tasks = tasks
    state.currentIndex = 0

    console.log('SESSION AFTER SET:', state)

    await renderCurrentTask(ctx)
  } catch (error) {
    console.error('❌ ENTER ERROR:', error)
    await ctx.reply('Ошибка открытия задач')
    return ctx.scene.enter('menuScene')
  }
})

async function renderCurrentTask(ctx: BotContext) {
  const state = getSession(ctx)

  console.log('\n================ RENDER TASK ================')
  console.log('SESSION STATE:', state)

  const task = state.tasks[state.currentIndex]

  console.log('CURRENT INDEX:', state.currentIndex)
  console.log('SELECTED TASK:', task)

  if (!task) {
    console.log('❌ TASK NOT FOUND BY INDEX')
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

  console.log('\n================ NEXT TASK ================')
  console.log('BEFORE:', state.currentIndex)

  if (state.currentIndex < state.tasks.length - 1) {
    state.currentIndex++
  }

  console.log('AFTER:', state.currentIndex)

  await renderCurrentTask(ctx)
})

tasksScene.action('prevTask', async (ctx) => {
  await ctx.answerCbQuery()

  const state = getSession(ctx)

  console.log('\n================ PREV TASK ================')
  console.log('BEFORE:', state.currentIndex)

  if (state.currentIndex > 0) {
    state.currentIndex--
  }

  console.log('AFTER:', state.currentIndex)

  await renderCurrentTask(ctx)
})

tasksScene.action('openMenu', async (ctx) => {
  await ctx.answerCbQuery()
  console.log('➡️ OPEN MENU')
  return ctx.scene.enter('menuScene')
})

tasksScene.action('deleteTask', async (ctx) => {
  await ctx.answerCbQuery()

  console.log('\n================ DELETE TASK ================')

  const tgId = ctx.from?.id
  if (!tgId) {
    console.log('❌ NO TG ID')
    return
  }

  const state = getSession(ctx)
  const task = state.tasks[state.currentIndex]

  console.log('STATE:', state)
  console.log('TASK TO DELETE:', task)

  if (!task?.id) {
    console.log('❌ NO TASK ID')
    return
  }

  const res = await tasksService.deleteTask(tgId, task.id)

  console.log('DELETE RESPONSE:', res)

  if (!res.success) {
    console.log('❌ DELETE FAILED')
    await ctx.reply('Ошибка удаления задачи: ' + res.reason)
    return
  }

  state.tasks = state.tasks.filter(t => t.id !== task.id)

  console.log('TASKS AFTER DELETE:', state.tasks.length)

  if (state.tasks.length === 0) {
    console.log('⚠️ ALL TASKS DELETED')
    await ctx.reply('Все задачи удалены')
    return ctx.scene.enter('menuScene')
  }

  state.currentIndex = Math.min(state.currentIndex, state.tasks.length - 1)

  console.log('NEW INDEX:', state.currentIndex)

  await renderCurrentTask(ctx)
})

tasksScene.action('markComplete', async (ctx) => {
  await ctx.answerCbQuery()
  console.log('⚠️ MARK COMPLETE (NOT IMPLEMENTED)')
})

tasksScene.action('editTask', async (ctx) => {
  await ctx.answerCbQuery()

  const state = getSession(ctx)
  const task = state.tasks[state.currentIndex]

  console.log('\n================ EDIT TASK ================')
  console.log('TASK:', task)

  if (!task?.id) {
    console.log('❌ NO TASK ID')
    return
  }

  console.log('➡️ ENTER EDIT SCENE WITH ID:', task.id)

  return ctx.scene.enter('editTaskScene', {
    taskId: task.id
  })
})