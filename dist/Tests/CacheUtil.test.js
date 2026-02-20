"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// MOCK Redis client
jest.mock('../RedisClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));
const RedisClient_1 = require("../RedisClient");
const CacheUtil_1 = require("../Utils/CacheUtil");
describe('CacheUtil', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getCache', () => {
        it('should return parsed data when cache exists', async () => {
            const data = [{ id: 1, name: 'Asia' }];
            RedisClient_1.redis.get.mockResolvedValue(JSON.stringify(data));
            const result = await (0, CacheUtil_1.getCache)('regions');
            expect(RedisClient_1.redis.get).toHaveBeenCalledWith('regions');
            expect(result).toEqual(data);
        });
        it('should return null if cache is empty', async () => {
            RedisClient_1.redis.get.mockResolvedValue(null);
            const result = await (0, CacheUtil_1.getCache)('regions');
            expect(RedisClient_1.redis.get).toHaveBeenCalledWith('regions');
            expect(result).toBeNull();
        });
    });
    describe('setCache', () => {
        it('should store data in redis with TTL', async () => {
            const data = [{ id: 1, name: 'Asia' }];
            await (0, CacheUtil_1.setCache)('regions', data, 60);
            expect(RedisClient_1.redis.set).toHaveBeenCalledWith('regions', JSON.stringify(data), 'EX', 60);
        });
    });
});
