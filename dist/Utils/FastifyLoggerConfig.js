"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Utils/FastifyLoggerConfig.ts
const fastifyLoggerConfig = {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV === 'production'
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
            },
        },
};
exports.default = fastifyLoggerConfig;
