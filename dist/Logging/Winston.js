"use strict";
/* import winston from "winston"

export const slowLogger = winston.createLogger({
 level: "warn",
 format: winston.format.json(),
 transports: [
  new winston.transports.File({ filename: "logs/slow-queries.log" }),
  new winston.transports.File({ filename: "logs/errors.log" })
 ]
})
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slowLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_enricher_1 = __importDefault(require("@newrelic/winston-enricher"));
const nrFormat = (0, winston_enricher_1.default)({
    apiKey: process.env.NEW_RELIC_INSERT_KEY,
    serviceName: "nodejs",
});
/* export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    nrFormat,
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/errors.log", level: "error" }),
    new winston.transports.File({ filename: "logs/slow-queries.log", level: "warn" }),
    new winston.transports.Console({ level: "info" }),
  ],
}); */
exports.slowLogger = winston_1.default.createLogger({
    level: "warn",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({
            filename: "logs/slow-queries.log"
        }),
        new winston_1.default.transports.File({
            filename: "logs/errors.log",
            level: "error"
        })
    ]
});
