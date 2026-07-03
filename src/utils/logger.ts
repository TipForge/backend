import pino from 'pino';
import { config } from '../config';

const isProduction = config.NODE_ENV === 'production';

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
});
