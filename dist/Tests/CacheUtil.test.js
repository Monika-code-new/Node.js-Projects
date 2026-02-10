"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MOCK Redis client
jest.mock('../RedisClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));
const RedisClient_1 = __importDefault(require("../RedisClient"));
const CacheUtil_1 = require("../Utils/CacheUtil");
describe('CacheUtil', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getCache', () => {
        it('should return parsed data when cache exists', async () => {
            const data = [{ id: 1, name: 'Asia' }];
            RedisClient_1.default.get.mockResolvedValue(JSON.stringify(data));
            const result = await (0, CacheUtil_1.getCache)('regions');
            expect(RedisClient_1.default.get).toHaveBeenCalledWith('regions');
            expect(result).toEqual(data);
        });
        it('should return null if cache is empty', async () => {
            RedisClient_1.default.get.mockResolvedValue(null);
            const result = await (0, CacheUtil_1.getCache)('regions');
            expect(RedisClient_1.default.get).toHaveBeenCalledWith('regions');
            expect(result).toBeNull();
        });
    });
    describe('setCache', () => {
        it('should store data in redis with TTL', async () => {
            const data = [{ id: 1, name: 'Asia' }];
            await (0, CacheUtil_1.setCache)('regions', data, 60);
            expect(RedisClient_1.default.set).toHaveBeenCalledWith('regions', JSON.stringify(data), 'EX', 60);
        });
    });
});
