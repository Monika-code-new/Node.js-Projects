"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* import { FastifyInstance } from 'fastify';
import { logRequest } from '../Services/RequestLogService';

export async function requestLogger(app: FastifyInstance) {
  // This runs before every request
  app.addHook('onRequest', async (req) => {
  const endpoint = req.routeOptions?.url || req.url;

  const ipAddress =req.ip ;

  await logRequest(endpoint, ipAddress);
});

}
 */
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const Logger_1 = require("../Observability/Logger");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.addHook("onRequest", async (req) => {
        Logger_1.logger.info({ requestId: req.id, url: req.url, method: req.method }, "Incoming request");
    });
    fastify.addHook("onResponse", async (req, reply) => {
        Logger_1.logger.info({
            method: req.method,
            url: req.url,
            status: reply.statusCode
        });
    });
});
