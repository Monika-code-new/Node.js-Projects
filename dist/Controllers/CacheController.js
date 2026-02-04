"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheController = void 0;
const CacheService_1 = require("../Services/CacheService");
const StatusCode_Enum_1 = require("../Utils/StatusCode.Enum");
const Messages_Enum_1 = require("../Utils/Messages.Enum");
class CacheController {
    //  POST /cache/regions 
    static async cacheRegions(req, reply) {
        try {
            await CacheService_1.CacheService.cacheRegions();
            reply.status(StatusCode_Enum_1.HttpStatusCode.OK).send({
                message: Messages_Enum_1.cacheMessage.REGION_CACHE,
            });
        }
        catch (error) {
            reply.status(StatusCode_Enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: Messages_Enum_1.cacheMessage.FAILED_CACHE_REGIONS,
            });
        }
    }
    // GET /cache/regions (Redis → DB fallback)
    static async getRegions(req, reply) {
        try {
            const result = await CacheService_1.CacheService.getRegions();
            reply.status(StatusCode_Enum_1.HttpStatusCode.OK).send({
                source: result?.source ? result.source : null,
                data: result?.data ? result.data : null,
            });
        }
        catch (error) {
            reply.status(StatusCode_Enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: Messages_Enum_1.cacheMessage.FAILED_TO_FETCH,
            });
            throw error;
        }
    }
    //  POST /cache/airports
    static async cacheAirports(req, reply) {
        try {
            await CacheService_1.CacheService.cacheAirports();
            reply.status(StatusCode_Enum_1.HttpStatusCode.OK).send({
                message: Messages_Enum_1.cacheMessage.AIRPORT_CACHE,
            });
        }
        catch (error) {
            reply.status(StatusCode_Enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: Messages_Enum_1.cacheMessage.FAILED_CACHE_AIRPORT,
            });
        }
    }
    //  GET /cache/airports
    static async getAirports(req, reply) {
        try {
            const result = await CacheService_1.CacheService.getAirports();
            reply.status(StatusCode_Enum_1.HttpStatusCode.OK).send({
                source: result.source,
                data: result.data,
            });
        }
        catch (error) {
            reply.status(StatusCode_Enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: Messages_Enum_1.cacheMessage.FAILED_TO_FETCH,
            });
        }
    }
}
exports.CacheController = CacheController;
