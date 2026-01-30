import Fastify from 'fastify';
import { errorHandler } from './Utils/ErrorHandler';
import fastifyLoggerConfig from './Utils/FastifyLoggerConfig';
import redis, { initRedis } from './RedisClient';
import AllRoutes from './Routes';
import { requestLogger } from './Plugins/RequestLogger';

async function start() {
  
  await initRedis();
  
  // Create Fastify instance
  const app = Fastify({
    logger:fastifyLoggerConfig 
  });
  await requestLogger(app);
  app.decorate('redis', redis);

  // Register centralized error handler
  app.setErrorHandler(errorHandler);

  // Register routes
  app.register(AllRoutes, { prefix: '/api' });
   

  try {
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
    });
    app.log.info('Server running on http://localhost:3000');

  } catch (error) {
    app.log.error(error,'Failed to start server');
    process.exit(1);
  }
}

// Start the application
start();
