
import { FastifyRequest, FastifyReply } from 'fastify';
import { getPropertiesQuerySchema } from '../Schemas/PropertySchema';
import { getAllProperties } from '../Services/PropertyService';
import { GetPropertiesParams } from '../Utils/Type';
import { sendSuccessResponse } from '../Utils/Response.Util';
import { HttpStatusCode } from '../Utils/StatusCode.Enum';
import { AppError } from '../Utils/AppError';
import { errorMessage,UserRole } from '../Utils/Messages.Enum';
import { logger } from '../Observability/Logger';



export class PropertyController {
  static async getProperties(req: FastifyRequest, reply: FastifyReply) 
  {
    const start = Date.now();
    logger.info('PropertyController.getProperties started', {
      query: req.query,
      role: req.headers['role'],
      method: req.method,
      url: req.url
    });
    
    try {
      
      const parsedQuery = getPropertiesQuerySchema.parse(
        req.query
      ) as GetPropertiesParams;

      const rawRole = req.headers['role'];
      const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : 'user'; 

      
      if (!Object.values(UserRole).includes(role as UserRole)) {
        throw new AppError (errorMessage.INVALID_ROLE,HttpStatusCode.BAD_REQUEST);
      }

      
      const properties = await getAllProperties(parsedQuery, role);
      if (!properties || properties.length === 0) {
        throw new AppError(
          errorMessage.NO_PROPERTIES_FOUND,
          HttpStatusCode.NOT_FOUND
        );
      }

      logger.info('PropertyController.getProperties completed', {
        count: properties.length,
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });

      return sendSuccessResponse(reply, properties);
    } catch (error) {
      logger.error('PropertyController.getProperties failed', {
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - start,
        method: req.method,
        url: req.url
      });
       throw error
    }
  }
}

