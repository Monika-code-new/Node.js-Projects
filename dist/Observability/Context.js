"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncStore = void 0;
exports.registerRequestContext = registerRequestContext;
exports.getRequestId = getRequestId;
const async_hooks_1 = require("async_hooks");
const Logger_1 = require("./Logger");
exports.asyncStore = new async_hooks_1.AsyncLocalStorage();
function registerRequestContext(app) {
    app.addHook("onRequest", (req, _reply, done) => {
        exports.asyncStore.run({ requestId: req.id, startTime: Date.now() }, done);
    });
    app.addHook("onResponse", async (req, reply) => {
        const store = exports.asyncStore.getStore();
        if (!store)
            return;
        Logger_1.logger.info("Request completed", {
            type: "api",
            functionName: `${req.method} ${req.url}`,
            method: req.method,
            url: req.url,
            status: reply.statusCode,
            durationMs: Date.now() - store.startTime
        });
    });
}
function getRequestId() {
    return exports.asyncStore.getStore()?.requestId ?? "unknown";
}
