export function formatTask(title, description, deadline) {
    return (`✏️ Название: ${title}\n` +
        `📃 Описание: ${description}\n` +
        `📆 Дедлайн: ${Intl.DateTimeFormat('ru-RU').format(deadline)}`);
}
//# sourceMappingURL=tasks.messages.js.map