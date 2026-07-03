import { PrismaClient } from '@prisma/client';
import { BaseService } from '../../services/base.service';
import { ValidationError } from '../../utils/errors';

export class AnalyticsService extends BaseService {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async getCreatorEarnings(creatorId: string): Promise<{
    totalEarnings: number;
    pendingBalance: number;
    tipCount: number;
    averageTip: number;
  }> {
    return this.executeWithLogging('analytics.getCreatorEarnings', async () => {
      const creator = await this.prisma.creator.findUnique({
        where: { id: creatorId },
      });

      if (!creator) {
        throw new ValidationError('Creator not found');
      }

      const tips = await this.prisma.tip.findMany({
        where: { creatorId },
      });

      const totalEarnings = tips.reduce((sum, tip) => sum + tip.amount, 0);
      const tipCount = tips.length;
      const averageTip = tipCount > 0 ? totalEarnings / tipCount : 0;

      return {
        totalEarnings,
        pendingBalance: creator.pendingBalance,
        tipCount,
        averageTip,
      };
    });
  }

  async recordTipEarning(creatorId: string, amount: number): Promise<void> {
    return this.executeWithLogging('analytics.recordTipEarning', async () => {
      await this.prisma.creator.update({
        where: { id: creatorId },
        data: {
          pendingBalance: {
            increment: amount,
          },
        },
      });
    });
  }

  async getTopCreators(limit: number = 10): Promise<any[]> {
    return this.executeWithLogging('analytics.getTopCreators', async () => {
      const creators = await this.prisma.creator.findMany({
        take: limit,
        orderBy: {
          totalEarnings: 'desc',
        },
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

      return creators;
    });
  }
}
