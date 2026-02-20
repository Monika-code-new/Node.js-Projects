"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedis = createRedis;
const ioredis_1 = __importDefault(require("ioredis"));
const Logger_1 = require("../Observability/Logger");
function createRedis() {
    const redis = new ioredis_1.default({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    });
    const originalSend = redis.sendCommand.bind(redis);
    redis.sendCommand = async function (cmd) {
        const start = Date.now();
        try {
            const result = await originalSend(cmd);
            const duration = Date.now() - start;
            Logger_1.logger.info({
                type: "redis",
                command: cmd.name,
                duration
            });
            if (duration > 1000) {
                Logger_1.logger.warn({
                    type: "slow-redis",
                    command: cmd.name,
                    duration
                });
            }
            return result;
        }
        catch (error) {
            Logger_1.logger.error({
                type: "redis-error",
                command: cmd.name,
                error
            });
            throw error;
        }
    };
    return redis;
}
