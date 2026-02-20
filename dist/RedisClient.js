"use strict";
/* import Redis from "ioredis";
import { redisConfig } from "./Config/RedisConfig";
import newrelic from "newrelic";
import { logger } from "./Logging/Pino"; // adjust path if needed

const redis = new Redis({
 host: redisConfig.host,
 port: redisConfig.port,
 lazyConnect: true,
});

export async function initRedis() {
 try {
   await redis.connect();
   logger.info({ event: "REDIS_CONNECTED" });
 } catch (err) {
   logger.error({ event: "REDIS_CONNECT_ERROR", err });
   newrelic.noticeError(err as Error);
   throw err;
 }
}


const originalSend = redis.sendCommand.bind(redis);

redis.sendCommand = function (cmd: any) {
 const start = Date.now();

 return newrelic.startSegment(
   `Redis/${cmd.name}`,
   true,
   async () => {
     try {
       const result = await originalSend(cmd);

       const duration = Date.now() - start;

       // slow redis detection
       if (duration > 500) {
         logger.warn({
           type: "slow-redis",
           command: cmd.name,
           args: cmd.args,
           duration
         });
       }

       return result;

     } catch (err) {
       logger.error({
         type: "redis-error",
         command: cmd.name,
         args: cmd.args,
         err
       });

       newrelic.noticeError(err as Error);
       throw err;
     }
   }
 );
};

export default redis;
*/
/* import Redis from "ioredis";
import newrelic from "newrelic";
import { logger } from "./Logging/Pino";
import { redisConfig } from "./Config/RedisConfig";

export const redis = new Redis({
 host: redisConfig.host,
 port: redisConfig.port,
 lazyConnect: true
});


export async function initRedis() {
 try {
  await redis.connect();
  logger.info({ event: "REDIS_CONNECTED" });

 } catch (err) {

  logger.error({
   event: "REDIS_CONNECT_ERROR",
   err
  });

  newrelic.noticeError(err as Error);

  throw err;
 }
}




const originalSend = redis.sendCommand.bind(redis);

redis.sendCommand = async function (cmd: any) {

 const start = Date.now();

 try {

  const result = await originalSend(cmd);

  const duration = Date.now() - start;

  logger.info({
   type: "redis",
   command: cmd.name,
   args: cmd.args,
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

  newrelic.noticeError(error as Error);

  throw error;
 }
};
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
/* import Redis from "ioredis";
import { redisConfig } from "./Config/RedisConfig";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const redis = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  lazyConnect: true,
});


//  LOGGING MIDDLEWARE
const originalSend = redis.sendCommand.bind(redis);

redis.sendCommand = async function (cmd: any) {
  const start = Date.now();

  try {
    const result = await originalSend(cmd);

    // store success log
    await prisma.redisLog.create({
      data: {
        command: cmd.name,
        args: cmd.args,
        status: "SUCCESS",
        duration: Date.now() - start,
      },
    });

    return result;

  } catch (error: any) {

    // store error log
    await prisma.redisLog.create({
      data: {
        command: cmd.name,
        args: cmd.args,
        status: "ERROR",
        duration: Date.now() - start,
        error: error.message,
      },
    });

    throw error;
  }
};


// ---- CONNECT FUNCTION ----
export async function initRedis() {
  await redis.connect();
  console.log("Redis connected");
}

export default redis;
 */
/* import Redis from "ioredis";
import { logger } from "./Logging/Pino";
import newrelic from "newrelic";

// Use environment variables or your config
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

export const redis = new Redis({
  host: redisHost,
  port: redisPort,
  lazyConnect: true, // connect only when needed
});

//CONNECT FUNCTION
export async function initRedis() {
  try {
    await redis.connect();
    logger.info({ event: "REDIS_CONNECTED" });
  } catch (err) {
    logger.error({ event: "REDIS_CONNECT_ERROR", err });
    newrelic.noticeError(err as Error);
    throw err;
  }
}

//COMMAND LOGGER
const originalSend = redis.sendCommand.bind(redis);

redis.sendCommand = async function (cmd: any) {
  const start = Date.now();

  // Log the command before execution
  logger.debug({ type: "redis-command", command: cmd.name, args: cmd.args });

  try {
    const result = await originalSend(cmd);
    const duration = Date.now() - start;

    // Log normal execution
    logger.info({
      type: "redis",
      command: cmd.name,
      args: cmd.args,
      duration,
      resultLength: Array.isArray(result) ? result.length : undefined,
    });

    // Warn on slow commands
    if (duration > 1000) {
      logger.warn({
        type: "slow-redis",
        command: cmd.name,
        args: cmd.args,
        duration,
      });
    }

    // Warn if result is empty (for arrays)
    if (Array.isArray(result) && result.length === 0) {
      logger.warn({
        type: "empty-redis-result",
        command: cmd.name,
        args: cmd.args,
        message: "Command returned empty array",
      });
    }

    return result;
  } catch (error) {
    logger.error({
      type: "redis-error",
      command: cmd.name,
      args: cmd.args,
      error,
    });

    newrelic.noticeError(error as Error);
    throw error;
  }
};
 */
