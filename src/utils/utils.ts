import type { BotContext } from "../config/types"

export function getMessageText(ctx: BotContext): string {
  if (!ctx.message || !("text" in ctx.message)) {
    ctx.reply("Отправь текст")
    throw new Error("Отправь текст")
  }

  return ctx.message.text
}