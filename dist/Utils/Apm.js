"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APM = void 0;
/* import newrelic from "newrelic"

export const APM = {
 trace: newrelic.startSegment,
 error: newrelic.noticeError,
 attr: newrelic.addCustomAttributes
}
 */
const newrelic_1 = __importDefault(require("newrelic"));
exports.APM = {
    attr: (data) => {
        newrelic_1.default.addCustomAttributes(data);
    },
    error: (err) => {
        if (err instanceof Error) {
            newrelic_1.default.noticeError(err);
        }
        else {
            newrelic_1.default.noticeError(new Error(JSON.stringify(err)));
        }
    },
    segment: async (name, fn) => {
        return newrelic_1.default.startSegment(name, true, fn);
    }
};
