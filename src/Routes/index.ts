// Routes/index.ts
import { FastifyInstance } from 'fastify';
import PropertyRoutes from './PropertyRoutes';
import CacheRoutes from './CacheRoute';

export default async function AllRoutes(app: FastifyInstance) {
   await PropertyRoutes(app);

  // Cache routes
  await CacheRoutes(app);
  
}
