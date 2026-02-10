"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RedisClient_1 = __importDefault(require("../RedisClient"));
const RedisKeys_1 = require("../Constants/RedisKeys");
const IVectorService_1 = require("../Services/IVectorService");
class SearchController {
    // Start a new search
    static async startSearch(request, reply) {
        const { searchId } = request.body;
        const statusKey = RedisKeys_1.redisKeys.status(searchId);
        // Immediately mark search as STARTED
        await RedisClient_1.default.set(statusKey, 'STARTED', 'EX', process.env.IVECTOR_TTL);
        // Fire-and-forget the async processing
        (0, IVectorService_1.processIvectorSearch)(searchId);
        return reply.send({ searchId, status: 'STARTED' });
    }
    // Get search status + incremental results
    /* static async getSearchResult(request: FastifyRequest, reply: FastifyReply) {
      const { searchId, fromIndex } = request.query as {
        searchId: string;
        fromIndex?: string;
      };
  
      const statusKey = redisKeys.status(searchId);
      const resultsKey = redisKeys.results(searchId);
  
      const status = await redis.get(statusKey);
  
      // If key missing or expired
      if (!status) {
        return reply.send({
          status: 'EXPIRED',
          results: [],
        });
      }
  
      // Fetch all results
      const rawResults = await redis.lrange(resultsKey, 0, -1);
      let results = rawResults.map(r => JSON.parse(r));
  
      // Apply incremental filtering
      if (fromIndex) {
        const from = Number(fromIndex);
        results = results.filter(r => r.responseIndex >= from);
      }
  
      // Map backend status to frontend-friendly status
      let frontendStatus: string;
      if (status === 'STARTED' || status === 'PROCESSING') frontendStatus = 'PROCESSING';
      else if (status === 'ENDED') frontendStatus = 'ENDED';
      else if (status === 'FAILED') frontendStatus = 'FAILED';
      else frontendStatus = 'UNKNOWN';
  
      return reply.send({
        status: frontendStatus,
        results,
        nextIndex: results.length ? results[results.length - 1].responseIndex + 1 : 0,
      });
    } */
    static async getSearchResult(request, reply) {
        const { searchId, fromIndex } = request.query;
        const statusKey = RedisKeys_1.redisKeys.status(searchId);
        const resultsKey = RedisKeys_1.redisKeys.results(searchId);
        const status = await RedisClient_1.default.get(statusKey);
        if (!status) {
            return reply.send({
                status: 'EXPIRED',
                results: [],
            });
        }
        // Fetch all Redis items (flattened per room)
        const rawResults = await RedisClient_1.default.lrange(resultsKey, 0, -1);
        let results = rawResults.map(r => JSON.parse(r));
        // Incremental filtering
        if (fromIndex) {
            const from = Number(fromIndex);
            results = results.filter(r => r.responseIndex >= from);
        }
        // Group rooms by propertyRef
        const groupedMap = new Map();
        results.forEach(item => {
            const propId = item.propertyRef;
            if (!groupedMap.has(propId)) {
                groupedMap.set(propId, {
                    iv_reference_id: propId,
                    propertyName: item.propertyName,
                    metadata: item.metadata,
                    import_rooms: [],
                });
            }
            const property = groupedMap.get(propId);
            property.import_rooms.push(item.roomData);
        });
        const groupedResults = Array.from(groupedMap.values());
        // Map backend status to frontend-friendly status
        let frontendStatus;
        if (status === 'STARTED' || status === 'PROCESSING')
            frontendStatus = 'PROCESSING';
        else if (status === 'ENDED')
            frontendStatus = 'ENDED';
        else if (status === 'FAILED')
            frontendStatus = 'FAILED';
        else
            frontendStatus = 'UNKNOWN';
        return reply.send({
            status: frontendStatus,
            results: groupedResults,
            nextIndex: results.length ? results[results.length - 1].responseIndex + 1 : 0,
        });
    }
}
exports.default = SearchController;
