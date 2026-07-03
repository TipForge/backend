import Fastify from 'fastify';
import { config } from './config/env';

const app = Fastify({
  logger: {
    level: config.LOG_LEVEL,
  },
});

// Health check endpoint
app.get('/health', async (_request, _reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  };
});

const start = async (): Promise<void> => {
  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    console.log(`Server listening on http://0.0.0.0:${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
