"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrisma = createPrisma;
const client_1 = require("@prisma/client");
const Logger_1 = require("../Observability/Logger");
function createPrisma() {
    const prisma = new client_1.PrismaClient();
    return prisma.$extends({
        query: {
            async $allOperations({ model, operation, args, query }) {
                const start = Date.now();
                try {
                    const result = await query(args);
                    const duration = Date.now() - start;
                    Logger_1.logger.info({
                        type: "prisma",
                        model,
                        operation,
                        duration
                    });
                    if (duration > 1000) {
                        Logger_1.logger.warn({
                            type: "slow-query",
                            model,
                            operation,
                            duration
                        });
                    }
                    return result;
                }
                catch (err) {
                    Logger_1.logger.error({
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
