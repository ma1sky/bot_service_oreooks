import Redis from "ioredis";
import { REDIS_LINK } from "./env.config.js";

export const redis = new Redis()