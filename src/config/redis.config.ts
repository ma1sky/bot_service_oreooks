import Redis from 'ioredis';
import { REDIS_LINK } from './env.config';

export default new Redis(REDIS_LINK);
