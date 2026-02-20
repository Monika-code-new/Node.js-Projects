"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processIvectorSearch = processIvectorSearch;
/*
import axios from 'axios';
import {redis} from '../RedisClient';
import { prisma } from '../Prisma/Client';
import { redisKeys } from '../Constants/RedisKeys';
import { ivectorXmlRequests } from '../Utils/IvectorXmlRequests';
import { parseIvectorXML } from '../Utils/XmlParser';

 async function callIvectorAPI(xml: string): Promise<string> {
  const response = await axios.post(process.env.IVECTOR_URL, xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
  
  return response.data;
}


function extractPropertyRefIds(properties: any[]): number[] {
  return properties.map(p => Number(p.iv_reference_id)).filter(Boolean);
}

async function fetchDbProperties(propertyRefIds: number[]) {
  return prisma.travelProperties.findMany({
    where: {
      iv_reference_id: { in: propertyRefIds },
      deleted_at: null,
    },
    select: {
      iv_reference_id: true,
      name: true,
      metadata: true,
      suspended: true,
      top: true,
      page: { select: { id: true, name: true } },
      rating: { select: { id: true, name: true, iv_code: true } },
    },
  });
}

function buildPropertyMap(dbProperties: any[]) {
  return new Map<number, any>(dbProperties.map(p => [p.iv_reference_id, p]));
}

async function pushResultsToRedis(
  searchId: string,
  properties: any[],
  propertyMap: Map<number, any>,
  startIndex: number
) {
  const dedupe = new Set<string>();
  const results: string[] = [];
  let responseIndex = startIndex;

  for (const property of properties) {
    const refId = Number(property.iv_reference_id);
    if (!refId) continue;

    const dbProp = propertyMap.get(refId);
    if (!dbProp) continue;

    // Normalize rooms safely (your XML gives many nulls)
   const rooms = Array.isArray(property.import_rooms)
  ? property.import_rooms.filter(Boolean)
  : [];


    // If no valid rooms → still push ONE row so UI can render property
    if (rooms.length === 0) {
      results.push(
        JSON.stringify({
          responseIndex: responseIndex++,
          propertyRef: refId,
          roomName: 'Standard Room',
          propertyName: dbProp.name,

          metadata: dbProp.metadata
            ? {
                shortDescription:
                  dbProp.metadata.short_description ?? null,
                image:
                  dbProp.metadata.image ??
                  (dbProp.metadata.listing_image
                    ? `${dbProp.metadata.listing_image}`
                    : null),
              }
            : null,

          suspended: dbProp.suspended,
          top: dbProp.top,

          page: dbProp.page
            ? {
                id: dbProp.page.id,
                name: dbProp.page.name,
              }
            : null,

          rating: dbProp.rating
            ? {
                id: dbProp.rating.id,
                name: dbProp.rating.name,
                ivCode: dbProp.rating.iv_code,
              }
            : null,
        })
      );

      continue;
    }

    //  push per room
    for (const room of rooms) {
      const roomName = room?.metadata?.room_type || 'Standard Room';

      const dedupeKey = `${refId}-${roomName}`;
      if (dedupe.has(dedupeKey)) continue;
      dedupe.add(dedupeKey);

      results.push(
        JSON.stringify({
          responseIndex: responseIndex++,
          propertyRef: refId,
          roomName,
          propertyName: dbProp.name,

          metadata: dbProp.metadata
            ? {
                shortDescription:
                  dbProp.metadata.short_description ?? null,
                image:
                  dbProp.metadata.image ??
                  (dbProp.metadata.listing_image
                    ? `${dbProp.metadata.listing_image}`
                    : null),
              }
            : null,

          suspended: dbProp.suspended,
          top: dbProp.top,

          page: dbProp.page
            ? {
                id: dbProp.page.id,
                name: dbProp.page.name,
              }
            : null,

          rating: dbProp.rating
            ? {
                id: dbProp.rating.id,
                name: dbProp.rating.name,
                ivCode: dbProp.rating.iv_code,
              }
            : null,
        })
      );
    }
  }

  if (results.length > 0) {
    await redis.rpush(redisKeys.results(searchId), ...results);
  }

  return responseIndex;
}


export async function processIvectorSearch(searchId: string) {
  try {
    let responseIndex = 0;

    for (const xml of ivectorXmlRequests) {
      //  Call iVector API
      const xmlResponse = await callIvectorAPI(xml);

      // 2. Parse XML response
      const properties = await parseIvectorXML(xmlResponse);
      if (!properties.length) continue;

      // 3. Extract property reference IDs
      const propertyRefIds = extractPropertyRefIds(properties);
      if (!propertyRefIds.length) continue;

      // 4. Fetch DB properties
      const dbProperties = await fetchDbProperties(propertyRefIds);
      if (!dbProperties.length) continue;

      // 5. Build lookup map
      const propertyMap = buildPropertyMap(dbProperties);

      // 6. Push enriched results to Redis
      responseIndex = await pushResultsToRedis(
        searchId,
        properties,
        propertyMap,
        responseIndex
      );
    }

    // 7. Mark search as completed
    await redis.set(
      redisKeys.status(searchId),
      'ENDED',
      'EX',
      Number(process.env.IVECTOR_TTL)
    );
  } catch (error) {
    console.error('iVector search failed', error);

    await redis.set(
      redisKeys.status(searchId),
      'FAILED',
      'EX',
      Number(process.env.IVECTOR_TTL)
    );
  }
}
 */
