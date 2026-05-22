import { BaseHandler } from '../base/base.handler';
import type { BotContext } from '../config/types';
import { SessionData } from '../session/session';
import eventsService from './events.service';
import { formatEvents } from './events.messages';
import { Markup } from 'telegraf';
import { EventsAction } from './events.types';

export class EventsHandler extends BaseHandler {
  public actions: Record<EventsAction, (ctx: BotContext) => Promise<void>> = {
    view: async (ctx: BotContext) => {
      const tgId = ctx.from!.id;

      await SessionData.update(tgId, {
        scene: 'eventsScene',
        step: 'events',
      });

      return this.actions.openToday(ctx);
    },

    openToday: async (ctx: BotContext) => {
      const tgId = ctx.from!.id;
      const today = new Date();

      try {
        const result = await eventsService.getEvents(tgId, today);

        if (!result.success || !result.events) {
          ctx.reply(`📭 Событий на сегодня нет.\n${result.reason || ''}`, {
            parse_mode: 'HTML',
          });
          return;
        }

        const messageText = formatEvents(result.events, today);

        const keyboard = Markup.inlineKeyboard([
          [
            Markup.button.callback('◀️', 'openYesterday'),
            Markup.button.callback('📋 Меню', 'openMenu'),
            Markup.button.callback('▶️', 'openTomorrow'),
          ],
        ]);

        try {
          await ctx.editMessageText(messageText, {
            parse_mode: 'HTML',
            ...keyboard,
          });
        } catch {
          await ctx.reply(messageText, {
            parse_mode: 'HTML',
            ...keyboard,
          });
        }
      } catch (error) {
        console.error('Error fetching today events:', error);
        await ctx.reply('❌ Не удалось загрузить события на сегодня. Попробуйте позже.');
      }
    },

    openTomorrow: async (ctx: BotContext) => {
      const tgId = ctx.from!.id;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      try {
        const result = await eventsService.getEvents(tgId, tomorrow);

        if (!result.success || !result.events) {
          ctx.reply(`📭 Событий на завтра нет.\n${result.reason || ''}`, {
            parse_mode: 'HTML',
          });
          return;
        }

        const messageText = formatEvents(result.events, tomorrow);

        const keyboard = Markup.inlineKeyboard([
          [
            Markup.button.callback('◀️', 'openToday'),
            Markup.button.callback('📋 Меню', 'openMenu'),
            Markup.button.callback('▶️', 'nextDay'),
          ],
        ]);

        try {
          await ctx.editMessageText(messageText, {
            parse_mode: 'HTML',
            ...keyboard,
          });
        } catch {
          await ctx.reply(messageText, {
            parse_mode: 'HTML',
            ...keyboard,
          });
        }
      } catch (error) {
        console.error('Error fetching tomorrow events:', error);
        await ctx.reply('❌ Не удалось загрузить события на завтра. Попробуйте позже.');
      }
    },

    openYesterday: async (ctx: BotContext) => {
      const tgId = ctx.from!.id;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      try {
        const result = await eventsService.getEvents(tgId, yesterday);

        if (!result.success || !result.events) {
          ctx.reply(`📭 Событий на вчера нет.\n${result.reason || ''}`, {
            parse_mode: 'HTML',
          });
          return;
        }

        const messageText = formatEvents(result.events, yesterday);

        const keyboard = Markup.inlineKeyboard([
          [
            Markup.button.callback('◀️', 'prevDay'),
            Markup.button.callback('📋 Меню', 'openMenu'),
            Markup.button.callback('Сегодня ▶️', 'openToday'),
          ],
        ]);

        try {
          await ctx.editMessageText(messageText, {
            parse_mode: 'HTML',
            ...keyboard,
          });
        } catch {
          await ctx.reply(messageText, {
            parse_mode: 'HTML',
            ...keyboard,
          });
        }
      } catch (error) {
        console.error('Error fetching yesterday events:', error);
        await ctx.reply('❌ Не удалось загрузить события на вчера. Попробуйте позже.');
      }
    },

    openMenu: async (ctx: BotContext) => {
      const tgId = ctx.from!.id;

      await SessionData.update(tgId, {
        scene: 'menuScene',
        step: 'enter',
      });

      const { showMenu } = await import('../menu/menu.messages');
      await showMenu(ctx);
    },

    prevDay: async (ctx: BotContext) => {
      // For now, just navigate to yesterday
      return this.actions.openYesterday(ctx);
    },

    nextDay: async (ctx: BotContext) => {
      // For now, just navigate to tomorrow
      return this.actions.openTomorrow(ctx);
    },
  };

  override async handle(ctx: BotContext) {
    const tgId = ctx.from!.id;

    if ('callback_query' in ctx.update && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const data = ctx.callbackQuery.data;

      console.log(`[EventsHandler] Callback query: ${data}, tgId: ${tgId}`);

      await ctx.answerCbQuery().catch(() => {});

      if (data in this.actions) {
        return this.actions[data as EventsAction](ctx);
      }

      console.log(`[EventsHandler] Unknown callback data: ${data}`);
      return;
    }

    return this.actions.openToday(ctx);
  }
}
