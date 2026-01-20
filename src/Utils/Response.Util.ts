import { FastifyReply } from 'fastify';

export const sendSuccessResponse = (reply: FastifyReply, data: any) => {
  return reply.status(200).send({
    status: 'success',
    data,
  });
};

export const sendErrorResponse = (reply: FastifyReply, message: string, code: number = 400) => {
  return reply.status(code).send({
    status: 'error',
    message,
  });
};
