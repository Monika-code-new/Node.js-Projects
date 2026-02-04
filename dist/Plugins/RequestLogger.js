"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const RequestLogService_1 = require("../Services/RequestLogService");
async function requestLogger(app) {
    // This runs before every request
    app.addHook('onRequest', async (req) => {
        const endpoint = req.routeOptions?.url || req.url;
        const ipAddress = req.ip;
        await (0, RequestLogService_1.logRequest)(endpoint, ipAddress);
    });
}
