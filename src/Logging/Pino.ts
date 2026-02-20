/* import pino from "pino"

export const logger = pino({
 level: process.env.LOG_LEVEL || "info",

 formatters: {
  level(label) {
   return { level: label }
  }
 },

 timestamp: pino.stdTimeFunctions.isoTime,

 base: {
  service: "destination-property-api",
  env: process.env.NODE_ENV
 },

 redact: [
  "req.headers.authorization",
  "password",
  "token"
 ]
})
 */
/* import pino from "pino";
import { getContext } from "../Utils/RequestContext";

export const logger = pino({
 level: "info",

 mixin() {
  return { reqId: getContext("reqId") };
 },

 timestamp: pino.stdTimeFunctions.isoTime
}); */
 /* import pino from "pino";
import newrelicFormatter from "@newrelic/pino-enricher";
import { getContext } from "../Utils/RequestContext";

const nrFormatter = newrelicFormatter();

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  base: {
    service: "destination-property-api",
    env: process.env.NODE_ENV
  },

  formatters: {
    log(object) {
      return {
        ...object,
        reqId: getContext("reqId"),
        ...nrFormatter(object)
      };
    }
  },

  timestamp: pino.stdTimeFunctions.isoTime
}); */
 // Logging/Pino.ts
/* import pino from "pino";
import newrelicFormatter from "@newrelic/pino-enricher";
import { getContext } from "../Middleware/RequestContext";

const nrFormatter = newrelicFormatter();

export const pinoConfig = {
  level: process.env.LOG_LEVEL || "info",
  base: {
    service: "destination-property-api",
    env: process.env.NODE_ENV || "development",
  },
  formatters: {
    log(object: any) {
      return {
        ...object,
        reqId: getContext("reqId"),
        ...nrFormatter(object),
      };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
}; */
/* import newrelic from "newrelic";
import { getContext } from "../Middleware/RequestContext";
import pino from "pino";

function getNrMetadata() {
  const trace = newrelic.getTraceMetadata(); // safe
  return {
    nrTraceId: trace?.traceId,
    nrSpanId: trace?.spanId,
  };
}

export const pinoConfig = {
  level: process.env.LOG_LEVEL || "info",
  base: {
    service: "destination-property-api",
    env: process.env.NODE_ENV || "development",
  },
  formatters: {
    log(obj: any) {
      return {
        ...obj,
        reqId: getContext("reqId"),
        ...getNrMetadata(), // ✅ safe, no function call to nrFormatter
      };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger = pino(pinoConfig); // optional standalone logger
 */
/* import newrelic from "newrelic";
//import { getContext } from "../Middleware/RequestContext";

type Level = "debug" | "info" | "warn" | "error";

function normalizeArgs(args: any[]) {
  if (args.length === 0) return { message: "", attrs: {} as Record<string, any> };

  if (typeof args[0] === "string") {
    return {
      message: args[0],
      attrs: (args[1] && typeof args[1] === "object") ? args[1] : {},
    };
  }

  if (typeof args[0] === "object" && typeof args[1] === "string") {
    return { message: args[1], attrs: args[0] || {} };
  }

  if (typeof args[0] === "object") {
    return { message: "", attrs: args[0] || {} };
  }

  return { message: String(args[0]), attrs: {} as Record<string, any> };
}

function log(level: Level, ...args: any[]) {
  const { message, attrs } = normalizeArgs(args);
  //const reqId = getContext("reqId");
  const trace = newrelic.getTraceMetadata();

  const payload = {
    ...attrs,
    reqId,
    nrTraceId: trace?.traceId,
    nrSpanId: trace?.spanId,
  };

  try {
    newrelic.recordLogEvent({
      level,
      message: message || "",
      ...payload,
    });
  } catch (_) {
    // Keep app logging resilient if agent API call fails.
  }

  const line = {
    level,
    message,
    ...payload,
    timestamp: new Date().toISOString(),
  };

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (...args: any[]) => log("debug", ...args),
  info: (...args: any[]) => log("info", ...args),
  warn: (...args: any[]) => log("warn", ...args),
  error: (...args: any[]) => log("error", ...args),
};

// Fastify logger disabled; app logs are emitted through logger above.
export const pinoConfig = false;
 
 */