import { PrismaClient } from "@prisma/client";
import { logger } from "../Observability/Logger";

export function createPrisma() {

  const prisma = new PrismaClient();

  return prisma.$extends({
    query: {
      async $allOperations({ model, operation, args, query }) {

        const start = Date.now();

        try {
          const result = await query(args);

          const duration = Date.now() - start;

          logger.info({
            type: "prisma",
            model,
            operation,
            duration
          });

          if (duration > 1000) {
            logger.warn({
              type: "slow-query",
              model,
              operation,
              duration
            });
          }

          return result;

        } catch (err) {

          logger.error({
            type: "prisma-error",
            model,
            operation,
            error: err
          });

          throw err;
        }
      }
    }
  });
}
