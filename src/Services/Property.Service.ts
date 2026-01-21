// Services/Property.Service.ts
import { prisma } from '../Prisma/Client';
import { GetPropertiesParams, PropertyResponse } from '../Utils/Type';
import { AppError } from '../Utils/AppError';
import { errorMessage } from '../Utils/Messages.Enum';
import { HttpStatusCode } from '../Utils/StatusCode.Enum';

export const getAllProperties = async (
  parsedQuery: GetPropertiesParams,
  role: string
): Promise<PropertyResponse[]> => {

  const { destinationId } = parsedQuery;
  const isAdmin = role === 'admin'; 

  
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
      throw new AppError(
        errorMessage.NO_PROPERTIES_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    return properties.map(p => ({
      id: p.id,
      name: p.name,
      destination_id: p.destination.id,
      destination_name: p.destination.name,
      address: p.address,
      contact_number: p.contactNumber,
      description: p.description,
      region_name: p.region.name,
    }));
  }

  
  const destinations = await prisma.destination.findMany({
    where: {
      OR: [{ id: destinationId }, { parentId: destinationId }],
      ...(isAdmin ? {} : { active: true }),
    },
    select: { id: true },
  });

  if (!destinations.length) {
    throw new AppError(
      errorMessage.DESTINATION_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
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
    throw new AppError(
      errorMessage.NO_PROPERTIES_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  return properties.map(p => ({
    id: p.id,
    name: p.name,
    destination_id: p.destination.id,
    destination_name: p.destination.name,
    address: p.address,
    contact_number: p.contactNumber,
    description: p.description,
    region_name: p.region.name,
  }));
};
