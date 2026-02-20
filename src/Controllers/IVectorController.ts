/* 
import { FastifyRequest, FastifyReply } from 'fastify';
import {redis}from '../RedisClient';
import { redisKeys } from '../Constants/RedisKeys';
import { processIvectorSearch } from '../Services/IVectorService';

export default class SearchController {
  // Start a new search
  static async startSearch(request: FastifyRequest, reply: FastifyReply) {
    const { searchId } = request.body as { searchId: string };

    const statusKey = redisKeys.status(searchId);

    // Immediately mark search as STARTED
    await redis.set(statusKey, 'STARTED','EX',process.env.IVECTOR_TTL); 

    // Fire-and-forget the async processing
    processIvectorSearch(searchId);

    return reply.send({ searchId, status: 'STARTED' });
  }

   static async getSearchResult(request: FastifyRequest, reply: FastifyReply) {
  const { searchId, fromIndex } = request.query as {
    searchId: string;
    fromIndex?: string;
  };

  const statusKey = redisKeys.status(searchId);
  const resultsKey = redisKeys.results(searchId);

  const status = await redis.get(statusKey);

  if (!status) {
    return reply.send({
      status: 'EXPIRED',
      results: [],
    });
  }

  // Fetch all Redis items (flattened per room)
  const rawResults = await redis.lrange(resultsKey, 0, -1);
  let results = rawResults.map(r => JSON.parse(r));

  // Incremental filtering
  if (fromIndex) {
    const from = Number(fromIndex);
    results = results.filter(r => r.responseIndex >= from);
  }

  // Group rooms by propertyRef
  const groupedMap = new Map<number, any>();
  results.forEach(item => {
  const propId = item.propertyRef;

  if (!groupedMap.has(propId)) {
    groupedMap.set(propId, {
      iv_reference_id: propId,
      propertyName: item.propertyName,
      metadata: item.metadata,
      page: item.page,
      rating: item.rating,
      import_rooms: [],
    });
  }

  const property = groupedMap.get(propId);

  if (item.roomName) {
    property.import_rooms.push(item.roomName);
  }
});


  const groupedResults = Array.from(groupedMap.values());

  // Map backend status to frontend-friendly status
  let frontendStatus: string;
  if (status === 'STARTED' || status === 'PROCESSING') frontendStatus = 'PROCESSING';
  else if (status === 'ENDED') frontendStatus = 'ENDED';
  else if (status === 'FAILED') frontendStatus = 'FAILED';
  else frontendStatus = 'UNKNOWN';

  return reply.send({
    status: frontendStatus,
    results: groupedResults,
    nextIndex: results.length ? results[results.length - 1].responseIndex + 1 : 0,
  });
}

}
 */
