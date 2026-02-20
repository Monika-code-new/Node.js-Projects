"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ivectorRequest = ivectorRequest;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function ivectorRequest(config) {
    const start = Date.now();
    try {
        const response = await (0, axios_1.default)(config);
        await prisma.ivRequestLog.create({
            data: {
                url: config.url,
                method: config.method,
                requestBody: config.data ?? null,
                statusCode: response.status,
                durationMs: Date.now() - start,
                status: "SUCCESS",
            },
        });
        return response.data;
    }
    catch (error) {
        await prisma.ivRequestLog.create({
            data: {
                url: config.url,
                method: config.method,
                requestBody: config.data ?? null,
                statusCode: error.response?.status ?? null,
                durationMs: Date.now() - start,
                status: "ERROR",
                error: error.message,
            },
        });
        throw error;
    }
}
