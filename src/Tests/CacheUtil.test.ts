// MOCK Redis client
jest.mock('../RedisClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

import {redis} from '../RedisClient';
import { getCache, setCache } from '../Utils/CacheUtil';

describe('CacheUtil', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCache', () => {
    it('should return parsed data when cache exists', async () => {
      const data = [{ id: 1, name: 'Asia' }];
      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(data));

      const result = await getCache('regions');

      expect(redis.get).toHaveBeenCalledWith('regions');
      expect(result).toEqual(data);
    });

    it('should return null if cache is empty', async () => {
      (redis.get as jest.Mock).mockResolvedValue(null);

      const result = await getCache('regions');

      expect(redis.get).toHaveBeenCalledWith('regions');
      expect(result).toBeNull();
    });
  });

  describe('setCache', () => {
    it('should store data in redis with TTL', async () => {
      const data = [{ id: 1, name: 'Asia' }];

      await setCache('regions', data, 60);

      expect(redis.set).toHaveBeenCalledWith(
        'regions',
        JSON.stringify(data),
        'EX',
        60
      );
    });
  });
});
