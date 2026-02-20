import Redis from "ioredis";
import { logger } from "../Observability/Logger";

export function createRedis() {

  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  });

  const originalSend = redis.sendCommand.bind(redis);

  redis.sendCommand = async function (cmd: any) {

    const start = Date.now();

    try {
      const result = await originalSend(cmd);

      const duration = Date.now() - start;

      logger.info({
        type: "redis",
        command: cmd.name,
        duration
      });

      if (duration > 1000) {
        logger.warn({
          type: "slow-redis",
          command: cmd.name,
          duration
        });
      }

      return result;

    } catch (error) {

      logger.error({
        type: "redis-error",
        command: cmd.name,
        error
      });

      throw error;
    }
  };

  return redis;
}
