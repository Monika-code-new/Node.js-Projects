"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RedisClient_1 = require("../RedisClient");
const RedisKeys_1 = require("../Constants/RedisKeys");
const IVectorService_1 = require("../Services/IVectorService");
const Logger_1 = require("../Observability/Logger");
class SearchController {
    static async startSearch(request, reply) {
        const start = Date.now();
        try {
            const { searchId } = request.body;
            Logger_1.logger.info("Start search request", { searchId });
            const statusKey = RedisKeys_1.redisKeys.status(searchId);
            await RedisClient_1.redis.set(statusKey, "STARTED", "EX", process.env.IVECTOR_TTL);
            (0, IVectorService_1.processIvectorSearch)(searchId);
            Logger_1.logger.info("Search triggered", {
                searchId,
                durationMs: Date.now() - start,
                method: request.method,
                url: request.url
            });
            return reply.send({
                searchId,
                status: "STARTED"
            });
        }
        catch (err) {
            Logger_1.logger.error("Start search failed", {
                message: err.message,
                durationMs: Date.now() - start,
                method: request.method,
                url: request.url
            });
            throw err;
        }
    }
    static async getSearchResult(request, reply) {
        const start = Date.now();
        const { searchId, fromIndex } = request.query;
        Logger_1.logger.info("Get search result started", {
            searchId,
            fromIndex: fromIndex ?? null,
            method: request.method,
            url: request.url
        });
        try {
            const statusKey = RedisKeys_1.redisKeys.status(searchId);
            const resultsKey = RedisKeys_1.redisKeys.results(searchId);
            const status = await RedisClient_1.redis.get(statusKey);
            if (!status) {
                Logger_1.logger.info("Get search result completed", {
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
            const rawResults = await RedisClient_1.redis.lrange(resultsKey, 0, -1);
            let results = rawResults.map((r) => JSON.parse(r));
            if (fromIndex) {
                const from = Number(fromIndex);
                results = results.filter((r) => r.responseIndex >= from);
            }
            const groupedMap = new Map();
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
            let frontendStatus;
            if (status === "STARTED" || status === "PROCESSING")
                frontendStatus = "PROCESSING";
            else if (status === "ENDED")
                frontendStatus = "ENDED";
            else if (status === "FAILED")
                frontendStatus = "FAILED";
            else
                frontendStatus = "UNKNOWN";
            Logger_1.logger.info("Get search result completed", {
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
        }
        catch (err) {
            Logger_1.logger.error("Get search result failed", {
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
exports.default = SearchController;
