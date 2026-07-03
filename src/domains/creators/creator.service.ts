import { PrismaClient } from '@prisma/client';
import { BaseService } from '../../services/base.service';
import { CreateCreatorRequest, UpdateCreatorRequest } from './creator.types';
import { ValidationError } from '../../utils/errors';

export class CreatorService extends BaseService {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async createCreator(
    userId: string,
    data: CreateCreatorRequest
  ): Promise<{ id: string; username: string }> {
    return this.executeWithLogging('creator.create', async () => {
      const existingCreator = await this.prisma.creator.findUnique({
        where: { username: data.username },
      });

      if (existingCreator) {
        throw new ValidationError('Username already taken');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ValidationError('User not found');
      }

      const creator = await this.prisma.creator.create({
        data: {
          userId,
          username: data.username,
          displayName: data.displayName,
          bio: data.bio,
        },
      });

      // Update user role to creator
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: 'creator' },
      });

      return { id: creator.id, username: creator.username };
    });
  }

  async getCreatorByUsername(username: string): Promise<any> {
    return this.executeWithLogging('creator.getByUsername', async () => {
      const creator = await this.prisma.creator.findUnique({
        where: { username },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!creator) {
        throw new ValidationError('Creator not found');
      }

      return creator;
    });
  }

  async getCreatorById(creatorId: string): Promise<any> {
    return this.executeWithLogging('creator.getById', async () => {
      const creator = await this.prisma.creator.findUnique({
        where: { id: creatorId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!creator) {
        throw new ValidationError('Creator not found');
      }

      return creator;
    });
  }

  async updateCreator(creatorId: string, data: UpdateCreatorRequest): Promise<any> {
    return this.executeWithLogging('creator.update', async () => {
      const creator = await this.prisma.creator.update({
        where: { id: creatorId },
        data: {
          displayName: data.displayName,
          bio: data.bio,
          avatar: data.avatar,
          isPublic: data.isPublic,
        },
      });

      return creator;
    });
  }

  async getCreatorByUserId(userId: string): Promise<any> {
    return this.executeWithLogging('creator.getByUserId', async () => {
      const creator = await this.prisma.creator.findUnique({
        where: { userId },
      });

      if (!creator) {
        throw new ValidationError('Creator profile not found');
      }

      return creator;
    });
  }
}
