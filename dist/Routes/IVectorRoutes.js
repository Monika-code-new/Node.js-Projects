"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ivectorRoutes = ivectorRoutes;
const IVectorController_1 = __importDefault(require("../Controllers/IVectorController"));
async function ivectorRoutes(app) {
    app.post('/property-search/start', IVectorController_1.default.startSearch);
    app.get('/property-search/status', IVectorController_1.default.getSearchResult);
}
