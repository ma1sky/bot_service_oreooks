export type Schedule = {
    week: number,
    weekType: number,
    dayOfWeek: string,
    date: Date,
    lessons: {
        lesson_name: string
        lesson_type: string,
        start: Date,
        end: Date
        teacher: string,
        classroom: string
    }[]
}

export async function getTodaySchedule(): Promise<string> {
    return formatSchedule(mockSchedule);
} 

export async function formatSchedule(params: Schedule): Promise<string> {
  return `<b>📆 Расписание на [${params.dayOfWeek}] ${Intl.DateTimeFormat('ru-RU').format(params.date)}</b>\n` +
    `Неделя №${params.week}\n` +
    `${params.weekType}\n` +
    params.lessons.map((lesson, i) => {
        return `\n<b>${i}.</b> [ ${lesson.lesson_type} ] <b>${lesson.lesson_name}</b>\n`+
            `🏫 <code>${lesson.classroom}</code>\n`+
            `⏰ <i>${lesson.start.getHours()}:${lesson.start.getMinutes()} — ${lesson.end.getHours()}:${lesson.end.getMinutes()}</i>\n`+
            `👨‍🏫 ${lesson.teacher}\n`
    }).join()
};

export const mockSchedule: Schedule = {
  week: 1,
  weekType: 0,
  dayOfWeek: "Понедельник",
  date: new Date("2026-04-16T00:00:00Z"),
  lessons: [
    {
      lesson_name: "Системы управления базами данных",
      lesson_type: "Лек",
      start: new Date("2026-04-16T09:00:00"),
      end: new Date("2026-04-16T10:20:00"),
      teacher: "Киселев Денис Викторович",
      classroom: "1205 м",
    },
    {
      lesson_name: "Микропроцессорные средства и системы",
      lesson_type: "Лек",
      start: new Date("2026-04-16T10:30:00"),
      end: new Date("2026-04-16T11:50:00"),
      teacher: "Орлов Александр Николаевич",
      classroom: "1205 м",
    },
    {
      lesson_name: "Индивидуальные виды спорта / Командные виды спорта",
      lesson_type: "Практика",
      start: new Date("2026-04-16T14:00:00"),
      end: new Date("2026-04-16T15:20:00"),
      teacher: "Преподаватель ФВ",
      classroom: "5101",
    },
  ],
};