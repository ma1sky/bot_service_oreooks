import { REDIS_LINK } from "./env.config.js";

const Redis = require("ioredis");
export default new Redis(REDIS_LINK);