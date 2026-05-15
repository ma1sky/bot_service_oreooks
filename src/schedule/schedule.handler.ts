import { BaseHandler } from "../base/base.handler";
import type { BotContext } from "../config/types";
import { SessionData } from "../session/session";
import scheduleService from "./schedule.service";
import { formatSchedule } from "./schedule.messages";
import { Markup } from "telegraf";

export type ScheduleAction = 
    | "view"
    | "openToday"
    | "openTomorrow"
    | "openYesterday"
    | "openMenu"
    | "prevDay"
    | "nextDay";

export class ScheduleHandler extends BaseHandler {
    
    public actions: Record<ScheduleAction, (ctx: BotContext) => Promise<any>> = {
        view: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;
            
            await SessionData.update(tgId, {
                scene: "scheduleScene",
                step: "schedule"
            });
            
            await ctx.answerCbQuery();
            
            return this.actions.openToday(ctx);
        },
        
        openToday: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;
            const today = new Date();
            
            try {
                const result = await scheduleService.getSchedule(tgId, today);
                
                if (!result.success || !result.schedule) {
                    await ctx.reply(
                        `📭 Расписание на сегодня не найдено.\n${result.reason || ''}`,
                        { parse_mode: 'HTML' }
                    );
                    return;
                }
                
                const messageText = await formatSchedule(result.schedule);
                const keyboard = Markup.inlineKeyboard([
                    [
                        Markup.button.callback('◀️ Вчера', 'openYesterday'),
                        Markup.button.callback('📋 Меню', 'openMenu'),
                        Markup.button.callback('Завтра ▶️', 'openTomorrow'),
                    ],
                ]);
                
                try {
                    await ctx.editMessageText(messageText, {
                        parse_mode: 'HTML',
                        ...keyboard
                    });
                } catch (error) {
                    await ctx.reply(messageText, {
                        parse_mode: 'HTML',
                        ...keyboard
                    });
                }
                
            } catch (error) {
                console.error('Error fetching today schedule:', error);
                await ctx.reply(
                    '❌ Не удалось загрузить расписание на сегодня. Попробуйте позже.',
                    { parse_mode: 'HTML' }
                );
            }
            
            await ctx.answerCbQuery();
        },
        
        openTomorrow: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            try {
                const result = await scheduleService.getSchedule(tgId, tomorrow);
                
                if (!result.success || !result.schedule) {
                    await ctx.reply(
                        `📭 Расписание на завтра не найдено.\n${result.reason || ''}`,
                        { parse_mode: 'HTML' }
                    );
                    return;
                }
                
                const messageText = await formatSchedule(result.schedule);
                const keyboard = Markup.inlineKeyboard([
                    [
                        Markup.button.callback('◀️ Сегодня', 'openToday'),
                        Markup.button.callback('📋 Меню', 'openMenu'),
                        Markup.button.callback('Послезавтра ▶️', 'nextDay'),
                    ],
                ]);
                
                try {
                    await ctx.editMessageText(messageText, {
                        parse_mode: 'HTML',
                        ...keyboard
                    });
                } catch (error) {
                    await ctx.reply(messageText, {
                        parse_mode: 'HTML',
                        ...keyboard
                    });
                }
                
            } catch (error) {
                console.error('Error fetching tomorrow schedule:', error);
                await ctx.reply(
                    '❌ Не удалось загрузить расписание на завтра. Попробуйте позже.',
                    { parse_mode: 'HTML' }
                );
            }
            
            await ctx.answerCbQuery();
        },
        
        openYesterday: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            try {
                const result = await scheduleService.getSchedule(tgId, yesterday);
                
                if (!result.success || !result.schedule) {
                    await ctx.reply(
                        `📭 Расписание на вчера не найдено.\n${result.reason || ''}`,
                        { parse_mode: 'HTML' }
                    );
                    return;
                }
                
                const messageText = await formatSchedule(result.schedule);
                const keyboard = Markup.inlineKeyboard([
                    [
                        Markup.button.callback('◀️ Позавчера', 'prevDay'),
                        Markup.button.callback('📋 Меню', 'openMenu'),
                        Markup.button.callback('Сегодня ▶️', 'openToday'),
                    ],
                ]);
                
                try {
                    await ctx.editMessageText(messageText, {
                        parse_mode: 'HTML',
                        ...keyboard
                    });
                } catch (error) {
                    await ctx.reply(messageText, {
                        parse_mode: 'HTML',
                        ...keyboard
                    });
                }
                
            } catch (error) {
                console.error('Error fetching yesterday schedule:', error);
                await ctx.reply(
                    '❌ Не удалось загрузить расписание на вчера. Попробуйте позже.',
                    { parse_mode: 'HTML' }
                );
            }
            
            await ctx.answerCbQuery();
        },
        
        openMenu: async (ctx: BotContext) => {
            const tgId = ctx.from!.id;
            
            await SessionData.update(tgId, {
                scene: "menuScene",
                step: "enter"
            });
            
            await ctx.answerCbQuery();
            
            const { showMenu } = await import("../menu/menu.messages");
            await showMenu(ctx);
        },
        
        prevDay: async (ctx: BotContext) => {
            return this.actions.openYesterday(ctx);
        },
        
        nextDay: async (ctx: BotContext) => {
            return this.actions.openTomorrow(ctx);
        }
    };
    
    private navigation = {
        openMenu: this.actions.openMenu,
        prevDay: this.actions.prevDay,
        nextDay: this.actions.nextDay
    };
    
    override async handle(ctx: BotContext) {
        const tgId = ctx.from!.id;

        if ("callback_query" in ctx.update && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
            const data = ctx.callbackQuery.data;

            console.log(`[ScheduleHandler] Callback query received: ${data}, tgId: ${tgId}`);

            await ctx.answerCbQuery().catch(() => { });

            if (data in this.actions) {
                console.log(`[ScheduleHandler] Action found: ${data}`);
                return this.actions[data as ScheduleAction](ctx);
            }

            if (data in this.navigation) {
                console.log(`[ScheduleHandler] Navigation found: ${data}`);
                return this.navigation[data as keyof typeof this.navigation](ctx);
            }

            console.log(`[ScheduleHandler] Unknown callback data: ${data}`);
        }

        const session = await SessionData.get(tgId);
        const step = session?.step;
        const scene = session?.scene;

        console.log(`[ScheduleHandler] No callback query, scene: ${scene}, step: ${step}`);

        // If we're in schedule scene but no callback query, show today's schedule
        if (scene === "scheduleScene") {
            console.log(`[ScheduleHandler] In schedule scene, showing today's schedule`);
            return this.actions.openToday(ctx);
        }

        console.log(`[ScheduleHandler] No action taken`);
    }
}