const axios_1 = __importDefault(require("axios"));
const RedisClient_1 = require("../RedisClient");
const Client_1 = require("../Prisma/Client");
const RedisKeys_1 = require("../Constants/RedisKeys");
const IvectorXmlRequests_1 = require("../Utils/IvectorXmlRequests");
const XmlParser_1 = require("../Utils/XmlParser");
const Logger_1 = require("../Observability/Logger");
const Context_1 = require("../Observability/Context");
const FunctionTimer_1 = require("../Observability/FunctionTimer");
/**
 * Call iVector API with logging
 */
async function callIvectorAPI(xml, searchId) {
    const requestId = (0, Context_1.getRequestId)();
    return (0, FunctionTimer_1.timeFunction)("IVectorService.callIvectorAPI", async () => {
        const response = await axios_1.default.post(process.env.IVECTOR_URL, xml, {
            headers: { "Content-Type": "application/xml" },
        });
        Logger_1.logger.info("iVector API call succeeded", {
            type: "external",
            functionName: "IVectorService.callIvectorAPI",
            requestId,
            searchId,
            target: process.env.IVECTOR_URL,
            requestPayloadSize: xml.length,
            responseSize: JSON.stringify(response.data).length,
            status: response.status,
        });
        return response.data;
    }, {
        type: "external",
        functionName: "IVectorService.callIvectorAPI",
        requestId,
        searchId,
        target: process.env.IVECTOR_URL
    });
}
/**
 * Extract property reference IDs
 */
function extractPropertyRefIds(properties) {
    return properties.map((p) => Number(p.iv_reference_id)).filter(Boolean);
}
/**
 * Fetch DB properties with Prisma + logging
 */
async function fetchDbProperties(propertyRefIds, searchId) {
    const requestId = (0, Context_1.getRequestId)();
    return (0, FunctionTimer_1.timeFunction)("IVectorService.fetchDbProperties", async () => {
        const result = await Client_1.prisma.travelProperties.findMany({
            where: {
                iv_reference_id: { in: propertyRefIds },
                deleted_at: null,
            },
            select: {
                iv_reference_id: true,
                name: true,
                metadata: true,
                suspended: true,
                top: true,
                page: { select: { id: true, name: true } },
                rating: { select: { id: true, name: true, iv_code: true } },
            },
        });
        Logger_1.logger.info("Fetched DB properties", {
            type: "prisma",
            functionName: "IVectorService.fetchDbProperties",
            requestId,
            searchId,
            count: result.length,
        });
        return result;
    }, {
        type: "prisma",
        functionName: "IVectorService.fetchDbProperties",
        requestId,
        searchId
    });
}
/**
 * Build map of DB properties
 */
function buildPropertyMap(dbProperties) {
    return new Map(dbProperties.map((p) => [p.iv_reference_id, p]));
}
/**
 * Push enriched results to Redis + logging
 */
