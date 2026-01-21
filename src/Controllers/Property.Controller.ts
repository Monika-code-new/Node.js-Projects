/* 
import { FastifyRequest, FastifyReply } from 'fastify';
import { getPropertiesQuerySchema } from '../Schemas/Property.Schema';
import { getAllProperties } from '../Services/Property.Service';
import { GetPropertiesParams } from '../Utils/Type';
import { sendSuccessResponse } from '../Utils/Response.Util';

export class PropertyController {

  static async getProperties(req: FastifyRequest, reply: FastifyReply) {
    const parsedQuery = getPropertiesQuerySchema.parse(
      req.query
    ) as GetPropertiesParams;

    const properties = await getAllProperties(parsedQuery);
    return sendSuccessResponse(reply, properties);
  }

  static async getPropertiesByDestination(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const parsedParams = getPropertiesQuerySchema.parse({
      destinationId: (req.params as any).destinationId,
    }) as GetPropertiesParams;

    const properties = await getAllProperties(parsedParams);
    return sendSuccessResponse(reply, properties);
  }
}  */
// Controllers/Property.Controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { getPropertiesQuerySchema } from '../Schemas/Property.Schema';
import { getAllProperties } from '../Services/Property.Service';
import { GetPropertiesParams } from '../Utils/Type';
import { sendSuccessResponse } from '../Utils/Response.Util';

export class PropertyController {
  static async getProperties(req: FastifyRequest, reply: FastifyReply) {
    try {
      
      const parsedQuery = getPropertiesQuerySchema.parse(
        req.query
      ) as GetPropertiesParams;

      const rawRole = req.headers['role'];
      const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : 'user'; 

      
      if (!['admin', 'user'].includes(role)) {
        return reply.code(400).send({ message: 'Invalid role' });
      }

      
      const properties = await getAllProperties(parsedQuery, role);

      return sendSuccessResponse(reply, properties);
    } catch (error: any) {
      reply.code(error?.statusCode || 500).send({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  }
}

