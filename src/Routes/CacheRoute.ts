import { FastifyInstance } from 'fastify';
import { CacheController } from '../Controllers/CacheController';

export default async function CacheRoutes(app: FastifyInstance) {
  // Regions
  app.post('/cache/regions', CacheController.cacheRegions);
  app.get('/cache/regions', CacheController.getRegions);

  // Airports
  app.post('/cache/airports', CacheController.cacheAirports);
  app.get('/cache/airports', CacheController.getAirports);
}
