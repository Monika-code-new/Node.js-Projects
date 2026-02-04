import { FastifyInstance } from 'fastify';
import { PropertySearchController } from '../Controllers/IVectorController';

export async function ivectorRoutes(app: FastifyInstance) {
  app.post(
    '/property-search/start',
    PropertySearchController.startSearch
  );

  app.get(
    '/property-search/status',
    PropertySearchController.getSearchResult
  );
}
