import { formatSchedule } from "../messages/schedule.messages.js";
import { API_SERVICE_LINK } from "../config/env.config.js";
export async function getSchedule(id, date) {
    const res = await fetch(`${API_SERVICE_LINK}/user/${id}/schedule/${date.toString()}`, {
        method: 'GET'
    });
    if (!res.ok)
        throw new Error('Error with receiving schedule');
    const data = await res.json();
    return formatSchedule(data);
}
export const mockSchedule = {
    week: 1,
    weekType: '2 знаменатель',
    dayOfWeek: "ПН",
    date: new Date("2026-04-16T00:00:00Z"),
    lessons: [
        {
            lesson_name: "Системы управления базами данных",
            lesson_type: "Лек",
            lesson_number: 1,
            start: new Date("2026-04-16T09:00:00"),
            end: new Date("2026-04-16T10:20:00"),
            teacher: "Киселев Денис Викторович",
            classroom: "1205 м",
        },
        {
            lesson_name: "Микропроцессорные средства и системы",
            lesson_type: "Лек",
            lesson_number: 2,
            start: new Date("2026-04-16T10:30:00"),
            end: new Date("2026-04-16T11:50:00"),
            teacher: "Орлов Александр Николаевич",
            classroom: "1205 м",
        },
        {
            lesson_name: "Индивидуальные виды спорта / Командные виды спорта",
            lesson_type: "Практика",
            lesson_number: 4,
            start: new Date("2026-04-16T14:00:00"),
            end: new Date("2026-04-16T15:20:00"),
            teacher: "Преподаватель ФВ",
            classroom: "5101",
        },
    ],
};
//# sourceMappingURL=schedule.service.js.map