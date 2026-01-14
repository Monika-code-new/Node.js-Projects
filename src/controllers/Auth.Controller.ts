
import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { registerSchema, loginSchema, updateSchema } from '../schemas/auth.schema';
import { RegisterInput, LoginInput, UpdateInput } from '../utils/type';

import { authService } from '../services/auth.service';

export class AuthController {
  //  REGISTER
  static async register(req: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) {
    try {
      const validatedBody = registerSchema.parse(req.body);
      const user = await authService.register(validatedBody);
      return reply.status(201).send(user);
  

    } catch (err: unknown) {
      if (err instanceof ZodError) {
        // Log the Zod error message to console
        console.log('Validation Error:', err.issues[0].message);

        
        return reply.status(400).send({ message: err.issues[0].message });
      }
      return reply.status(400).send({ message: (err as Error).message });
    }
  }

  // LOGIN 
  static async login(req: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    try {
      const validatedBody = loginSchema.parse(req.body);
      const user = await authService.login(validatedBody);
      return reply.send(user);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ message: err.issues[0].message });
      }
      return reply.status(401).send({ message: (err as Error).message });
    }
  }

  //  PROFILE
  static async profile(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).userId; // assuming auth middleware sets this
      if (!userId) return reply.status(401).send({ message: 'Unauthorized' });

      const user = await authService.getProfile(userId);
      return reply.send(user);
    } catch (err: unknown) {
      return reply.status(500).send({ message: (err as Error).message });
    }
  }

  // ---------------- UPDATE USER ----------------
  static async updateUser(req: FastifyRequest<{ Params: { id: string }; Body: UpdateInput }>, reply: FastifyReply) {
    try {
      const id = Number(req.params.id);
      const validatedBody = updateSchema.parse(req.body); // validate partial update
      const user = await authService.updateUser(id, validatedBody);
      return reply.send(user);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ message: err.issues[0].message });
      }
      return reply.status(400).send({ message: (err as Error).message });
    }
  }

  // ---------------- DELETE USER ----------------
  static async deleteUser(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const id = Number(req.params.id);
      await authService.deleteUser(id);
      return reply.send({ message: 'User deleted successfully' });
    } catch (err: unknown) {
      return reply.status(400).send({ message: (err as Error).message });
    }
  }
}
