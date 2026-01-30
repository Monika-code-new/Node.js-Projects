import Redis from 'ioredis';
import { redisConfig } from './Config/RedisConfig';

const redis = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  lazyConnect: true,
});

export async function initRedis() {
  await redis.connect();
  console.log('Redis connected');
}

export default redis;
