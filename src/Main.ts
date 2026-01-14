
import Fastify from 'fastify';
import authRoutes from './routes/auth.route';

import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

const app = Fastify({
  
  ajv: {
    customOptions: {
      strict: false,
    },
  },
});

//  Register swagger
app.register(swagger, {
  openapi: {
    info: {
      title: 'Auth API',
      description: 'Login & Register APIs',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

//  Register swagger UI and LINK the spec
app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecification: (swaggerObject) => swaggerObject,
  transformSpecificationClone: true,
});

// Routes
app.register(authRoutes, { prefix: '/api/auth' });

// Start server
async function start() {
  try {
    await app.listen({ port: 3000 });
    console.log('Server running on http://localhost:3000');
    console.log('Swagger UI at http://localhost:3000/docs');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
