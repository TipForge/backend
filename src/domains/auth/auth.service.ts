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

  async login(data: LoginRequest): Promise<{ user: any; token: string }> {
    return this.executeWithLogging('user.login', async () => {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new ValidationError('Invalid email or password');
      }

      // TODO: verify password hash
      if (user.password !== data.password) {
        throw new ValidationError('Invalid email or password');
      }

      return {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token: 'TODO', // TODO: generate JWT
      };
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
