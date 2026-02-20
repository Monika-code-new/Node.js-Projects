/* 
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
 */
/* import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../Logging";

export function errorHandler(
  err: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
) {

  logger.error({
    type: "api-error",
    message: err.message,
    stack: err.stack
  });

  reply.status(500).send({
    message: "Internal Server Error"
  });
}
 */
 import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../Logging";
import { getContext } from "../Utils/RequestContext";

export function errorHandler(
  err: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
) {

  logger.error({
    type: "api-error",
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    reqId: getContext("reqId"),
  }, "Request error");

  reply.status(500).send({
    message: "Internal Server Error"
  });
}
 