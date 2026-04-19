import dotenv from 'dotenv';
dotenv.config();
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const API_SERVICE_LINK = process.env.API_SERVICE_LINK;
if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN is missing in env');
}
if (!API_SERVICE_LINK) {
    throw new Error('API_SERVICE_LINK is missing in env');
}
//# sourceMappingURL=env.config.js.map