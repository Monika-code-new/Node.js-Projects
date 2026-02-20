"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = newRelicLogger;
const newrelic_1 = __importDefault(require("newrelic"));
function nrLog(level, message, meta) {
    newrelic_1.default.recordLogEvent({
        level,
        message,
        ...meta,
    });
}
async function newRelicLogger(app) {
    // request start
    app.addHook("onRequest", async (req) => {
        req.startTime = Date.now();
        nrLog("info", "Incoming request", {
            method: req.method,
            url: req.url,
            id: req.id,
            query: req.query,
            params: req.params,
        });
    });
    // response finished
    app.addHook("onResponse", async (req, reply) => {
        const duration = Date.now() - req.startTime;
        nrLog("info", "Request completed", {
            method: req.method,
            url: req.url,
            id: req.id,
            statusCode: reply.statusCode,
            durationMs: duration,
        });
    });
    // errors
    app.setErrorHandler((error, req, reply) => {
        nrLog("error", "Request error", {
            method: req.method,
            url: req.url,
            id: req.id,
            error: error
        });
        reply.status(500).send({
            error: "Internal Server Error",
        });
    });
}
