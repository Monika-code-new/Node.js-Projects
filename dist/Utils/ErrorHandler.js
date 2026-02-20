"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const Logging_1 = require("../Logging");
const RequestContext_1 = require("../Utils/RequestContext");
function errorHandler(err, req, reply) {
    Logging_1.logger.error({
        type: "api-error",
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        reqId: (0, RequestContext_1.getContext)("reqId"),
    }, "Request error");
    reply.status(500).send({
        message: "Internal Server Error"
    });
}
