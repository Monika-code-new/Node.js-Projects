// Routes/index.ts
import { FastifyInstance } from 'fastify';
import PropertyRoutes from './Property.Routes';

export default async function Routes(app: FastifyInstance) {
  // Register each route file
  app.register(PropertyRoutes);
  
}
