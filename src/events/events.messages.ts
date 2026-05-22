import { Event } from './events.schema';
export function formatEvents(events: Event[], date: Date): string {
  if (events.length === 0) {
    return `📭 На ${date.toLocaleDateString('ru-RU')} событий нет.`;
  }
  const header = `<b>📅 События на ${date.toLocaleDateString('ru-RU')}</b>\n\n`;
  const lines = events.map((event, index) => {
    const gradeInfo = event.currentGrade !== null 
      ? `${event.currentGrade}/${event.maxGrade}` 
      : `—/${event.maxGrade}`;
    return (
      `<b>${index + 1}.</b> <code>${event.type}</code>\n` +
      `   ${event.name || event.alias || 'Без названия'}\n` +
      `   📊 Оценка: ${gradeInfo}\n`
    );
  }).join('\n');
  return header + lines;
}