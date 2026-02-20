import { AsyncLocalStorage } from "async_hooks";
import { FastifyInstance } from "fastify";
import { logger } from "./Logger";

type Store = {
  requestId: string;
  startTime: number;
};

export const asyncStore = new AsyncLocalStorage<Store>();

export function registerRequestContext(app: FastifyInstance) {

  app.addHook("onRequest", (req, _reply, done) => {
    asyncStore.run(
      { requestId: req.id, startTime: Date.now() },
      done
    );
  });

  app.addHook("onResponse", async (req, reply) => {
    const store = asyncStore.getStore();
    if (!store) return;

    logger.info("Request completed", {
      type: "api",
      functionName: `${req.method} ${req.url}`,
      method: req.method,
      url: req.url,
      status: reply.statusCode,
      durationMs: Date.now() - store.startTime
    });
  });
}

export function getRequestId() {
  return asyncStore.getStore()?.requestId ?? "unknown";
}
