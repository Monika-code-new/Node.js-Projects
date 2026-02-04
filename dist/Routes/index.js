"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AllRoutes;
const PropertyRoutes_1 = __importDefault(require("./PropertyRoutes"));
const CacheRoute_1 = __importDefault(require("./CacheRoute"));
async function AllRoutes(app) {
    await (0, PropertyRoutes_1.default)(app);
    // Cache routes
    await (0, CacheRoute_1.default)(app);
}
