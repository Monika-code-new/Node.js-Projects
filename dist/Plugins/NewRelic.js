"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const Apm_1 = require("../Utils/Apm");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.addHook("onRequest", async (req) => {
        Apm_1.APM.attr({
            requestId: req.id,
            route: req.url,
            method: req.method
        });
    });
    fastify.addHook("onResponse", async (req, reply) => {
        Apm_1.APM.attr({
            statusCode: reply.statusCode
        });
    });
});
