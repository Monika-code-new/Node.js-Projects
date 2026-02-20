import { prisma } from '../Prisma/Client';

export const findDestinationContact = async (
  destinationId: number,
  visited = new Set<number>()
): Promise<string | null> => {

   if (visited.has(destinationId)) {
    return null;
  } 
  visited.add(destinationId);

  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
    select: {
      metadata: true,
      parentId: true
    }
  });

  if (!destination) return null;

  const contact =
    typeof destination.metadata === 'object' &&
    destination.metadata !== null &&
    'contact'
      ? (destination.metadata as any).contact
      : null;

  
  if (contact) {
    return contact;
  }

  if (!destination.parentId) {
    return null;
  }
  
    return findDestinationContact(destination.parentId,visited);
   
};
