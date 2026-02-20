import { FastifyInstance } from "fastify";
import { logger } from "../Observability/Logger";

export function registerRequestLogger(app: FastifyInstance) {

  app.addHook("onRequest", async (req) => {
    logger.info({
      type: "request",
      method: req.method,
      url: req.url
    }, "Incoming request");
  });

  app.addHook("onResponse", async (req, reply) => {
    logger.info({
      type: "response",
      status: reply.statusCode,
      url: req.url
    }, "Request completed");
  });

}
