import { PrismaClient } from '@prisma/client';
import { BaseService } from '../../services/base.service';
import { RegisterRequest, LoginRequest } from './auth.types';
import { ValidationError } from '../../utils/errors';

export class AuthService extends BaseService {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async register(data: RegisterRequest): Promise<{ id: string; email: string }> {
    return this.executeWithLogging('user.register', async () => {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ValidationError('Email already registered');
      }

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password, // TODO: hash password
          name: data.name,
          role: 'fan',
        },
      });

      return { id: user.id, email: user.email };
    });
  }

  async getByEmail(email: string): Promise<any> {
    return this.executeWithLogging('user.getByEmail', async () => {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new ValidationError('User not found');
      }

      return user;
    });
  }
}
