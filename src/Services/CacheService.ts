import { prisma } from '../Prisma/Client';
import { setCache, getCache } from '../Utils/CacheUtil';
import { CACHE_KEYS } from '../Utils/Messages.Enum';
import { redisConfig } from '../Config/RedisConfig';

export class CacheService {

  //  FORCE CACHE REGIONS (POST API)
  static async cacheRegions() {
    const regions = await prisma.region.findMany();

    await setCache(
      CACHE_KEYS.REGIONS,
      regions,
      redisConfig.ttl.regions
    );

    return regions;
  }

  //  GET REGIONS (Redis → DB fallback)
  static async getRegions() {
    const cachedRegions =  await getCache(CACHE_KEYS.REGIONS);
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
    const airports = await prisma.airport.findMany();

    await setCache(
      CACHE_KEYS.AIRPORTS,
      airports,
      redisConfig.ttl.airports
    );

    return airports;
  }

  // GET AIRPORTS
  static async getAirports() {
    const cachedAirports = await getCache(CACHE_KEYS.AIRPORTS);
    if (cachedAirports) {
      return { source: 'redis', data: cachedAirports };
    }

    /* const airports = await prisma.airport.findMany();

    await setCache(
      CACHE_KEYS.AIRPORTS,
      airports,
      redisConfig.ttl.airports
    );

    return { source: 'db', data: airports }; */
  }
}
