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
 import fp from "fastify-plugin"
import { logger } from "../Observability/Logger"

export default fp(async (fastify) => {

 fastify.addHook("onRequest", async (req) => {
   logger.info({ requestId: req.id, url: req.url, method: req.method }, "Incoming request")
 })


fastify.addHook("onResponse", async (req, reply) => {
 logger.info({
   method: req.method,
   url: req.url,
   status: reply.statusCode
 });
});


}) 

 
