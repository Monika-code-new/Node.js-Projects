
import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { validate, authenticate } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

export default async function authRoutes(app: FastifyInstance) {

  // REGISTER
  app.post('/register', {
  preHandler: [authenticate, validate(registerSchema)],
  schema: {
    summary: 'User registration (private)',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],

    body: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },

    response: {
      201: { description: 'User created' },
      401: { description: 'Unauthorized' },
      400: { description: 'Validation error' },
    },
  },
}, AuthController.register);

  // LOGIN
  app.post('/login', {
  preHandler: [authenticate, validate(loginSchema)],
  schema: {
    summary: 'User login (private)',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],

    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },

    response: {
      200: { description: 'Login success' },
      401: { description: 'Unauthorized / Invalid credentials' },
    },
  },
}, AuthController.login);

  
app.get('/profile', {
  preHandler: authenticate,
  schema: {
    summary: 'Get user profile',
    tags: ['User'],
    security: [{ bearerAuth: [] }],

    response: {
      200: {
        description: 'User profile fetched successfully',
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          email: { type: 'string' },
        },
      },
      401: {
        description: 'Unauthorized',
      },
    },
  },
}, AuthController.profile);

  app.put('/update/:id', {
  preHandler: authenticate,
  schema: {
    summary: 'Update user',
    tags: ['User'],
    security: [{ bearerAuth: [] }],

    // PARAMS SCHEMA
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', example: '7' },
      },
    },

    // BODY SCHEMA
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Monika' },
        email: { type: 'string', example: 'updated@gmail.com' },
        password: { type: 'string', example: 'NewPass@123' },
      },
    },

    //  RESPONSE SCHEMA
    response: {
      200: {
        description: 'User updated successfully',
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User updated successfully' },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      404: {
        description: 'User not found',
      },
    },
  },
}, AuthController.updateUser);


  
  app.delete('/delete/:id', {
  preHandler: authenticate,
  schema: {
    summary: 'Delete user',
    tags: ['User'],
    security: [{ bearerAuth: [] }],

    // PARAMS SCHEMA
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
      },
    },

    //  RESPONSE SCHEMA
    response: {
      200: {
        description: 'User deleted successfully',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      404: {
        description: 'User not found',
      },
    },
  },
}, AuthController.deleteUser);

}




