import Fastify from 'fastify';
import { errorHandler } from './Utils/ErrorHandler';

import Routes from './Routes';

async function start() {
  // Create Fastify instance
  const app = Fastify({
    
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

    console.log(' Server running on http://localhost:3000');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

// Start the application
start();
