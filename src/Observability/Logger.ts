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
import newrelic from "newrelic";
import { getRequestId } from "./Context";

function write(level: string, msgOrObj: any, msgOrMeta?: any) {
  const linking = newrelic.getLinkingMetadata();

  let message: string;
  let meta: any = {};

  if (typeof msgOrObj === "string") {
    message = msgOrObj;
    meta = msgOrMeta || {};
  } else {
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
    requestId: getRequestId(),
    timestamp: new Date().toISOString(),
    ...linking,
    ...meta
  };

  console.log(JSON.stringify(log));
  newrelic.recordLogEvent(log);
}

export const logger = {
  info: (a: any, b?: any) => write("info", a, b),
  warn: (a: any, b?: any) => write("warn", a, b),
  error: (a: any, b?: any) => write("error", a, b),
  debug: (a: any, b?: any) => write("debug", a, b)
};
