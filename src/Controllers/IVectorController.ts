import { FastifyReply, FastifyRequest } from 'fastify';
import redis from '../RedisClient';
import { redisKeys } from '../Constants/RedisKeys';
import { processIvectorSearch } from '../Services/IVectorService';
import { HttpStatusCode } from '../Utils/StatusCode.Enum';
import { successMessage } from '../Utils/Messages.Enum';


export class PropertySearchController {
  
static async  startSearch(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { searchId } = request.body as { searchId: string };

  const statusKey = redisKeys.status(searchId);
  const resultsKey = redisKeys.results(searchId);

  // Reset old data (important when TTL expired)
  await redis.del(statusKey, resultsKey);

  // Mark as started
  await redis.set(statusKey, 'STARTED', 'EX', process.env.IVECTOR_TTL);
  await redis.expire(resultsKey, process.env.IVECTOR_TTL);

  //  Fire background process (DO NOT await)
  processIvectorSearch(searchId);
  return reply.code(HttpStatusCode.ACCEPTED).send({
  message: successMessage.Search_Started,
});
}
// src/Controllers/PropertySearchController.ts
static async  getSearchResult(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { searchId } = request.query as { searchId: string };

  const statusKey = redisKeys.status(searchId);
  const resultsKey = redisKeys.results(searchId);

  const status = await redis.get(statusKey);

  //  TTL expired OR search never started
  if (!status) {
    return {
      status: 'EXPIRED',
      results: [],
    };
  }

  const rawResults = await redis.lrange(resultsKey, 0, -1);
  const results = rawResults.map((r) => JSON.parse(r));

  //  Still processing
  if (status === 'STARTED') {
    return {
      status: 'PROCESSING',
      results,
    };
  }

  //  Completed
  if (status === 'ENDED') {
    return {
      status: 'DONE',
      results,
    };
  }

  //  Failure
  if (status === 'FAILED') {
    return {
      status: 'FAILED',
      results: [],
    };
  }

  return {
    status: 'UNKNOWN',
    results: [],
  };
}
}