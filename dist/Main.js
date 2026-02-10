"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const ErrorHandler_1 = require("./Utils/ErrorHandler");
const FastifyLoggerConfig_1 = __importDefault(require("./Utils/FastifyLoggerConfig"));
const RedisClient_1 = __importStar(require("./RedisClient"));
const Routes_1 = __importDefault(require("./Routes"));
const RequestLogger_1 = require("./Plugins/RequestLogger");
async function start() {
    await (0, RedisClient_1.initRedis)();
    // Create Fastify instance
    const app = (0, fastify_1.default)({
        logger: FastifyLoggerConfig_1.default
    });
    await app.register(cors_1.default, {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    });
    await (0, RequestLogger_1.requestLogger)(app);
    app.decorate('redis', RedisClient_1.default);
    // Register centralized error handler
    app.setErrorHandler(ErrorHandler_1.errorHandler);
    // Register routes
    app.register(Routes_1.default, { prefix: '/api' });
    try {
        await app.listen({
            port: Number(process.env.PORT) || 3001,
            host: '0.0.0.0',
        });
        app.log.info('Server running on http://localhost:3000');
    }
    catch (error) {
        app.log.error(error, 'Failed to start server');
        process.exit(1);
    }
}
// Start the application
start();
