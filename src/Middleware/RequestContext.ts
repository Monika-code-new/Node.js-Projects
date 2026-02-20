/* import { FastifyInstance } from "fastify";
import { asyncLocalStorage } from "../Utils/RequestContext";
import { randomUUID } from "crypto";

export function registerRequestContext(app: FastifyInstance) {

 app.addHook("onRequest", async (req, reply) => {

  const store = new Map<string, any>();
  store.set("reqId", randomUUID());

  asyncLocalStorage.run(store, () => {});
 });
} */
 /* import { AsyncLocalStorage } from "async_hooks";
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";

const storage = new AsyncLocalStorage<Map<string, any>>();

export function registerRequestContext(app: FastifyInstance) {
  app.addHook("onRequest", (req, reply, done) => {
    const store = new Map();
    store.set("reqId", randomUUID());

    storage.run(store, done);
  });
}

export function getContext(key: string) {
  return storage.getStore()?.get(key);
}  */
// Middleware/RequestContext.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AsyncLocalStorage } from "async_hooks";
import crypto from "crypto";

interface RequestContext {
  reqId: string;
}

export const asyncStorage = new AsyncLocalStorage<RequestContext>();

export function getRequestId(): string {
  const store = asyncStorage.getStore();
  if (!store) return crypto.randomUUID(); // fallback
  return store.reqId;
}

// Plugin to register context for each request
export function registerRequestContext(app: FastifyInstance) {
  app.addHook("onRequest", (req: FastifyRequest, reply: FastifyReply, done) => {
    const reqId = crypto.randomUUID(); // generate unique ID for this request
    asyncStorage.run({ reqId }, () => {
      done();
    });
  });
}
