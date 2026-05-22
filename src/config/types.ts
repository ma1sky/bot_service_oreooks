import { Context } from 'telegraf';
export type BotContext = Context & {
	session: SessionDraft;
};
export type SceneHandler = (ctx: BotContext) => Promise<void>;
export type AuthStep = 'login' | 'password';
export type TaskStep = 'title' | 'description' | 'deadline' | 'create' | 'view';
export type SessionScenes =
	| 'authScene'
	| 'menuScene'
	| 'scheduleScene'
	| 'tasksScene'
	| 'eventsScene';
export type MenuStep = 'enter' | 'idle';
export type SessionDraft =
	| { scene: SessionScenes; step: AuthStep }
	| { scene: SessionScenes; step: TaskStep }
	| { scene: SessionScenes; step: MenuStep }
	| { scene: SessionScenes; step: 'schedule' }
	| { scene: SessionScenes; step: 'tasks' }
	| { scene: SessionScenes; step: 'events' };
export type Schedule = {
	week: number;
	weekType: string;
	dayOfWeek: string;
	date: Date;
	lessons: {
		lesson_name: string;
		lesson_type: string;
		lesson_number: number;
		start: Date;
		end: Date;
		teacher: string;
		classroom: string;
	}[];
};