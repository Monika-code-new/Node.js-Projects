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

import winston from "winston";
import newrelicWinston from "@newrelic/winston-enricher";

const nrFormat = newrelicWinston({
  apiKey: process.env.NEW_RELIC_INSERT_KEY,
  serviceName: "nodejs",
}) as unknown as winston.Logform.Format;

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
export const slowLogger = winston.createLogger({
  level: "warn",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/slow-queries.log"
    }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error"
    })
  ]
});


