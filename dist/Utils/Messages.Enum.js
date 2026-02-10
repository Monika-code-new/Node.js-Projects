"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successMessage = exports.CACHE_KEYS = exports.cacheMessage = exports.UserRole = exports.errorMessage = void 0;
// Utils/messages.enum.ts
var errorMessage;
(function (errorMessage) {
    errorMessage["INTERNAL_SERVER"] = "Internal Server Error";
    errorMessage["VALIDATION_ERROR"] = "Validation Error";
    errorMessage["DESTINATION_NOT_FOUND"] = "Destination not found";
    errorMessage["NO_PROPERTIES_FOUND"] = "No properties found";
    errorMessage["INVALID_ROLE"] = "Invalid Role";
})(errorMessage || (exports.errorMessage = errorMessage = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var cacheMessage;
(function (cacheMessage) {
    cacheMessage["REGION_CACHE"] = "Regions cached successfully";
    cacheMessage["FAILED_CACHE_REGIONS"] = "Failed to cache regions";
    cacheMessage["REGIONS_NOT_FOUND"] = "Regions not found in cache";
    cacheMessage["FAILED_TO_FETCH"] = "Failed to fetch cache";
    cacheMessage["AIRPORT_CACHE"] = "airports cached successfully";
    cacheMessage["FAILED_CACHE_AIRPORT"] = "Failed to cache airports";
    cacheMessage["AIRPORT_NOT_FOUND"] = "airports not found in cache";
})(cacheMessage || (exports.cacheMessage = cacheMessage = {}));
var CACHE_KEYS;
(function (CACHE_KEYS) {
    CACHE_KEYS["REGIONS"] = "regions";
    CACHE_KEYS["AIRPORTS"] = "airports";
})(CACHE_KEYS || (exports.CACHE_KEYS = CACHE_KEYS = {}));
;
var successMessage;
(function (successMessage) {
    successMessage["Search_Started"] = "Search started";
})(successMessage || (exports.successMessage = successMessage = {}));
