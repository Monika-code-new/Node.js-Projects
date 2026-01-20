
// Utils/ErrorHandler.ts
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './AppError';
import { errorMessage } from './Messages.Enum';

export const errorHandler = (
  error: FastifyError | Error,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      status: 'error',
      message: errorMessage.VALIDATION_ERROR,
      details: error.issues.map((issue) => issue.message),
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message,
    });
  }

  console.error('Unhandled Error:', error);

  return reply.status(500).send({
    status: 'error',
    message: errorMessage.INTERNAL_SERVER,
  });
};
