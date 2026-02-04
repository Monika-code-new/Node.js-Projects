"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const StatusCode_Enum_1 = require("./StatusCode.Enum");
class AppError extends Error {
    constructor(message, statusCode = StatusCode_Enum_1.HttpStatusCode.BAD_REQUEST) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
