import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { CreatorService } from './creator.service';
import { CreateCreatorRequestSchema } from './creator.types';
import { formatSuccess } from '../../types/response';
import { authMiddleware } from '../../middleware/auth';

export const registerCreatorRoutes = (app: FastifyInstance, prisma: PrismaClient): void => {
  const creatorService = new CreatorService(prisma);

  app.post<{ Body: any }>(
    '/api/v1/creators',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = CreateCreatorRequestSchema.parse(request.body);
      const user = request.user;
      if (!user) {
        throw new Error('User not authenticated');
      }
      const result = await creatorService.createCreator(user.userId, body);
      reply.code(201).send(formatSuccess(result));
    }
  );
};
