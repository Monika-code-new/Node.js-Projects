"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncStorage = void 0;
exports.getRequestId = getRequestId;
exports.registerRequestContext = registerRequestContext;
const async_hooks_1 = require("async_hooks");
const crypto_1 = __importDefault(require("crypto"));
exports.asyncStorage = new async_hooks_1.AsyncLocalStorage();
function getRequestId() {
    const store = exports.asyncStorage.getStore();
    if (!store)
        return crypto_1.default.randomUUID(); // fallback
    return store.reqId;
}
// Plugin to register context for each request
function registerRequestContext(app) {
    app.addHook("onRequest", (req, reply, done) => {
        const reqId = crypto_1.default.randomUUID(); // generate unique ID for this request
        exports.asyncStorage.run({ reqId }, () => {
            done();
        });
    });
}
