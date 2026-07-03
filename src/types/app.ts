import { FastifyInstance } from 'fastify';

export type FastifyPlugin = (app: FastifyInstance) => Promise<void>;
