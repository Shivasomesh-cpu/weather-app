import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config();

const ttl = parseInt(process.env.CACHE_TTL || '600', 10);
const cache = new NodeCache({ stdTTL: ttl });

export const cacheService = {
    get: <T>(key: string): T | undefined => {
        return cache.get<T>(key);
    },

    set: <T>(key: string, value: T, customTTL?: number): boolean => {
        return cache.set(key, value, customTTL || ttl);
    },

    del: (key: string): number => {
        return cache.del(key);
    },

    flush: (): void => {
        cache.flushAll();
    },

    generateKey: (prefix: string, params: Record<string, any>): string => {
        const sortedKeys = Object.keys(params).sort();
        const keyString = sortedKeys.map(key => `${key}:${params[key]}`).join(':');
        return `${prefix}:${keyString}`;
    }
};
