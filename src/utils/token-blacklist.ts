import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

let prisma: PrismaClient;

export const initTokenBlacklist = (prismaClient: PrismaClient): void => {
  prisma = prismaClient;
};

export const blacklistToken = async (token: string, expiresAt: Date): Promise<void> => {
  try {
    await prisma.blacklistedToken.create({
      data: { token, expiresAt },
    });
    logger.debug(`Token blacklisted: expires at ${expiresAt}`);
  } catch (error) {
    logger.error('Failed to blacklist token:', error);
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const blacklisted = await prisma.blacklistedToken.findUnique({
      where: { token },
    });
    return !!blacklisted;
  } catch (error) {
    logger.error('Failed to check token blacklist:', error);
    return false;
  }
};

export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    await prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    logger.debug('Expired tokens cleaned up');
  } catch (error) {
    logger.error('Failed to clean up expired tokens:', error);
  }
};
