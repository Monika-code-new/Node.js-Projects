"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheController = void 0;
const CacheService_1 = require("../Services/CacheService");
const StatusCode_Enum_1 = require("../Utils/StatusCode.Enum");
const Messages_Enum_1 = require("../Utils/Messages.Enum");
const Logger_1 = require("../Observability/Logger");
class CacheController {
    //  POST /cache/regions 
    static async cacheRegions(req, reply) {
        const start = Date.now();
        Logger_1.logger.info('CacheController.cacheRegions started', {
            method: req.method,
            url: req.url
        });
        try {
            await CacheService_1.CacheService.cacheRegions();
            Logger_1.logger.info('CacheController.cacheRegions completed', {
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            reply.status(StatusCode_Enum_1.HttpStatusCode.OK).send({
                message: Messages_Enum_1.cacheMessage.REGION_CACHE,
            });
        }
        catch (error) {
            Logger_1.logger.error('CacheController.cacheRegions failed', {
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            reply.status(StatusCode_Enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: Messages_Enum_1.cacheMessage.FAILED_CACHE_REGIONS,
            });
        }
    }
    // GET /cache/regions (Redis → DB fallback)
    static async getRegions(req, reply) {
        const start = Date.now();
        Logger_1.logger.info('CacheController.getRegions started', {
            method: req.method,
            url: req.url
        });
        try {
            const result = await CacheService_1.CacheService.getRegions();
            Logger_1.logger.info('CacheController.getRegions completed', {
                source: result?.source ?? null,
                size: Array.isArray(result?.data) ? result?.data.length : null,
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            reply.status(StatusCode_Enum_1.HttpStatusCode.OK).send({
                source: result?.source ? result.source : null,
                data: result?.data ? result.data : null,
            });
        }
        catch (error) {
            Logger_1.logger.error('CacheController.getRegions failed', {
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            reply.status(StatusCode_Enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: Messages_Enum_1.cacheMessage.FAILED_TO_FETCH,
            });
            throw error;
        }
    }
    //  POST /cache/airports
    static async cacheAirports(req, reply) {
        const start = Date.now();
        Logger_1.logger.info('CacheController.cacheAirports started', {
            method: req.method,
            url: req.url
        });
        try {
            await CacheService_1.CacheService.cacheAirports();
            Logger_1.logger.info('CacheController.cacheAirports completed', {
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            reply.status(StatusCode_Enum_1.HttpStatusCode.OK).send({
                message: Messages_Enum_1.cacheMessage.AIRPORT_CACHE,
            });
        }
        catch (error) {
            Logger_1.logger.error('CacheController.cacheAirports failed', {
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            reply.status(StatusCode_Enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: Messages_Enum_1.cacheMessage.FAILED_CACHE_AIRPORT,
            });
        }
    }
    //  GET /cache/airports
    static async getAirports(req, reply) {
        const start = Date.now();
        Logger_1.logger.info('CacheController.getAirports started', {
            method: req.method,
            url: req.url
        });
        try {
            const result = await CacheService_1.CacheService.getAirports();
            Logger_1.logger.info('CacheController.getAirports completed', {
                source: result?.source ?? null,
                size: Array.isArray(result?.data) ? result?.data.length : null,
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            reply.status(StatusCode_Enum_1.HttpStatusCode.OK).send({
                source: result?.source ?? null,
                data: result?.data ?? null,
            });
        }
        catch (error) {
            Logger_1.logger.error('CacheController.getAirports failed', {
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            reply.status(StatusCode_Enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: Messages_Enum_1.cacheMessage.FAILED_TO_FETCH,
            });
        }
    }
}
exports.CacheController = CacheController;
