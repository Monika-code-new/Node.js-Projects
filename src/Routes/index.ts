// Routes/index.ts
import { FastifyInstance } from 'fastify';
import PropertyRoutes from './PropertyRoutes';
import CacheRoutes from './CacheRoute';
import { ivectorRoutes } from './IVectorRoutes';

export default async function AllRoutes(app: FastifyInstance) {
   await PropertyRoutes(app);

  // Cache routes
  await CacheRoutes(app);
  await ivectorRoutes(app);
}
