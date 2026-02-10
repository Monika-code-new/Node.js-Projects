import { FastifyInstance } from 'fastify';
import searchController  from '../Controllers/IVectorController';

export async function ivectorRoutes(app: FastifyInstance) {
  app.post(
    '/property-search/start',
    searchController.startSearch
  );

  app.get(
    '/property-search/status',
    searchController.getSearchResult
  );
 
}
