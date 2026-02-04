"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CacheRoutes;
const CacheController_1 = require("../Controllers/CacheController");
async function CacheRoutes(app) {
    // Regions
    app.post('/cache/regions', CacheController_1.CacheController.cacheRegions);
    app.get('/cache/regions', CacheController_1.CacheController.getRegions);
    // Airports
    app.post('/cache/airports', CacheController_1.CacheController.cacheAirports);
    app.get('/cache/airports', CacheController_1.CacheController.getAirports);
}
