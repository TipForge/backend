import Fastify from 'fastify';

const app = Fastify({
  logger: true,
});

const start = async (): Promise<void> => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening on http://0.0.0.0:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
