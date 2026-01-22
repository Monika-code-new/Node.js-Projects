
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

