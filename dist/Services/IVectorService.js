"use strict";
/* import axios from 'axios';
import redis from '../RedisClient';
import { redisKeys } from '../Constants/RedisKeys';
import { ivectorXmlRequests } from '../Utils/IvectorXmlRequests';
import { parseIvectorXML } from '../Utils/XmlParser';

export async function processIvectorSearch(searchId: string) {
  try {
    // Map each XML request to a promise
    const requests = ivectorXmlRequests.map(async (xml, index) => {
      const response = await axios.post(process.env.IVECTOR_URL, xml, {
        headers: { 'Content-Type': 'application/xml' },
      });

      const properties = await parseIvectorXML(response.data);
      console.log(`XML ${index} finished with ${properties.length} properties`);



      const uniqueRooms = new Set<string>();

      for (const property of properties) {
        for (const roomName of property.rooms) {
          const dedupeKey = `${roomName}-${property.propertyRef}`;
          if (uniqueRooms.has(dedupeKey)) continue;

          uniqueRooms.add(dedupeKey);

          await redis.rpush(
            redisKeys.results(searchId),
            JSON.stringify({
              responseIndex: index,
              roomName,
              propertyRef: property.propertyRef,
            })
          );
        }
      }
    });

  
    await Promise.all(requests);

    // Set expiration and status
    await redis.expire(redisKeys.results(searchId), process.env.IVECTOR_TTL);
    await redis.set(redisKeys.status(searchId), 'ENDED', 'EX', process.env.IVECTOR_TTL);
  } catch (error) {
    console.error('iVector failed', error);
    await redis.set(redisKeys.status(searchId), 'FAILED', 'EX', process.env.IVECTOR_TTL);
  }
}


 
 */
