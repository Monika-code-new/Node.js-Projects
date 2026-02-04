
import { parseStringPromise } from 'xml2js';

export async function parseIvectorXML(xml: string) {
  const parsed = await parseStringPromise(xml, {
    explicitArray: true,
    trim: true,
  });

  const propertyResults =
    parsed?.PropertySearchResponse?.PropertyResults?.[0]?.PropertyResult;

  if (!propertyResults) {
   
    return [];
  }

  const rooms: Array<{
    roomName: string;
    propertyRef: string;
  }> = [];

  for (const property of propertyResults) {
    const propertyRef = property?.PropertyReferenceID?.[0];

    if (!propertyRef) {
      console.log('⚠️ Property without PropertyReferenceID', property);
      continue;
    }

    const roomTypes = property?.RoomTypes?.[0]?.RoomType ?? [];


    for (const room of roomTypes) {
    
      const roomName = room?.RoomType?.[0] ?? 'Room';
      rooms.push({
        roomName: String(roomName),
        propertyRef: String(propertyRef),
      });
    }
  }

  return rooms;
}
