"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProperties = void 0;
const Client_1 = require("../Prisma/Client");
const AppError_1 = require("../Utils/AppError");
const Messages_Enum_1 = require("../Utils/Messages.Enum");
const StatusCode_Enum_1 = require("../Utils/StatusCode.Enum");
const DestinationContact_util_1 = require("../Utils/DestinationContact.util");
const RedisClient_1 = require("../RedisClient");
//const CACHE_TTL = 60; // seconds
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '60', 10);
const getAllProperties = async (parsedQuery, role) => {
    const { destinationId } = parsedQuery;
    const isAdmin = role === 'admin';
    const cacheKey = `properties:${role}:${JSON.stringify(parsedQuery)}`;
    //CACHE READ 
    try {
        const cachedData = await RedisClient_1.redis.get(cacheKey);
        if (cachedData) {
            console.log('Cache HIT');
            return JSON.parse(cachedData);
        }
    }
    catch (err) {
        console.warn('Redis GET failed, skipping cache');
    }
    //DESTINATION AIRPORTS 
    const getDestinationAirports = async (properties) => {
        const airportIdsSet = new Set();
        properties.forEach(p => {
            const metadata = p.destination.metadata;
            (metadata.airportIds || []).forEach(id => airportIdsSet.add(id));
        });
        const airportIds = Array.from(airportIdsSet);
        const airports = airportIds.length
            ? await Client_1.prisma.airport.findMany({
                where: { id: { in: airportIds } },
                select: { id: true, name: true },
            })
            : [];
        const airportMap = new Map();
        airports.forEach(a => airportMap.set(a.id, a));
        const destinationAirportMap = new Map();
        properties.forEach(p => {
            const metadata = p.destination.metadata;
            const ids = metadata.airportIds || [];
            destinationAirportMap.set(p.destination.id, ids
                .map(id => airportMap.get(id))
                .filter(Boolean));
        });
        return destinationAirportMap;
    };
    //await prisma.$queryRaw`SELECT *, SLEEP(12) FROM Property LIMIT 1`;
    // NO DESTINATION FILTER 
    if (!destinationId) {
        /* let properties: any[] = [];
   const maxDurationMs = 15000; // 15 seconds
   const startTotal = Date.now();
   
   while (Date.now() - startTotal < maxDurationMs) {
     const start = Date.now();
   
     properties = await prisma.property.findMany({
       where: isAdmin
         ? {}
         : {
             isActive: true,
             destination: { active: true },
           },
       include: {
         destination: {
           select: { id: true, name: true, metadata: true },
         },
         region: { select: { name: true } },
        
         
       },
       orderBy: { id: 'asc' },
       take: 15000, // fetch many rows to increase query time
     });
   
     const duration = Date.now() - start;
     console.log(`Iteration query duration: ${duration}ms`);
   
     
   } */
        // Testing only — adds artificial delay inside Prisma query
        const properties = await Client_1.prisma.property.findMany({
            where: isAdmin
                ? {}
                : {
                    isActive: true,
                    destination: { active: true },
                },
            include: {
                destination: { select: { id: true, name: true, metadata: true } },
                region: { select: { name: true } },
            },
        });
        // Artificial delay to exceed threshold
        await new Promise(resolve => setTimeout(resolve, 11000)); // 11 seconds
        if (!properties.length) {
            throw new AppError_1.AppError(Messages_Enum_1.errorMessage.NO_PROPERTIES_FOUND, StatusCode_Enum_1.HttpStatusCode.NOT_FOUND);
        }
        const destinationAirportMap = await getDestinationAirports(properties);
        const response = await Promise.all(properties.map(async (p) => {
            const destination_contact_number = await (0, DestinationContact_util_1.findDestinationContact)(p.destination.id);
            return {
                id: p.id,
                name: p.name,
                destination_id: p.destination.id,
                destination_name: p.destination.name,
                address: p.address,
                contact_number: p.contactNumber,
                destination_contact_number,
                description: p.description,
                region_name: p.region.name,
                airports: destinationAirportMap.get(p.destination.id) || [],
            };
        }));
        try {
            await RedisClient_1.redis.set(cacheKey, JSON.stringify(response), 'EX', CACHE_TTL);
        }
        catch (err) {
            console.warn('Redis SET failed, skipping cache');
        }
        return response;
    }
    const destinations = await Client_1.prisma.destination.findMany({
        where: {
            OR: [{ id: destinationId }, { parentId: destinationId }],
            ...(isAdmin ? {} : { active: true }),
        },
        select: { id: true },
    });
    if (!destinations.length) {
        throw new AppError_1.AppError(Messages_Enum_1.errorMessage.DESTINATION_NOT_FOUND, StatusCode_Enum_1.HttpStatusCode.NOT_FOUND);
    }
    const destinationIds = destinations.map(d => d.id);
    const properties = await Client_1.prisma.property.findMany({
        where: {
            destinationId: { in: destinationIds },
            ...(isAdmin
                ? {}
                : {
                    isActive: true,
                    destination: { active: true },
                }),
        },
        orderBy: { id: 'asc' },
        include: {
            destination: {
                select: { id: true, name: true, metadata: true },
            },
            region: { select: { name: true } },
        },
    });
    if (!properties.length) {
        throw new AppError_1.AppError(Messages_Enum_1.errorMessage.NO_PROPERTIES_FOUND, StatusCode_Enum_1.HttpStatusCode.NOT_FOUND);
    }
    const destinationAirportMap = await getDestinationAirports(properties);
    const response = await Promise.all(properties.map(async (p) => {
        const destination_contact_number = await (0, DestinationContact_util_1.findDestinationContact)(p.destination.id);
        return {
            id: p.id,
            name: p.name,
            destination_id: p.destination.id,
            destination_name: p.destination.name,
            address: p.address,
            contact_number: p.contactNumber,
            destination_contact_number,
            description: p.description,
            region_name: p.region.name,
            airports: destinationAirportMap.get(p.destination.id) || [],
        };
    }));
    try {
        await RedisClient_1.redis.set(cacheKey, JSON.stringify(response), 'EX', CACHE_TTL);
    }
    catch (err) {
        console.warn('Redis SET failed, skipping cache');
    }
    return response;
};
exports.getAllProperties = getAllProperties;
