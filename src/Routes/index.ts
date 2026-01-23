// Routes/index.ts
import { FastifyInstance } from 'fastify';
import PropertyRoutes from './PropertyRoutes';

export default async function Routes(app: FastifyInstance) {
  // Register each route file
  app.register(PropertyRoutes);
  
}
