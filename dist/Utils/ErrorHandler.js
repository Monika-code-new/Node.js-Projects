"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const AppError_1 = require("./AppError");
const Messages_Enum_1 = require("./Messages.Enum");
const errorHandler = (error, req, reply) => {
    if (error instanceof zod_1.ZodError) {
        return reply.status(400).send({
            status: 'error',
            message: Messages_Enum_1.errorMessage.VALIDATION_ERROR,
            details: error.issues.map((issue) => issue.message),
        });
    }
    if (error instanceof AppError_1.AppError) {
        return reply.status(error.statusCode).send({
            status: 'error',
            message: error.message,
        });
    }
    console.error('Unhandled Error:', error);
    return reply.status(500).send({
        status: 'error',
        message: Messages_Enum_1.errorMessage.INTERNAL_SERVER,
    });
};
exports.errorHandler = errorHandler;
