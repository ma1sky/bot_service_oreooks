export function formatTask(title: string, description: string, deadline: Date): string {
    return (
        `✏️ Название: ${title}\n` +
        `📃 Описание: ${description}\n`+
        `📆 Дедлайн: ${Intl.DateTimeFormat('ru-RU').format(deadline)}`
    )
}