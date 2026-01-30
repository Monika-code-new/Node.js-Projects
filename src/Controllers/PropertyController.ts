
import { FastifyRequest, FastifyReply } from 'fastify';
import { getPropertiesQuerySchema } from '../Schemas/PropertySchema';
import { getAllProperties } from '../Services/PropertyService';
import { GetPropertiesParams } from '../Utils/Type';
import { sendSuccessResponse } from '../Utils/Response.Util';
import { HttpStatusCode } from '../Utils/StatusCode.Enum';
import { AppError } from '../Utils/AppError';
import { errorMessage,UserRole } from '../Utils/Messages.Enum';



export class PropertyController {
  static async getProperties(req: FastifyRequest, reply: FastifyReply) 
  {
    
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

      return sendSuccessResponse(reply, properties);
    } catch (error) {
       throw error
    }
  }
}

