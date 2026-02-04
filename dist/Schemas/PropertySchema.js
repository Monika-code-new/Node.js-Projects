"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertiesQuerySchema = void 0;
const zod_1 = require("zod");
exports.getPropertiesQuerySchema = zod_1.z.object({
    destinationId: zod_1.z
        .string()
        .optional()
        .transform(val => (val ? Number(val) : undefined)),
});
