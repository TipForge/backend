import { logger } from '../utils/logger';

export abstract class BaseService {
  protected log = logger;

  protected async executeWithLogging<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    try {
      this.log.debug(`Starting: ${operation}`);
      const result = await fn();
      this.log.debug(`Completed: ${operation}`);
      return result;
    } catch (error) {
      this.log.error(`Failed: ${operation}`, error);
      throw error;
    }
  }
}
