"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisKeys = void 0;
exports.redisKeys = {
    status: (id) => `search:${id}:status`,
    results: (id) => `search:${id}:results`,
};
