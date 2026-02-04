"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.getCache = void 0;
const RedisClient_1 = __importDefault(require("../RedisClient"));
const getCache = async (key) => {
    const data = await RedisClient_1.default.get(key);
    return data ? JSON.parse(data) : null;
};
exports.getCache = getCache;
const setCache = async (key, data, ttl) => {
    await RedisClient_1.default.set(key, JSON.stringify(data), 'EX', ttl);
};
exports.setCache = setCache;
