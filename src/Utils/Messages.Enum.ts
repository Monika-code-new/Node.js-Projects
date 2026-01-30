// Utils/messages.enum.ts
export enum errorMessage {
  INTERNAL_SERVER = 'Internal Server Error',
  VALIDATION_ERROR = 'Validation Error',
  DESTINATION_NOT_FOUND = 'Destination not found',
  NO_PROPERTIES_FOUND = 'No properties found',
  INVALID_ROLE ='Invalid Role'
}
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
export enum cacheMessage {
  REGION_CACHE = 'Regions cached successfully',
  FAILED_CACHE_REGIONS ='Failed to cache regions',
  REGIONS_NOT_FOUND = 'Regions not found in cache',
  FAILED_TO_FETCH ='Failed to fetch cache',
  AIRPORT_CACHE = 'airports cached successfully',
  FAILED_CACHE_AIRPORT ='Failed to cache airports',
  AIRPORT_NOT_FOUND = 'airports not found in cache',
}
