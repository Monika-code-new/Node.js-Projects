"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequest = void 0;
const Client_1 = require("../Prisma/Client");
const logRequest = async (endpoint, ipAddress) => {
    try {
        await Client_1.prisma.requestLog.create({
            data: {
                endpoint,
                ipAddress,
            },
        });
    }
    catch (error) {
        console.error('Failed to log request:', error);
    }
};
exports.logRequest = logRequest;
