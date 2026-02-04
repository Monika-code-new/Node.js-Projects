"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const Client_1 = require("../Prisma/Client");
const CacheUtil_1 = require("../Utils/CacheUtil");
const Messages_Enum_1 = require("../Utils/Messages.Enum");
const RedisConfig_1 = require("../Config/RedisConfig");
class CacheService {
    //  FORCE CACHE REGIONS (POST API)
    static async cacheRegions() {
        const regions = await Client_1.prisma.region.findMany();
        await (0, CacheUtil_1.setCache)(Messages_Enum_1.CACHE_KEYS.REGIONS, regions, RedisConfig_1.redisConfig.ttl.regions);
        return regions;
    }
    //  GET REGIONS (Redis → DB fallback)
    static async getRegions() {
        const cachedRegions = await (0, CacheUtil_1.getCache)(Messages_Enum_1.CACHE_KEYS.REGIONS);
        if (cachedRegions) {
            return { source: 'redis', data: cachedRegions };
        }
        /* const regions = await prisma.region.findMany();
    
        await setCache(
          CACHE_KEYS.REGIONS,
          regions,
          redisConfig.ttl.regions
        );
    
        return { source: 'db', data: regions }; */
    }
    // FORCE CACHE AIRPORTS
    static async cacheAirports() {
        const airports = await Client_1.prisma.airport.findMany();
        await (0, CacheUtil_1.setCache)(Messages_Enum_1.CACHE_KEYS.AIRPORTS, airports, RedisConfig_1.redisConfig.ttl.airports);
        return airports;
    }
    // GET AIRPORTS
    static async getAirports() {
        const cachedAirports = await (0, CacheUtil_1.getCache)(Messages_Enum_1.CACHE_KEYS.AIRPORTS);
        if (cachedAirports) {
            return { source: 'redis', data: cachedAirports };
        }
        const airports = await Client_1.prisma.airport.findMany();
        await (0, CacheUtil_1.setCache)(Messages_Enum_1.CACHE_KEYS.AIRPORTS, airports, RedisConfig_1.redisConfig.ttl.airports);
        return { source: 'db', data: airports };
    }
}
exports.CacheService = CacheService;
