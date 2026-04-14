import { Markup, Scenes } from 'telegraf'
import type { SessionContext } from '../context.js';

export const createTask = new Scenes.WizardScene<SessionContext>('createTaskScene');

createTask.enter(async ctx => {
    await ctx.reply(' ');
})