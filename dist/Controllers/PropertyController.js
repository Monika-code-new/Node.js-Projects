"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const PropertySchema_1 = require("../Schemas/PropertySchema");
const PropertyService_1 = require("../Services/PropertyService");
const Response_Util_1 = require("../Utils/Response.Util");
const StatusCode_Enum_1 = require("../Utils/StatusCode.Enum");
const AppError_1 = require("../Utils/AppError");
const Messages_Enum_1 = require("../Utils/Messages.Enum");
const Logger_1 = require("../Observability/Logger");
class PropertyController {
    static async getProperties(req, reply) {
        const start = Date.now();
        Logger_1.logger.info('PropertyController.getProperties started', {
            query: req.query,
            role: req.headers['role'],
            method: req.method,
            url: req.url
        });
        try {
            const parsedQuery = PropertySchema_1.getPropertiesQuerySchema.parse(req.query);
            const rawRole = req.headers['role'];
            const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : 'user';
            if (!Object.values(Messages_Enum_1.UserRole).includes(role)) {
                throw new AppError_1.AppError(Messages_Enum_1.errorMessage.INVALID_ROLE, StatusCode_Enum_1.HttpStatusCode.BAD_REQUEST);
            }
            const properties = await (0, PropertyService_1.getAllProperties)(parsedQuery, role);
            if (!properties || properties.length === 0) {
                throw new AppError_1.AppError(Messages_Enum_1.errorMessage.NO_PROPERTIES_FOUND, StatusCode_Enum_1.HttpStatusCode.NOT_FOUND);
            }
            Logger_1.logger.info('PropertyController.getProperties completed', {
                count: properties.length,
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            return (0, Response_Util_1.sendSuccessResponse)(reply, properties);
        }
        catch (error) {
            Logger_1.logger.error('PropertyController.getProperties failed', {
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - start,
                method: req.method,
                url: req.url
            });
            throw error;
        }
    }
}
exports.PropertyController = PropertyController;
