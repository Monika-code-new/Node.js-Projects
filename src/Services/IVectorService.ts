
import axios from 'axios';
import redis from '../RedisClient';
import { redisKeys } from '../Constants/RedisKeys';
import { ivectorXmlRequests } from '../Utils/IvectorXmlRequests';
import { parseIvectorXML } from '../Utils/XmlParser';


export async function processIvectorSearch(searchId: string) {
  try {
    for (let index = 0; index < ivectorXmlRequests.length; index++) {
      const xml = ivectorXmlRequests[index];

      const response = await axios.post( process.env.IVECTOR_URL, xml, {
        headers: { 'Content-Type': 'application/xml' },
      });

      const rooms = await parseIvectorXML(response.data);

  
      const uniqueRooms = new Set<string>();

      for (const room of rooms) {
        const dedupeKey = `${room.roomName}-${room.propertyRef}`;
        if (uniqueRooms.has(dedupeKey)) continue;

        uniqueRooms.add(dedupeKey);

        await redis.rpush(
          redisKeys.results(searchId),
          JSON.stringify({
            responseIndex: index,
            roomName: room.roomName,
            propertyRef: room.propertyRef,
          })
        );
      }
    }

    await redis.expire(redisKeys.results(searchId),process.env.IVECTOR_TTL);

   
    await redis.set(redisKeys.status(searchId), 'ENDED', 'EX', process.env.IVECTOR_TTL);
  } catch (error) {
    console.error('iVector failed', error);

    await redis.set(redisKeys.status(searchId), 'FAILED', 'EX', process.env.IVECTOR_TTL);
  }
}
