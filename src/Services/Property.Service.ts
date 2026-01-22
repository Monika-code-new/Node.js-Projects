// Services/Property.Service.ts
import { prisma } from '../Prisma/Client';
import { GetPropertiesParams, PropertyResponse } from '../Utils/Type';
import { AppError } from '../Utils/AppError';
import { errorMessage } from '../Utils/Messages.Enum';
import { HttpStatusCode } from '../Utils/StatusCode.Enum';
import { findDestinationContact } from '../Utils/DestinationContact.util';

interface DestinationMetadata {
  contact?: string;
  address?: string;
  description?: string;
  airportIds?: number[];
}

export const getAllProperties = async (
  parsedQuery: GetPropertiesParams,
  role: string
): Promise<PropertyResponse[]> => {
  const { destinationId } = parsedQuery;
  const isAdmin = role === 'admin';

  // Helper to fetch airports for destinations
  const getDestinationAirports = async (destinationIds: number[]) => {
    const destinations = await prisma.destination.findMany({
      where: { id: { in: destinationIds }, ...(isAdmin ? {} : { active: true }) },
      select: { id: true, metadata: true },
    });

    // Collect unique airport IDs
    const airportIdsSet = new Set<number>();
    destinations.forEach(d => {
      const metadata = d.metadata as DestinationMetadata;
      (metadata.airportIds || []).forEach(id => airportIdsSet.add(id));
    });

    const airportIds = Array.from(airportIdsSet);

    // Fetch airports in one query
    const airports = airportIds.length
      ? await prisma.airport.findMany({ where: { id: { in: airportIds } } })
      : [];

    // Map airport ID → airport object
    const airportMap = new Map<number, { id: number; name: string }>();
    airports.forEach(a => airportMap.set(a.id, { id: a.id, name: a.name }));

    // Map destinationId → airports array
    const destinationAirportMap = new Map<number, { id: number; name: string }[]>();
    destinations.forEach(d => {
      const metadata = d.metadata as DestinationMetadata;
      const ids = metadata.airportIds || [];
      destinationAirportMap.set(
        d.id,
        ids.map(id => airportMap.get(id)).filter(Boolean) as { id: number; name: string }[]
      );
    });

    return destinationAirportMap;
  };

  // Case 1: No specific destination ID
  if (!destinationId) {
    const properties = await prisma.property.findMany({
      where: isAdmin
        ? {}
        : {
            isActive: true,
            destination: { active: true },
          },
      orderBy: { id: 'asc' },
      include: {
        destination: { select: { id: true, name: true } },
        region: { select: { name: true } },
      },
    });

    if (!properties.length) {
      throw new AppError(errorMessage.NO_PROPERTIES_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const destinationIds = [...new Set(properties.map(p => p.destination.id))];
    const destinationAirportMap = await getDestinationAirports(destinationIds);

    return await Promise.all(
      properties.map(async (p) => {
        const destination_contact_number = await findDestinationContact(p.destination.id);
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
      })
    );
  }

  // Case 2: Specific destination ID
  const destinations = await prisma.destination.findMany({
    where: {
      OR: [{ id: destinationId }, { parentId: destinationId }],
      ...(isAdmin ? {} : { active: true }),
    },
    select: { id: true },
  });

  if (!destinations.length) {
    throw new AppError(errorMessage.DESTINATION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const destinationIds = destinations.map(d => d.id);

  const properties = await prisma.property.findMany({
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
      destination: { select: { id: true, name: true } },
      region: { select: { name: true } },
    },
  });

  if (!properties.length) {
    throw new AppError(errorMessage.NO_PROPERTIES_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const destinationAirportMap = await getDestinationAirports(destinationIds);

  return await Promise.all(
    properties.map(async (p) => {
      const destination_contact_number = await findDestinationContact(p.destination.id);
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
    })
  );
};
