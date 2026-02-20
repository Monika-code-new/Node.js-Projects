"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRequestLogger = registerRequestLogger;
const Logger_1 = require("../Observability/Logger");
function registerRequestLogger(app) {
    app.addHook("onRequest", async (req) => {
        Logger_1.logger.info({
            type: "request",
            method: req.method,
            url: req.url
        }, "Incoming request");
    });
    app.addHook("onResponse", async (req, reply) => {
        Logger_1.logger.info({
            type: "response",
            status: reply.statusCode,
            url: req.url
        }, "Request completed");
    });
}
