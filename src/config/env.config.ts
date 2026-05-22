import dotenv from 'dotenv';
dotenv.config();
export const BOT_TOKEN: string = process.env.BOT_TOKEN as string;
export const API_SERVICE_LINK: string = process.env.API_SERVICE_LINK as string;
export const REDIS_LINK: string = process.env.REDIS_LINK as string;
if (!BOT_TOKEN) {
	throw new Error('BOT_TOKEN is missing in env');
}
if (!API_SERVICE_LINK) {
	throw new Error('API_SERVICE_LINK is missing in env');
}
if (!REDIS_LINK) {
	throw new Error('REDIS_LINK is missing in env');
}