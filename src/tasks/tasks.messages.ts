import type { BotContext } from "../config/types"
import { getSession } from "../utils/utils"
import { Markup } from "telegraf"

export function formatTask(title: string, description: string, deadline: Date): string {
    return (
        `✏️ Название: ${title}\n` +
        `📃 Описание: ${description}\n`+
        `📆 Дедлайн: ${Intl.DateTimeFormat('ru-RU').format(deadline)}`
    )
}

export async function renderCurrentTask(ctx: BotContext) {
  const state = getSession(ctx)
  const task = state.tasks[state.currentIndex]

  if (!task) {
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