/* import { FastifyRequest, FastifyReply } from "fastify";
import { redis } from "../RedisClient";
import { redisKeys } from "../Constants/RedisKeys";
import { processIvectorSearch } from "../Services/IVectorService";
import { logger } from "../Logging/Pino";

export default class SearchController {

  // START SEARCH
  static async startSearch(request: FastifyRequest, reply: FastifyReply) {
    const { searchId } = request.body as { searchId: string };

    logger.info({ searchId }, "Start search request received");

    try {
      const statusKey = redisKeys.status(searchId);

      await redis.set(statusKey, "STARTED", "EX", process.env.IVECTOR_TTL);

      logger.info({ searchId }, "Search status set to STARTED");

      // fire-and-forget background process
      processIvectorSearch(searchId);

      logger.info({ searchId }, "Background search triggered");

      return reply.send({ searchId, status: "STARTED" });

    } catch (error) {
      logger.error({ error, searchId }, "Failed to start search");

      return reply.status(500).send({
        error: "Failed to start search",
      });
    }
  }

  // GET SEARCH RESULT
  static async getSearchResult(request: FastifyRequest, reply: FastifyReply) {
    const { searchId, fromIndex } = request.query as {
      searchId: string;
      fromIndex?: string;
    };

    logger.info({ searchId, fromIndex }, "Fetching search results");

    try {
      const statusKey = redisKeys.status(searchId);
      const resultsKey = redisKeys.results(searchId);

      const status = await redis.get(statusKey);

      if (!status) {
        logger.warn({ searchId }, "Search expired or missing");

        return reply.send({
          status: "EXPIRED",
          results: [],
        });
      }

      const rawResults = await redis.lrange(resultsKey, 0, -1);

      logger.info(
        { searchId, resultCount: rawResults.length },
        "Fetched raw results from Redis"
      );

      let results = rawResults.map(r => JSON.parse(r));

      // incremental filtering
      if (fromIndex) {
        const from = Number(fromIndex);

        logger.info({ searchId, from }, "Applying incremental filter");

        results = results.filter(r => r.responseIndex >= from);
      }

      // group rooms by property
      const groupedMap = new Map<number, any>();

      results.forEach(item => {
        const propId = item.propertyRef;

        if (!groupedMap.has(propId)) {
          groupedMap.set(propId, {
            iv_reference_id: propId,
            propertyName: item.propertyName,
            metadata: item.metadata,
            page: item.page,
            rating: item.rating,
            import_rooms: [],
          });
        }

        const property = groupedMap.get(propId);

        if (item.roomName) {
          property.import_rooms.push(item.roomName);
        }
      });

      const groupedResults = Array.from(groupedMap.values());

      // map backend status → frontend status
      let frontendStatus: string;

      if (status === "STARTED" || status === "PROCESSING")
        frontendStatus = "PROCESSING";
      else if (status === "ENDED")
        frontendStatus = "ENDED";
      else if (status === "FAILED")
        frontendStatus = "FAILED";
      else
        frontendStatus = "UNKNOWN";

      logger.info(
        {
          searchId,
          status: frontendStatus,
          resultCount: groupedResults.length,
        },
        "Returning search results"
      );

      return reply.send({
        status: frontendStatus,
        results: groupedResults,
        nextIndex: results.length
          ? results[results.length - 1].responseIndex + 1
          : 0,
      });

    } catch (error) {
      logger.error({ error, searchId }, "Error fetching search results");

      return reply.status(500).send({
        error: "Failed to fetch results",
      });
    }
  }
}
 */
/* import { FastifyRequest, FastifyReply } from 'fastify';
import {redis}from '../RedisClient';
import { redisKeys } from '../Constants/RedisKeys';
import { processIvectorSearch } from '../Services/IVectorService';
import { logger } from '../Observability/Logger';


export default class SearchController {
  // Start a new search
  static async startSearch(request: FastifyRequest, reply: FastifyReply) {
    const { searchId } = request.body as { searchId: string };
    logger.info("Start search request", { searchId });

    const statusKey = redisKeys.status(searchId);

    // Immediately mark search as STARTED
    await redis.set(statusKey, 'STARTED','EX',process.env.IVECTOR_TTL); 

    // Fire-and-forget the async processing
    processIvectorSearch(searchId);
    


    return reply.send({ searchId, status: 'STARTED' });
  }

   static async getSearchResult(request: FastifyRequest, reply: FastifyReply) {
  const { searchId, fromIndex } = request.query as {
    searchId: string;
    fromIndex?: string;
  };

  const statusKey = redisKeys.status(searchId);
  const resultsKey = redisKeys.results(searchId);

  const status = await redis.get(statusKey);

  if (!status) {
    return reply.send({
      status: 'EXPIRED',
      results: [],
    });
  }

  // Fetch all Redis items (flattened per room)
  const rawResults = await redis.lrange(resultsKey, 0, -1);
  let results = rawResults.map(r => JSON.parse(r));

  // Incremental filtering
  if (fromIndex) {
    const from = Number(fromIndex);
    results = results.filter(r => r.responseIndex >= from);
  }

  // Group rooms by propertyRef
  const groupedMap = new Map<number, any>();
  results.forEach(item => {
  const propId = item.propertyRef;

  if (!groupedMap.has(propId)) {
    groupedMap.set(propId, {
      iv_reference_id: propId,
      propertyName: item.propertyName,
      metadata: item.metadata,
      page: item.page,
      rating: item.rating,
      import_rooms: [],
    });
  }

  const property = groupedMap.get(propId);

  if (item.roomName) {
    property.import_rooms.push(item.roomName);
  }
});


  const groupedResults = Array.from(groupedMap.values());

  // Map backend status to frontend-friendly status
  let frontendStatus: string;
  if (status === 'STARTED' || status === 'PROCESSING') frontendStatus = 'PROCESSING';
  else if (status === 'ENDED') frontendStatus = 'ENDED';
  else if (status === 'FAILED') frontendStatus = 'FAILED';
  else frontendStatus = 'UNKNOWN';

  return reply.send({
    status: frontendStatus,
    results: groupedResults,
    nextIndex: results.length ? results[results.length - 1].responseIndex + 1 : 0,
  });
}

} */
import { FastifyRequest, FastifyReply } from "fastify";
import { redis } from "../RedisClient";
import { redisKeys } from "../Constants/RedisKeys";
import { processIvectorSearch } from "../Services/IVectorService";
import { logger } from "../Observability/Logger";

