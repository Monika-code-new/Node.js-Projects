import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import newrelic from "newrelic";

function nrLog(level: "info" | "warn" | "error", message: string, meta?: any) {
  newrelic.recordLogEvent({
    level,
    message,
    ...meta,
  });
}

export default async function newRelicLogger(app: FastifyInstance) {

  // request start
  app.addHook("onRequest", async (req: FastifyRequest) => {
    (req as any).startTime = Date.now();

    nrLog("info", "Incoming request", {
      method: req.method,
      url: req.url,
      id: req.id,
      query: req.query,
      params: req.params,
    });
  });

  // response finished
  app.addHook("onResponse", async (req: FastifyRequest, reply: FastifyReply) => {
    const duration = Date.now() - (req as any).startTime;

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
