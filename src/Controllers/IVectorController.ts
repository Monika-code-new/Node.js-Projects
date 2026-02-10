
import { FastifyRequest, FastifyReply } from 'fastify';
import redis from '../RedisClient';
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
