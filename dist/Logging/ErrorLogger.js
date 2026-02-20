"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerErrorHandler = registerErrorHandler;
const Logger_1 = require("../Observability/Logger");
const Winston_1 = require("./Winston");
const Apm_1 = require("../Utils/Apm");
function registerErrorHandler(app) {
    app.setErrorHandler((err, req, reply) => {
        const error = err instanceof Error
            ? err
            : new Error(String(err));
        // send to APM
        Apm_1.APM.error(error);
        // log with pino
        Logger_1.logger.error({
            message: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method
        });
        // log slow/critical separately
        Winston_1.slowLogger.error(error);
        reply.status(500).send({
            message: "Internal Server Error"
        });
    });
}
