"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
exports.redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    cacheTTL: parseInt(process.env.CACHE_TTL || '60', 10),
    ttl: {
        regions: Number(process.env.REGION_CACHE_TTL) || 1200,
        airports: Number(process.env.AIRPORT_CACHE_TTL) || 1200,
        ivector: Number(process.env.IVECTOR_CACHE_TTL) || 60,
    },
};
