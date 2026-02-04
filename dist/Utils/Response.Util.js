"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
const sendSuccessResponse = (reply, data) => {
    return reply.status(200).send({
        status: 'success',
        data,
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (reply, message, code = 400) => {
    return reply.status(code).send({
        status: 'error',
        message,
    });
};
exports.sendErrorResponse = sendErrorResponse;
