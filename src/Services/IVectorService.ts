
import axios from 'axios';
import redis from '../RedisClient';
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


    // 🔹 If no valid rooms → still push ONE row so UI can render property
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

    // 🔹 Normal case: push per room
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
      // 1. Call iVector API
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
