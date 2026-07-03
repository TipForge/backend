import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { RegisterRequestSchema } from './auth.types';
import { formatSuccess } from '../../types/response';

export const registerAuthRoutes = (app: FastifyInstance, prisma: PrismaClient): void => {
  const authService = new AuthService(prisma);

  app.post<{ Body: any }>(
    '/api/v1/auth/register',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = RegisterRequestSchema.parse(request.body);
      const result = await authService.register(body);
      reply.code(201).send(formatSuccess(result));
    }
  );
};
