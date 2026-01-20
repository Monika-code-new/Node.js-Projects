import { FastifyInstance } from 'fastify';
import { PropertyController } from '../Controllers/Property.Controller';

export default async function PropertyRoutes(app: FastifyInstance) {
  app.get('/properties', PropertyController.getProperties);
  app.get('/properties/:destinationId', PropertyController.getPropertiesByDestination);
}