/* import Redis from "ioredis";
import { logger } from "./Observability/Logger";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});

redis.on("connect", () =>
  logger.info("Redis connected")
);

redis.on("error", err =>
  logger.error("Redis connection error", { message: err.message })
); */
/* import Redis from "ioredis";
import { logger } from "./Observability/Logger";


export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});


redis.on("connect", () => {
  return logger.info({ type: "redis" }, "Redis connected");
});

redis.on("error", err => {
  logger.error(
    { type: "redis", err: err.message },
    "Redis connection error"
  );
});


const originalSend = (redis as any).sendCommand.bind(redis);

(redis as any).sendCommand = async function (command: any) {
  const start = Date.now();

  try {
    const result = await originalSend(command);

    const duration = Date.now() - start;

    logger.info({
      type: "redis",
      command: command.name,
      args: command.args,
      durationMs: duration
    }, "Redis command executed");

    // slow command detector
    if (duration > 200) {
      logger.warn({
        type: "redis",
        command: command.name,
        durationMs: duration
      }, "Slow Redis command");
    }

    return result;

  } catch (err: any) {
    logger.error({
      type: "redis",
      command: command.name,
      args: command.args,
      error: err.message
    }, "Redis command failed");

    throw err;
  }
};
 */
/* import Redis from "ioredis";
import { logger } from "./Observability/Logger";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});

//
redis.on("connect", () => {
  logger.info({ type: "redis" }, "Redis connected");
});

redis.on("error", (err: Error) => {
  logger.error({ type: "redis", err: err.message }, "Redis connection error");
});

//
const originalSend = (redis as any).sendCommand.bind(redis);

(redis as any).sendCommand = async function (command: any) {
  const start = Date.now();

  try {
    const result = await originalSend(command);
    const duration = Date.now() - start;

    logger.info(
      {
        type: "redis",
        command: command.name,
        args: command.args,
        durationMs: duration
      },
      "Redis command executed"
    );

    if (duration > 200) {
      logger.warn(
        {
          type: "redis",
          command: command.name,
          durationMs: duration
        },
        "Slow Redis command"
      );
    }

    return result;
  } catch (err: any) {
    logger.error(
      {
        type: "redis",
        command: command.name,
        args: command.args,
        error: err.message
      },
      "Redis command failed"
    );

    throw err;
  }
};
 */
const ioredis_1 = __importDefault(require("ioredis"));
const Logger_1 = require("./Observability/Logger");
const Context_1 = require("./Observability/Context");
exports.redis = new ioredis_1.default({
    host: "127.0.0.1",
    port: 6379
});
/* connection logs */
exports.redis.on("connect", () => {
    Logger_1.logger.info("Redis connected", { type: "redis" });
});
exports.redis.on("error", (err) => {
    Logger_1.logger.error("Redis connection error", {
        type: "redis",
        error: err.message
    });
});
/* command logger + requestId */
const originalSend = exports.redis.sendCommand.bind(exports.redis);
exports.redis.sendCommand = async function (command) {
    const start = Date.now();
    const requestId = (0, Context_1.getRequestId)();
    try {
        const result = await originalSend(command);
        const duration = Date.now() - start;
        Logger_1.logger.info("Redis command executed", {
            type: "redis",
            requestId,
            functionName: `Redis.${command.name}`,
            command: command.name,
            args: command.args,
            durationMs: duration
        });
        if (duration > 200) {
            Logger_1.logger.warn("Slow Redis command", {
                type: "redis",
                requestId,
                functionName: `Redis.${command.name}`,
                command: command.name,
                durationMs: duration
            });
        }
        return result;
    }
    catch (err) {
        Logger_1.logger.error("Redis command failed", {
            type: "redis",
            requestId,
            functionName: `Redis.${command.name}`,
            command: command.name,
            args: command.args,
            error: err.message
        });
        throw err;
    }
};
