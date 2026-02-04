"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRedis = initRedis;
const ioredis_1 = __importDefault(require("ioredis"));
const RedisConfig_1 = require("./Config/RedisConfig");
const redis = new ioredis_1.default({
    host: RedisConfig_1.redisConfig.host,
    port: RedisConfig_1.redisConfig.port,
    lazyConnect: true,
});
async function initRedis() {
    await redis.connect();
    console.log('Redis connected');
}
exports.default = redis;