async function pushResultsToRedis(searchId, properties, propertyMap, startIndex) {
    const requestId = (0, Context_1.getRequestId)();
    return (0, FunctionTimer_1.timeFunction)("IVectorService.pushResultsToRedis", async () => {
        const results = [];
        const dedupe = new Set();
        let responseIndex = startIndex;
        for (const property of properties) {
            const refId = Number(property.iv_reference_id);
            if (!refId)
                continue;
            const dbProp = propertyMap.get(refId);
            if (!dbProp)
                continue;
            const rooms = Array.isArray(property.import_rooms)
                ? property.import_rooms.filter(Boolean)
                : [];
            if (rooms.length === 0) {
                results.push(JSON.stringify({
                    responseIndex: responseIndex++,
                    propertyRef: refId,
                    roomName: "Standard Room",
                    propertyName: dbProp.name,
                    metadata: dbProp.metadata
                        ? {
                            shortDescription: dbProp.metadata.short_description ?? null,
                            image: dbProp.metadata.image ??
                                dbProp.metadata.listing_image ??
                                null,
                        }
                        : null,
                    suspended: dbProp.suspended,
                    top: dbProp.top,
                    page: dbProp.page ?? null,
                    rating: dbProp.rating ?? null,
                }));
                continue;
            }
            for (const room of rooms) {
                const roomName = room?.metadata?.room_type || "Standard Room";
                const dedupeKey = `${refId}-${roomName}`;
                if (dedupe.has(dedupeKey))
                    continue;
                dedupe.add(dedupeKey);
                results.push(JSON.stringify({
                    responseIndex: responseIndex++,
                    propertyRef: refId,
                    roomName,
                    propertyName: dbProp.name,
                    metadata: dbProp.metadata
                        ? {
                            shortDescription: dbProp.metadata.short_description ?? null,
                            image: dbProp.metadata.image ??
                                dbProp.metadata.listing_image ??
                                null,
                        }
                        : null,
                    suspended: dbProp.suspended,
                    top: dbProp.top,
                    page: dbProp.page ?? null,
                    rating: dbProp.rating ?? null,
                }));
            }
        }
        if (results.length > 0) {
            await RedisClient_1.redis.rpush(RedisKeys_1.redisKeys.results(searchId), ...results);
            Logger_1.logger.info("Pushed results to Redis", {
                type: "redis",
                functionName: "IVectorService.pushResultsToRedis",
                requestId,
                searchId,
                count: results.length,
            });
        }
        return responseIndex;
    }, {
        type: "redis",
        functionName: "IVectorService.pushResultsToRedis",
        requestId,
        searchId
    });
}
/**
 * Main process: iVector search
 */
async function processIvectorSearch(searchId) {
    const requestId = (0, Context_1.getRequestId)();
    try {
        let responseIndex = 0;
        for (const xml of IvectorXmlRequests_1.ivectorXmlRequests) {
            // 1️⃣ Call iVector API
            const xmlResponse = await callIvectorAPI(xml, searchId);
            // 2️⃣ Parse XML
            const properties = await (0, XmlParser_1.parseIvectorXML)(xmlResponse);
            if (!properties.length)
                continue;
            // 3️⃣ Extract propertyRefIds
            const propertyRefIds = extractPropertyRefIds(properties);
            if (!propertyRefIds.length)
                continue;
            // 4️⃣ Fetch DB properties
            const dbProperties = await fetchDbProperties(propertyRefIds, searchId);
            if (!dbProperties.length)
                continue;
            // 5️⃣ Build lookup map
            const propertyMap = buildPropertyMap(dbProperties);
            // 6️⃣ Push enriched results to Redis
            responseIndex = await pushResultsToRedis(searchId, properties, propertyMap, responseIndex);
        }
        // 7️⃣ Mark search as completed
        await RedisClient_1.redis.set(RedisKeys_1.redisKeys.status(searchId), "ENDED", "EX", Number(process.env.IVECTOR_TTL));
        Logger_1.logger.info("iVector search completed", {
            type: "ivector",
            functionName: "IVectorService.processIvectorSearch",
            requestId,
            searchId,
        });
    }
    catch (error) {
        await RedisClient_1.redis.set(RedisKeys_1.redisKeys.status(searchId), "FAILED", "EX", Number(process.env.IVECTOR_TTL));
        Logger_1.logger.error("iVector search failed", {
            type: "ivector",
            functionName: "IVectorService.processIvectorSearch",
            requestId,
            searchId,
            error: error.message,
        });
    }
}
