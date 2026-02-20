"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.getCache = void 0;
const RedisClient_1 = require("../RedisClient");
const getCache = async (key) => {
    const data = await RedisClient_1.redis.get(key);
    return data ? JSON.parse(data) : null;
};
exports.getCache = getCache;
const setCache = async (key, data, ttl) => {
    await RedisClient_1.redis.set(key, JSON.stringify(data), 'EX', ttl);
};
exports.setCache = setCache;
