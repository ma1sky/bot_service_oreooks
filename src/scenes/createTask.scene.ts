import { Markup, Scenes } from 'telegraf'
import type { SessionContext } from '../context.js';

export const createTaskScene = new Scenes.WizardScene<SessionContext>(
    'createTaskScene',
    
    async ctx => {
        ctx.reply('ewqewq');
        return ctx.wizard.next();
    }
);