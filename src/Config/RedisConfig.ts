export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  cacheTTL: parseInt(process.env.CACHE_TTL || '60', 10),

  ttl: {
    regions: Number(process.env.REGION_CACHE_TTL) || 60,
    airports: Number(process.env.AIRPORT_CACHE_TTL) || 120,
  },
};
