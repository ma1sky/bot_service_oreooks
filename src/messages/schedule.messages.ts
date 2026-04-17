import type { Schedule } from "../types.js"

export async function formatSchedule(schedule: Schedule): Promise<string> {
  return `<b>📆 [${schedule.dayOfWeek}] ${Intl.DateTimeFormat('ru-RU').format(schedule.date)}</b>\n` +
    `— Неделя №${schedule.week}\n` +
    `— ${schedule.weekType}\n` +
    schedule.lessons.map(lesson => {
      return `\n<b>${lesson.lesson_number}.</b> <code>[ ${lesson.lesson_type} ] <b>${lesson.lesson_name}</b> </code>\n` +
        `🏫  ${lesson.classroom}\n` +
        `⏰  ${lesson.start.getHours()}:${lesson.start.getMinutes()} — ${lesson.end.getHours()}:${lesson.end.getMinutes()}\n` +
        `👨‍🏫  ${lesson.teacher}\n`
    }).join('\n')
};