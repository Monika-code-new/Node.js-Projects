import { prisma } from '../Prisma/Client';

export const logRequest = async (endpoint: string, ipAddress: string) => {
  try {
    await prisma.requestLog.create({
      data: {
        endpoint,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to log request:', error);
  }
};
