export function getMessageText(ctx) {
    if (!ctx.message || !('text' in ctx.message)) {
        ctx.reply('Отправь текст');
        throw Error('Отправь текст');
    }
    return ctx.message.text;
}
export function getSession(ctx) {
    if (!ctx.scene.session.tasksScene) {
        ctx.scene.session.tasksScene = {
            tasks: [],
            currentIndex: 0,
        };
    }
    return ctx.scene.session.tasksScene;
}
//# sourceMappingURL=utils.js.map