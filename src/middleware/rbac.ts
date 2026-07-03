import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole, hasAnyRole } from '../utils/roles';
import { UnauthorizedError } from '../utils/errors';
import { authMiddleware } from './auth';

export const requireRole = (allowedRoles: UserRole[]) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await authMiddleware(request, reply);

    if (!request.user) {
      throw new UnauthorizedError('User not found');
    }

    if (!hasAnyRole(request.user.role, allowedRoles)) {
      throw new UnauthorizedError('Insufficient permissions');
    }
  };
};

export const requireAdmin = (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  return requireRole([UserRole.ADMIN])(request, reply);
};

export const requireCreator = (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  return requireRole([UserRole.CREATOR, UserRole.ADMIN])(request, reply);
};
