import { FastifyRequest, FastifyReply } from 'fastify';
import { CacheService } from '../Services/CacheService';
import { HttpStatusCode } from '../Utils/StatusCode.Enum';
import { cacheMessage } from '../Utils/Messages.Enum';

export class CacheController {

  //  POST /cache/regions 
  static async cacheRegions(req: FastifyRequest, reply: FastifyReply) {
    try {
      await CacheService.cacheRegions();

      reply.status(HttpStatusCode.OK).send({
        message: cacheMessage.REGION_CACHE,
      });
    } catch (error) {
      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: cacheMessage.FAILED_CACHE_REGIONS,
      });
    }
  }

  // GET /cache/regions (Redis → DB fallback)
  static async getRegions(req: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await CacheService.getRegions();

      reply.status(HttpStatusCode.OK).send({
        source: result.source,
        data: result.data,
      });
    } catch (error) {
      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: cacheMessage.FAILED_TO_FETCH,
      });
    }
  }

  //  POST /cache/airports
  static async cacheAirports(req: FastifyRequest, reply: FastifyReply) {
    try {
      await CacheService.cacheAirports();

      reply.status(HttpStatusCode.OK).send({
        message: cacheMessage.AIRPORT_CACHE,
      });
    } catch (error) {
      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: cacheMessage.FAILED_CACHE_AIRPORT,
      });
    }
  }

  //  GET /cache/airports
  static async getAirports(req: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await CacheService.getAirports();

      reply.status(HttpStatusCode.OK).send({
        source: result.source,
        data: result.data,
      });
    } catch (error) {
      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: cacheMessage.FAILED_TO_FETCH,
      });
    }
  }
}
