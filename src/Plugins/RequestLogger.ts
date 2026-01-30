import { FastifyInstance } from 'fastify';
import { logRequest } from '../Services/RequestLogService';

export async function requestLogger(app: FastifyInstance) {
  // This runs before every request
  app.addHook('onRequest', async (req) => {
  const endpoint = req.routeOptions?.url || req.url;

  const ipAddress =req.ip ;

  await logRequest(endpoint, ipAddress);
});

}