/* import axios from 'axios';
import redis from '../RedisClient';
import { prisma } from '../Prisma/Client';
import { redisKeys } from '../Constants/RedisKeys';
import { ivectorXmlRequests } from '../Utils/IvectorXmlRequests';
import { parseIvectorXML } from '../Utils/XmlParser';


async function callIvectorAPI(xml: string): Promise<string> {
  const response = await axios.post(
    process.env.IVECTOR_URL,
    xml,
    { headers: { 'Content-Type': 'application/xml' } }
  );

  return response.data;
}

function extractPropertyRefIds(properties: any[]): number[] {
  return properties
    .map(p => Number(p.propertyRef))
    .filter(Boolean);
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
      meta_content: true,
      metadata:true,
      suspended: true,
      top: true,
      page: {
        select: {
          id: true,
          name: true,
        },
      },
      rating: {
        select: {
          id: true,
          name: true,
          iv_code: true,
        },
      },
    },
  });
}

function buildPropertyMap(dbProperties: any[]) {
  return new Map<number, any>(
    dbProperties.map(p => [p.iv_reference_id, p])
  );
}

async function pushResultsToRedis(
  searchId: string,
  responseIndex: number,
  properties: any[],
  propertyMap: Map<number, any>
) {
  const dedupe = new Set<string>();
  const results: string[] = [];

  for (const property of properties) {
    const refId = Number(property.propertyRef);
    const dbProp = propertyMap.get(refId);
    if (!dbProp) continue;

    for (const roomName of property.rooms) {
      const dedupeKey = `${roomName}-${refId}`;
      if (dedupe.has(dedupeKey)) continue;
      dedupe.add(dedupeKey);

      results.push(
        JSON.stringify({
         
          propertyRef: refId,
          roomName,

          propertyName: dbProp.name,
          //metaContent: dbProp.meta_content,
         metadata: dbProp.metadata
      ? {
          shortDescription: dbProp.metadata.short_description ?? null,
          image:
            dbProp.metadata.image ??
            (dbProp.metadata.listing_image
              ? `${process.env.CDN_BASE_URL}/${dbProp.metadata.listing_image}`
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
}



export async function processIvectorSearch(searchId: string) {
  try {
    const requests = ivectorXmlRequests.map(async (xml, index) => {
      // 1. Call iVector API
      const xmlResponse = await callIvectorAPI(xml);

      // 2. Parse XML response
      const properties = await parseIvectorXML(xmlResponse);
      if (!properties.length) return;

      // 3. Extract property reference IDs
      const propertyRefIds = extractPropertyRefIds(properties);
      if (!propertyRefIds.length) return;

      // 4. Fetch DB properties
      const dbProperties = await fetchDbProperties(propertyRefIds);
      if (!dbProperties.length) return;

      // 5. Build lookup map
      const propertyMap = buildPropertyMap(dbProperties);

      // 6. Push enriched results to Redis
      await pushResultsToRedis(
        searchId,
        index,
        properties,
        propertyMap
      );
    });

    await Promise.all(requests);

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processIvectorSearch = processIvectorSearch;
const axios_1 = __importDefault(require("axios"));
const RedisClient_1 = __importDefault(require("../RedisClient"));
const Client_1 = require("../Prisma/Client");
const RedisKeys_1 = require("../Constants/RedisKeys");
const IvectorXmlRequests_1 = require("../Utils/IvectorXmlRequests");
const XmlParser_1 = require("../Utils/XmlParser");
async function callIvectorAPI(xml) {
    const response = await axios_1.default.post(process.env.IVECTOR_URL, xml, {
        headers: { 'Content-Type': 'application/xml' },
    });
    return response.data;
}
function extractPropertyRefIds(properties) {
    return properties.map(p => Number(p.iv_reference_id)).filter(Boolean);
}
async function fetchDbProperties(propertyRefIds) {
    return Client_1.prisma.travelProperties.findMany({
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
function buildPropertyMap(dbProperties) {
    return new Map(dbProperties.map(p => [p.iv_reference_id, p]));
}
/* async function pushResultsToRedis(
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
    const dbProp = propertyMap.get(refId);
    if (!dbProp) continue;

    for (const room of property.import_rooms ?? []) {
      const roomName = room.room_type_id || 'Unknown Room';
      const dedupeKey = `${refId}-${roomName}`;
      if (dedupe.has(dedupeKey)) continue;
      dedupe.add(dedupeKey);

      results.push(
        JSON.stringify({
          responseIndex: responseIndex++, // increment per room
          propertyRef: refId,
          roomName,
          propertyName: dbProp.name,
          metadata: dbProp.metadata
            ? {
                shortDescription: dbProp.metadata.short_description ?? null,
                image: dbProp.metadata.image
                 
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
} */
async function pushResultsToRedis(searchId, properties, propertyMap, startIndex) {
    const dedupe = new Set();
    const results = [];
    let responseIndex = startIndex;
    for (const property of properties) {
        const refId = Number(property.iv_reference_id);
        if (!refId)
            continue;
        const dbProp = propertyMap.get(refId);
        if (!dbProp)
            continue;
        // Normalize rooms safely (your XML gives many nulls)
        const rooms = Array.isArray(property.import_rooms)
            ? property.import_rooms.filter(Boolean)
            : [];
        // 🔹 If no valid rooms → still push ONE row so UI can render property
        if (rooms.length === 0) {
            results.push(JSON.stringify({
                responseIndex: responseIndex++,
                propertyRef: refId,
                roomName: 'Standard Room',
                propertyName: dbProp.name,
                metadata: dbProp.metadata
                    ? {
                        shortDescription: dbProp.metadata.short_description ?? null,
                        image: dbProp.metadata.image ??
                            (dbProp.metadata.listing_image
                                ? `${process.env.CDN_BASE_URL}/${dbProp.metadata.listing_image}`
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
            }));
            continue;
        }
        // 🔹 Normal case: push per room
        for (const room of rooms) {
            const roomName = room.room_type_name ??
                room.room_name ??
                room.room_type_id ??
                'Standard Room';
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
                            (dbProp.metadata.listing_image
                                ? `${process.env.CDN_BASE_URL}/${dbProp.metadata.listing_image}`
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
            }));
        }
    }
    if (results.length > 0) {
        await RedisClient_1.default.rpush(RedisKeys_1.redisKeys.results(searchId), ...results);
    }
    return responseIndex;
}
async function processIvectorSearch(searchId) {
    try {
        let responseIndex = 0;
        for (const xml of IvectorXmlRequests_1.ivectorXmlRequests) {
            // 1. Call iVector API
            const xmlResponse = await callIvectorAPI(xml);
            // 2. Parse XML response
            const properties = await (0, XmlParser_1.parseIvectorXML)(xmlResponse);
            if (!properties.length)
                continue;
            // 3. Extract property reference IDs
            const propertyRefIds = extractPropertyRefIds(properties);
            if (!propertyRefIds.length)
                continue;
            // 4. Fetch DB properties
            const dbProperties = await fetchDbProperties(propertyRefIds);
            if (!dbProperties.length)
                continue;
            // 5. Build lookup map
            const propertyMap = buildPropertyMap(dbProperties);
            // 6. Push enriched results to Redis
            responseIndex = await pushResultsToRedis(searchId, properties, propertyMap, responseIndex);
        }
        // 7. Mark search as completed
        await RedisClient_1.default.set(RedisKeys_1.redisKeys.status(searchId), 'ENDED', 'EX', Number(process.env.IVECTOR_TTL));
    }
    catch (error) {
        console.error('iVector search failed', error);
        await RedisClient_1.default.set(RedisKeys_1.redisKeys.status(searchId), 'FAILED', 'EX', Number(process.env.IVECTOR_TTL));
    }
}
