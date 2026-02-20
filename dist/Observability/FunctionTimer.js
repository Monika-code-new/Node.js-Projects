"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeFunction = timeFunction;
const Logger_1 = require("./Logger");
async function timeFunction(functionName, fn, meta = {}) {
    const start = Date.now();
    try {
        const result = await fn();
        Logger_1.logger.info("Function completed", {
            type: "function",
            functionName,
            durationMs: Date.now() - start,
            ...meta
        });
        return result;
    }
    catch (error) {
        Logger_1.logger.error("Function failed", {
            type: "function",
            functionName,
            durationMs: Date.now() - start,
            error: error?.message ?? String(error),
            ...meta
        });
        throw error;
    }
}
