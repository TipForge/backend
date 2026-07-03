import { PrismaClient } from '@prisma/client';
import { BaseService } from '../../services/base.service';
import { ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export class VerificationService extends BaseService {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async verifyCreator(creatorId: string): Promise<{ verified: boolean }> {
    return this.executeWithLogging('creator.verify', async () => {
      const creator = await this.prisma.creator.findUnique({
        where: { id: creatorId },
      });

      if (!creator) {
        throw new ValidationError('Creator not found');
      }

      await this.prisma.creator.update({
        where: { id: creatorId },
        data: { verified: true },
      });

      logger.info(`Creator verified: ${creatorId}`);

      return { verified: true };
    });
  }

  async unverifyCreator(creatorId: string): Promise<{ verified: boolean }> {
    return this.executeWithLogging('creator.unverify', async () => {
      const creator = await this.prisma.creator.findUnique({
        where: { id: creatorId },
      });

      if (!creator) {
        throw new ValidationError('Creator not found');
      }

      await this.prisma.creator.update({
        where: { id: creatorId },
        data: { verified: false },
      });

      logger.info(`Creator unverified: ${creatorId}`);

      return { verified: false };
    });
  }

  async getVerificationStatus(creatorId: string): Promise<{ verified: boolean }> {
    return this.executeWithLogging('creator.getVerificationStatus', async () => {
      const creator = await this.prisma.creator.findUnique({
        where: { id: creatorId },
        select: { verified: true },
      });

      if (!creator) {
        throw new ValidationError('Creator not found');
      }

      return { verified: creator.verified };
    });
  }
}
