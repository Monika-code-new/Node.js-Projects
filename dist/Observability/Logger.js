"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
/* import newrelic from "newrelic";
import { getRequestId } from "./Context";

function write(level: string, message: string, meta?: any) {
  const linking = newrelic.getLinkingMetadata();

  const log = {
    level,
    message,
    requestId: getRequestId(),
    timestamp: new Date().toISOString(),
    ...linking,
    ...meta
  };

  console.log(JSON.stringify(log));
  newrelic.recordLogEvent(log);
}

export const logger = {
  info: (m: string, meta?: any) => write("info", m, meta),
  warn: (m: string, meta?: any) => write("warn", m, meta),
  error: (m: string, meta?: any) => write("error", m, meta),
  debug: (m: string, meta?: any) => write("debug", m, meta)
};
 */
const newrelic_1 = __importDefault(require("newrelic"));
const Context_1 = require("./Context");
function write(level, msgOrObj, msgOrMeta) {
    const linking = newrelic_1.default.getLinkingMetadata();
    let message;
    let meta = {};
    if (typeof msgOrObj === "string") {
        message = msgOrObj;
        meta = msgOrMeta || {};
    }
    else {
        message = msgOrMeta || "";
        meta = msgOrObj;
    }
    if (meta && typeof meta === "object" && meta.reqId && !meta.requestId) {
        meta.requestId = meta.reqId;
        delete meta.reqId;
    }
    const log = {
        level,
        message,
        requestId: (0, Context_1.getRequestId)(),
        timestamp: new Date().toISOString(),
        ...linking,
        ...meta
    };
    console.log(JSON.stringify(log));
    newrelic_1.default.recordLogEvent(log);
}
exports.logger = {
    info: (a, b) => write("info", a, b),
    warn: (a, b) => write("warn", a, b),
    error: (a, b) => write("error", a, b),
    debug: (a, b) => write("debug", a, b)
};
