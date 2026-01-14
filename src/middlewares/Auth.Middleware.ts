
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../prisma/client';
import { ZodType, ZodError } from 'zod';

export const validate =
  (schema: ZodType) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = schema.parse(req.body); // validate body
      req.body = parsed; // overwrite body with typed data
    } catch (err) {
      // Only handle ZodError here
      if (err instanceof ZodError) {
        return reply.status(400).send({
          message:  err.issues[0].message ,
          
        });
      }

      // For any other unexpected errors
      return reply.status(500).send({
        message: 'Internal server error',
      });
    }
  };


export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    console.log('--- AUTH MIDDLEWARE START ---');

    // 1. Log headers
    console.log('Headers:', req.headers);

    const authHeader = req.headers['authorization'] as string | undefined;
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
      console.log(' No Authorization header');
      return reply.status(401).send({ message: 'Authorization header missing' });
    }

    // 2. Extract token
    const parts = authHeader.split(' ');
    console.log('Auth header parts:', parts);

    const token = parts[1];
    console.log('Extracted token:', token);

    if (!token) {
      console.log('Bearer token missing');
      return reply.status(401).send({ message: 'Bearer token missing' });
    }

    // 3. Query DB
    console.log(' Checking token in DB...');
    const tokenRecord = await prisma.apiToken.findUnique({
      where: { token },
    });

    console.log('DB result:', tokenRecord);

    if (!tokenRecord) {
      console.log(' Token not found in DB');
      return reply.status(401).send({ message: 'Invalid token' });
    }

    if (!tokenRecord.isActive) {
      console.log(' Token is inactive');
      return reply.status(401).send({ message: 'Inactive token' });
    }

    // 4. Expiry check
    if (tokenRecord.expiresAt) {
      console.log('Token expires at:', tokenRecord.expiresAt);
      console.log('Current time:', new Date());

      if (tokenRecord.expiresAt < new Date()) {
        console.log(' Token expired');
        return reply.status(401).send({ message: 'Token expired' });
      }
    }

    // 5. Attach token to request
    (req as any).apiToken = tokenRecord;
    console.log(' Token validated successfully');

    

  } catch (err) {
    console.error(' AUTH MIDDLEWARE ERROR:', err);
    return reply.status(500).send({ message: 'Internal server error' });
  }
};
