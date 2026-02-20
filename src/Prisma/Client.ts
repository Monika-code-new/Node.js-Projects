 
/* import { PrismaClient } from "@prisma/client";
import newrelic from "newrelic";

const base = new PrismaClient();

export const prisma = base.$extends({
 query: {
  $allModels: {
   async $allOperations({ model, operation, args, query }) {

    return await newrelic.startSegment(
     `Prisma/${model}.${operation}`,
     true,
     async () => {

      const start = Date.now();

      try {
        const result = await query(args);

        const duration = Date.now() - start;

        if (duration > 1000) {
          newrelic.recordCustomEvent("SlowPrismaQuery", {
            model,
            operation,
            duration
          });
        }

        return result;

      } catch (err: any) {
        newrelic.noticeError(err);
        throw err;
      }
     }
    );

   }
  }
 }
});

 */
/* import { PrismaClient } from "@prisma/client";
import { logger } from "../Logging/Pino";

export const prisma = new PrismaClient({
 log: [{ emit: "event", level: "query" }]
});

prisma.$on("query", (e) => {

 logger.info({
  type: "prisma",
  query: e.query,
  duration: e.duration,
  params: process.env.NODE_ENV === "dev" ? e.params : undefined
 });

 if (e.duration > 2000) {
  logger.warn({
   type: "slow-query",
   duration: e.duration,
   query: e.query
  });
 }
});
 */
import { PrismaClient } from "@prisma/client";
import { logger } from "../Observability/Logger";
import { getRequestId } from "../Observability/Context";

const basePrisma = new PrismaClient();

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const requestId = getRequestId();
        const start = Date.now();

        try {
          const result = await query(args);
          const durationMs = Date.now() - start;

          logger.info("Prisma query executed", {
            type: "prisma",
            requestId,
            functionName: `Prisma.${model ?? "unknown"}.${operation}`,
            model: model ?? "unknown",
            operation,
            durationMs,
            args: process.env.NODE_ENV === "dev" ? args : undefined
          });

          if (durationMs > 2000) {
            logger.warn("Slow Prisma query", {
              type: "slow-query",
              requestId,
              functionName: `Prisma.${model ?? "unknown"}.${operation}`,
              model: model ?? "unknown",
              operation,
              durationMs
            });
          }

          return result;
        } catch (error: any) {
          const durationMs = Date.now() - start;

          logger.error("Prisma query failed", {
            type: "prisma-error",
            requestId,
            functionName: `Prisma.${model ?? "unknown"}.${operation}`,
            model: model ?? "unknown",
            operation,
            durationMs,
            error: error?.message ?? String(error),
            args: process.env.NODE_ENV === "dev" ? args : undefined
          });

          throw error;
        }
      }
    }
  }
});

 
/* import { PrismaClient } from '@prisma/client';

const SLOW_QUERY_THRESHOLD = 0; // 10 seconds

// Single Prisma client
const basePrisma = new PrismaClient({ log: ['query', 'error', 'warn'] });

// Extend Prisma with middleware for centralized logging
export const prisma = basePrisma.$extends({
  query: {
    async $allOperations({ model, operation, args, query }) {
      console.log('Middleware triggered:', { model, operation });
      const start = Date.now();

      try {
        const result = await query(args);
        const duration = Date.now() - start;

        // Slow query logging
        if (duration > SLOW_QUERY_THRESHOLD) {
          try {
            // Use basePrisma, but wrap in setImmediate to avoid blocking
            setImmediate(async () => {
              try {
                await basePrisma.slowquerylog.create({
                  data: {
                    model: model ?? 'RAW_QUERY',
                    tableName: model?.toLowerCase() ?? null,
                    action: operation,
                    query: JSON.stringify(args),
                    params: JSON.stringify(args),
                    durationMs: duration,
                  },
                });
                console.log(`SLOW_QUERY logged for ${model} (${duration}ms)`);
              } catch (err) {
                console.error('Failed to log slow query:', err);
              }
            });
          } catch {}
        }

        return result;
      } catch (error: any) {
        const duration = Date.now() - start;

        // Query error logging
        try {
          setImmediate(async () => {
            try {
              await basePrisma.queryerrorlog.create({
                data: {
                  model: model ?? 'RAW_QUERY',
                  tableName: model?.toLowerCase() ?? null,
                  action: operation,
                  query: JSON.stringify(args),
                  params: JSON.stringify(args),
                  errorType: error.code ?? 'UNKNOWN',
                  errorMessage: error.message,
                  stack: error.stack,
                  durationMs: duration,
                },
              });
            } catch (err) {
              console.error('Failed to log query error:', err);
            }
          });
        } catch {}

        throw error;
      }
    },
  },
});
 */
