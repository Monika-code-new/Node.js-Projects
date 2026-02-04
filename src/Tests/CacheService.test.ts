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

import { CacheService } from '../Services/CacheService';
import { prisma } from '../Prisma/Client';
import { setCache, getCache } from '../Utils/CacheUtil';
import { CACHE_KEYS } from '../Utils/Messages.Enum';
import { redisConfig } from '../Config/RedisConfig';

describe('CacheService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //  cacheRegions 
  describe('cacheRegions', () => {
    it('should fetch regions from DB and cache them', async () => {
      const regions = [{ id: 1, name: 'Asia' }];
      (prisma.region.findMany as jest.Mock).mockResolvedValue(regions);

      const result = await CacheService.cacheRegions();

      expect(prisma.region.findMany).toHaveBeenCalled();
      expect(setCache).toHaveBeenCalledWith(
        CACHE_KEYS.REGIONS,
        regions,
        redisConfig.ttl.regions
      );
      expect(result).toEqual(regions);
    });

    it('should throw error if DB fails', async () => {
      (prisma.region.findMany as jest.Mock).mockRejectedValue(
        new Error('DB Error')
      );

      await expect(CacheService.cacheRegions()).rejects.toThrow('DB Error');
    });
  });

  //  getRegions
  describe('getRegions', () => {
    it('should return regions from cache if available', async () => {
      const cachedRegions = [{ id: 1, name: 'Asia' }];
      (getCache as jest.Mock).mockResolvedValue(cachedRegions);

      const result = await CacheService.getRegions();

      expect(getCache).toHaveBeenCalledWith(CACHE_KEYS.REGIONS);
      expect(result).toEqual({ source: 'redis', data: cachedRegions });
    });

    it('should return undefined if cache miss', async () => {
      (getCache as jest.Mock).mockResolvedValue(null);

      const result = await CacheService.getRegions();

      expect(getCache).toHaveBeenCalledWith(CACHE_KEYS.REGIONS);
      expect(result).toBeUndefined();
    });
  });

  //cacheAirports
  describe('cacheAirports', () => {
    it('should fetch airports from DB and cache them', async () => {
      const airports = [{ id: 10, code: 'DEL' }];
      (prisma.airport.findMany as jest.Mock).mockResolvedValue(airports);

      const result = await CacheService.cacheAirports();

      expect(prisma.airport.findMany).toHaveBeenCalled();
      expect(setCache).toHaveBeenCalledWith(
        CACHE_KEYS.AIRPORTS,
        airports,
        redisConfig.ttl.airports
      );
      expect(result).toEqual(airports);
    });
  });

  //getAirports
  describe('getAirports', () => {
    it('should return airports from cache if available', async () => {
      const cachedAirports = [{ id: 10, code: 'DEL' }];
      (getCache as jest.Mock).mockResolvedValue(cachedAirports);

      const result = await CacheService.getAirports();

      expect(getCache).toHaveBeenCalledWith(CACHE_KEYS.AIRPORTS);
      expect(result).toEqual({ source: 'redis', data: cachedAirports });
    });
  });
});
