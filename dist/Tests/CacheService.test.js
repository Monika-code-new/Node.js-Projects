"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// MOCK CacheUtil
jest.mock('../Utils/CacheUtil', () => ({
    setCache: jest.fn(),
    getCache: jest.fn(),
}));
// MOCK Prisma
jest.mock('../Prisma/Client', () => ({
    prisma: {
        region: { findMany: jest.fn() },
        airport: { findMany: jest.fn() },
    },
}));
const CacheService_1 = require("../Services/CacheService");
const Client_1 = require("../Prisma/Client");
const CacheUtil_1 = require("../Utils/CacheUtil");
const Messages_Enum_1 = require("../Utils/Messages.Enum");
const RedisConfig_1 = require("../Config/RedisConfig");
describe('CacheService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    //  cacheRegions 
    describe('cacheRegions', () => {
        it('should fetch regions from DB and cache them', async () => {
            const regions = [{ id: 1, name: 'Asia' }];
            Client_1.prisma.region.findMany.mockResolvedValue(regions);
            const result = await CacheService_1.CacheService.cacheRegions();
            expect(Client_1.prisma.region.findMany).toHaveBeenCalled();
            expect(CacheUtil_1.setCache).toHaveBeenCalledWith(Messages_Enum_1.CACHE_KEYS.REGIONS, regions, RedisConfig_1.redisConfig.ttl.regions);
            expect(result).toEqual(regions);
        });
        it('should throw error if DB fails', async () => {
            Client_1.prisma.region.findMany.mockRejectedValue(new Error('DB Error'));
            await expect(CacheService_1.CacheService.cacheRegions()).rejects.toThrow('DB Error');
        });
    });
    //  getRegions
    describe('getRegions', () => {
        it('should return regions from cache if available', async () => {
            const cachedRegions = [{ id: 1, name: 'Asia' }];
            CacheUtil_1.getCache.mockResolvedValue(cachedRegions);
            const result = await CacheService_1.CacheService.getRegions();
            expect(CacheUtil_1.getCache).toHaveBeenCalledWith(Messages_Enum_1.CACHE_KEYS.REGIONS);
            expect(result).toEqual({ source: 'redis', data: cachedRegions });
        });
        it('should return undefined if cache miss', async () => {
            CacheUtil_1.getCache.mockResolvedValue(null);
            const result = await CacheService_1.CacheService.getRegions();
            expect(CacheUtil_1.getCache).toHaveBeenCalledWith(Messages_Enum_1.CACHE_KEYS.REGIONS);
            expect(result).toBeUndefined();
        });
    });
    //cacheAirports
    describe('cacheAirports', () => {
        it('should fetch airports from DB and cache them', async () => {
            const airports = [{ id: 10, code: 'DEL' }];
            Client_1.prisma.airport.findMany.mockResolvedValue(airports);
            const result = await CacheService_1.CacheService.cacheAirports();
            expect(Client_1.prisma.airport.findMany).toHaveBeenCalled();
            expect(CacheUtil_1.setCache).toHaveBeenCalledWith(Messages_Enum_1.CACHE_KEYS.AIRPORTS, airports, RedisConfig_1.redisConfig.ttl.airports);
            expect(result).toEqual(airports);
        });
    });
    //getAirports
    describe('getAirports', () => {
        it('should return airports from cache if available', async () => {
            const cachedAirports = [{ id: 10, code: 'DEL' }];
            CacheUtil_1.getCache.mockResolvedValue(cachedAirports);
            const result = await CacheService_1.CacheService.getAirports();
            expect(CacheUtil_1.getCache).toHaveBeenCalledWith(Messages_Enum_1.CACHE_KEYS.AIRPORTS);
            expect(result).toEqual({ source: 'redis', data: cachedAirports });
        });
    });
});
