import { FastifyInstance } from 'fastify';
import { PropertyController } from '../Controllers/PropertyController';

export default async function PropertyRoutes(app: FastifyInstance) {
  app.get('/properties', PropertyController.getProperties);
  
}
