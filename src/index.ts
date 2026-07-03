import Fastify from 'fastify';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from 'fastify-cors';
import { env } from './config/env';
import { logger } from './utils/logger';
import { AppError } from './utils/errors';
import { ErrorResponse } from './types';

const app = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Register plugins
app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

// Health check endpoint
app.get('/health', async (_request, _reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API routes (placeholder)
app.get('/api/v1/health', async (_request, _reply) => {
  return { status: 'healthy', version: '0.1.0' };
});

// Global error handler
app.setErrorHandler(async (error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      error: error.message,
      code: error.code,
      details: error.details,
    } as ErrorResponse);
  }

  logger.error('Unhandled error', error);

  return reply.code(500).send({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  } as ErrorResponse);
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`Server running on http://0.0.0.0:${env.PORT}`, {
      nodeEnv: env.NODE_ENV,
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

startServer();

export default app;
