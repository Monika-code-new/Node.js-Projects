
/* import "newrelic"  // ← ADD THIS LINE FIRST

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { errorHandler } from './Utils/ErrorHandler';
import fastifyLoggerConfig from './Utils/FastifyLoggerConfig';
import redis, { initRedis } from './RedisClient';
import AllRoutes from './Routes';
import newRelicPlugin from "./Plugins/NewRelic"

async function start() {

  await initRedis();

  const app = Fastify({
    logger: fastifyLoggerConfig
  });
   await app.register(newRelicPlugin); // ← ADD
  await app.register(cors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  });

  app.decorate('redis', redis);

  app.setErrorHandler(errorHandler);

  app.register(AllRoutes, { prefix: '/api' });

  try {
    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: '0.0.0.0',
    });

    app.log.info('Server running on http://localhost:3000');

  } catch (error) {
    app.log.error(error, 'Failed to start server');
    process.exit(1);
  }
}

start();
 */
/* import "newrelic"

import Fastify from "fastify"
import cors from "@fastify/cors"
import { errorHandler } from "./Utils/ErrorHandler"
import fastifyLoggerConfig from "./Utils/FastifyLoggerConfig"
import redis, { initRedis } from "./RedisClient"
import AllRoutes from "./Routes"
import newRelicPlugin from "./Plugins/NewRelic"

async function start() {

  const app = Fastify({ logger: fastifyLoggerConfig })

  try {
    app.log.info("Initializing services...")

    await initRedis()
    app.log.info("Redis connected")

    await app.register(newRelicPlugin)
    app.log.info("New Relic plugin registered")

    await app.register(cors, {
      origin: "http://localhost:3000",
      methods: ["GET","POST"]
    })

    app.decorate("redis", redis)
    app.setErrorHandler(errorHandler)
    app.register(AllRoutes, { prefix: "/api" })

    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: "0.0.0.0"
    })

    app.log.info("Server started successfully")

  } catch (err) {
    app.log.fatal(err, "Startup failure")
    process.exit(1)
  }
}

start()
 */
/* import "newrelic";

import Fastify from "fastify";
import cors from "@fastify/cors";
import { errorHandler } from "./Utils/ErrorHandler";
import  { redis,initRedis } from "./RedisClient";
import AllRoutes from "./Routes";
import { registerRequestContext } from "./Middleware/RequestContext";

async function start() {

  const app = Fastify();

  registerRequestContext(app);

  try {
    app.log.info("Initializing services...");

    await initRedis();
    app.log.info("Redis connected");

    await app.register(cors, {
      origin: "http://localhost:3000",
      methods: ["GET","POST"]
    });

    app.decorate("redis", redis);

    app.setErrorHandler(errorHandler);

    app.register(AllRoutes, { prefix: "/api" });

    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: "0.0.0.0"
    });

    app.log.info("Server started successfully");
    app.log.info("NR_LOG_TEST");

  } catch (err) {
    app.log.fatal(err, "Startup failure");
    process.exit(1);
  }
}

start();
 */

/* import "newrelic";

import Fastify from "fastify";
import cors from "@fastify/cors";
import { errorHandler } from "./Utils/ErrorHandler";
import { redis, initRedis } from "./RedisClient";
import AllRoutes from "./Routes";
import { registerRequestContext } from "./Middleware/RequestContext";
import { logger } from "./Logging/Pino";

async function start() {

  const app = Fastify({ logger });

  registerRequestContext(app);

  try {
    app.log.info("Initializing services...");

    await initRedis();
    app.log.info("Redis connected");

    await app.register(cors, {
      origin: "http://localhost:3000",
      methods: ["GET","POST"]
    });

    app.decorate("redis", redis);

    app.setErrorHandler(errorHandler);

    app.register(AllRoutes, { prefix: "/api" });

    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: "0.0.0.0"
    });

    app.log.info("Server started successfully");
    app.log.info("NR_LOG_TEST");

  } catch (err) {
    app.log.fatal(err, "Startup failure");
    process.exit(1);
  }
  
}

start();
 */
/**
 * IMPORTANT:
 * New Relic is preloaded from npm scripts:
 * `-r dotenv/config -r newrelic`
 * so env vars are available before the agent starts.
 */
/* import Fastify from "fastify";
import cors from "@fastify/cors";

import { logger, registerRequestLogger, createRedis, createPrisma } from "./Logging";
import { registerRequestContext } from "./Middleware/RequestContext";
import { errorHandler } from "./Utils/ErrorHandler";
import AllRoutes from "./Routes";
import { pinoConfig } from "./Logging/Pino";
import newRelicLogger from "./Plugins/NewrelicLogger";

async function start() { 

const app = Fastify();
app.register(newRelicLogger);

  registerRequestContext(app);
  registerRequestLogger(app);

  const redis = createRedis();
  const prisma = createPrisma();

  app.decorate("redis", redis);
  app.decorate("prisma", prisma);

  app.setErrorHandler(errorHandler);

  await app.register(cors);

  app.register(AllRoutes, { prefix: "/api" });

  await app.listen({
    port: 3001,
    host: "0.0.0.0"
  });

  logger.info("Server started");
  console.log("NR_LOG_TEST_123");

}

start();
 */
// MUST be first import — New Relic hooks into modules here
 import "newrelic";

import Fastify from "fastify";
import cors from "@fastify/cors";

import { logger, registerRequestLogger, createRedis, createPrisma } from "./Logging";
import { registerRequestContext } from "./Observability/Context";
import { errorHandler } from "./Utils/ErrorHandler";
import AllRoutes from "./Routes";
import newRelicLogger from "./Plugins/NewrelicLogger";

async function start() {
  try {
    // pass logger config here
    const app = Fastify();

    // register plugin that sends logs to New Relic
    await app.register(newRelicLogger);

    registerRequestContext(app);
    registerRequestLogger(app);

    const redis = createRedis();
    const prisma = createPrisma();

    app.decorate("redis", redis);
    app.decorate("prisma", prisma);

    app.setErrorHandler(errorHandler);

    await app.register(cors);

    app.register(AllRoutes, { prefix: "/api" });

    await app.listen({
      port: 3001,
      host: "0.0.0.0"
    });

    logger.info("Server started successfully");
  } catch (err) {
    logger.error({ err }, "Server failed to start");
    process.exit(1);
  }
}

start();
 
