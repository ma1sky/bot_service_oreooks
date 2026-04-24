import type { BotContext } from "../../config/types.js"

export function getMessageText(ctx: BotContext): string {
  if (!ctx.message || !("text" in ctx.message)) {
    ctx.reply("Отправь текст")
    throw new Error("Отправь текст")
  }

  return ctx.message.text
}

export function getSession(ctx: BotContext) {
  if (!ctx.scene.session.tasksScene) {
    ctx.scene.session.tasksScene = {
      tasks: [],
      currentIndex: 0
    }
  }

  return ctx.scene.session.tasksScene
}