import { FastifyRequest, FastifyReply } from 'fastify';
import { CacheService } from '../Services/CacheService';
import { HttpStatusCode } from '../Utils/StatusCode.Enum';
import { cacheMessage } from '../Utils/Messages.Enum';
import { logger } from '../Observability/Logger';

export class CacheController {

  //  POST /cache/regions 
  static async cacheRegions(req: FastifyRequest, reply: FastifyReply) {
    const start = Date.now();
    logger.info('CacheController.cacheRegions started', {
      method: req.method,
      url: req.url
    });

    try {
      await CacheService.cacheRegions();

      logger.info('CacheController.cacheRegions completed', {
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      reply.status(HttpStatusCode.OK).send({
        message: cacheMessage.REGION_CACHE,
      });
    } catch (error) {
      logger.error('CacheController.cacheRegions failed', {
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: cacheMessage.FAILED_CACHE_REGIONS,
      });
    }
  }

  // GET /cache/regions (Redis → DB fallback)
  static async getRegions(req: FastifyRequest, reply: FastifyReply) {
    const start = Date.now();
    logger.info('CacheController.getRegions started', {
      method: req.method,
      url: req.url
    });

    try {
      const result = await CacheService.getRegions();

      logger.info('CacheController.getRegions completed', {
        source: result?.source ?? null,
        size: Array.isArray(result?.data) ? result?.data.length : null,
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      reply.status(HttpStatusCode.OK).send({
        source: result?.source?result.source:null,
        data: result?.data?result.data:null,
      });
    } catch (error) {
      logger.error('CacheController.getRegions failed', {
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: cacheMessage.FAILED_TO_FETCH,
      
      });
       throw error
    }
  }

  //  POST /cache/airports
  static async cacheAirports(req: FastifyRequest, reply: FastifyReply) {
    const start = Date.now();
    logger.info('CacheController.cacheAirports started', {
      method: req.method,
      url: req.url
    });

    try {
      await CacheService.cacheAirports();

      logger.info('CacheController.cacheAirports completed', {
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      reply.status(HttpStatusCode.OK).send({
        message: cacheMessage.AIRPORT_CACHE,
      });
    } catch (error) {
      logger.error('CacheController.cacheAirports failed', {
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: cacheMessage.FAILED_CACHE_AIRPORT,
      });
    }
  }

  //  GET /cache/airports
  static async getAirports(req: FastifyRequest, reply: FastifyReply) {
    const start = Date.now();
    logger.info('CacheController.getAirports started', {
      method: req.method,
      url: req.url
    });

    try {
      const result = await CacheService.getAirports();

      logger.info('CacheController.getAirports completed', {
        source: result?.source ?? null,
        size: Array.isArray(result?.data) ? result?.data.length : null,
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      reply.status(HttpStatusCode.OK).send({
        source: result?.source ?? null,
        data: result?.data ?? null,
      });
    } catch (error) {
      logger.error('CacheController.getAirports failed', {
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: cacheMessage.FAILED_TO_FETCH,
      });
    }
  }
}
