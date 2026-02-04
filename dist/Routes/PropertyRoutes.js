"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertyRoutes;
const PropertyController_1 = require("../Controllers/PropertyController");
async function PropertyRoutes(app) {
    app.get('/properties', PropertyController_1.PropertyController.getProperties);
}
