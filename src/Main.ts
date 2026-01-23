import Fastify from 'fastify';
import { errorHandler } from './Utils/ErrorHandler';
import logger from './Utils/Logger'


import Routes from './Routes';
import loggerOptions from './Utils/Logger';
import fastifyLoggerConfig from './Utils/FastifyLoggerConfig';

async function start() {
  // Create Fastify instance
  const app = Fastify({
    logger:fastifyLoggerConfig
    
  });

  // Register centralized error handler
  app.setErrorHandler(errorHandler);

  // Register routes
  app.register(Routes, { prefix: '/api' });
  

  try {
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
    });
    app.log.info('Server running on http://localhost:3000')

    //console.log('Server running on http://localhost:3000');
  } catch (error) {
    app.log.error(error,'Failed to start server');
    process.exit(1);
  }
}

// Start the application
start();