export default class SearchController {

  static async startSearch(request: FastifyRequest, reply: FastifyReply) {

    const start = Date.now();

    try {
      const { searchId } = request.body as { searchId: string };

      logger.info("Start search request", { searchId });

      const statusKey = redisKeys.status(searchId);

      await redis.set(
        statusKey,
        "STARTED",
        "EX",
        process.env.IVECTOR_TTL as any
      );

      processIvectorSearch(searchId);

      logger.info("Search triggered", {
        searchId,
        durationMs: Date.now() - start,
        method: request.method,
        url: request.url
      });

      return reply.send({
        searchId,
        status: "STARTED"
      });

    } catch (err: any) {
      logger.error("Start search failed", {
        message: err.message,
        durationMs: Date.now() - start,
        method: request.method,
        url: request.url
      });
      throw err;
    }
  }

  static async getSearchResult(request: FastifyRequest, reply: FastifyReply) {
    const start = Date.now();
    const { searchId, fromIndex } = request.query as {
      searchId: string;
      fromIndex?: string;
    };

    logger.info("Get search result started", {
      searchId,
      fromIndex: fromIndex ?? null,
      method: request.method,
      url: request.url
    });

    try {
      const statusKey = redisKeys.status(searchId);
      const resultsKey = redisKeys.results(searchId);

      const status = await redis.get(statusKey);

      if (!status) {
        logger.info("Get search result completed", {
          searchId,
          status: "EXPIRED",
          resultsCount: 0,
          durationMs: Date.now() - start,
          method: request.method,
          url: request.url
        });

        return reply.send({
          status: "EXPIRED",
          results: [],
        });
      }

      const rawResults = await redis.lrange(resultsKey, 0, -1);
      let results = rawResults.map((r) => JSON.parse(r));

      if (fromIndex) {
        const from = Number(fromIndex);
        results = results.filter((r) => r.responseIndex >= from);
      }

      const groupedMap = new Map<number, any>();
      results.forEach((item) => {
        const propId = item.propertyRef;

        if (!groupedMap.has(propId)) {
          groupedMap.set(propId, {
            iv_reference_id: propId,
            propertyName: item.propertyName,
            metadata: item.metadata,
            page: item.page,
            rating: item.rating,
            import_rooms: [],
          });
        }

        const property = groupedMap.get(propId);

        if (item.roomName) {
          property.import_rooms.push(item.roomName);
        }
      });

      const groupedResults = Array.from(groupedMap.values());

      let frontendStatus: string;
      if (status === "STARTED" || status === "PROCESSING") frontendStatus = "PROCESSING";
      else if (status === "ENDED") frontendStatus = "ENDED";
      else if (status === "FAILED") frontendStatus = "FAILED";
      else frontendStatus = "UNKNOWN";

      logger.info("Get search result completed", {
        searchId,
        status: frontendStatus,
        resultsCount: groupedResults.length,
        durationMs: Date.now() - start,
        method: request.method,
        url: request.url
      });

      return reply.send({
        status: frontendStatus,
        results: groupedResults,
        nextIndex: results.length ? results[results.length - 1].responseIndex + 1 : 0,
      });
    } catch (err: any) {
      logger.error("Get search result failed", {
        searchId,
        message: err.message,
        durationMs: Date.now() - start,
        method: request.method,
        url: request.url
      });
      throw err;
    }
  }
}
