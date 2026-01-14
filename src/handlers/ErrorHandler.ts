import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(
  error: any,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 1. Validation errors
  if (error instanceof ZodError) {
        // Log the Zod error message to console
        console.log('Validation Error:', error.issues[0].message);

        // Send clean message response
        return reply.status(400).send({ message: error.issues[0].message });
      }
  // 2. Custom business errors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  // 3. Unknown errors
  console.error(error);

  return reply.status(500).send({
    message: 'Internal Server Error',
  });
}
