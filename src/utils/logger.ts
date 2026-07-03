export interface LogContext {
  userId?: string;
  requestId?: string;
  [key: string]: string | number | boolean | undefined;
}

class Logger {
  private context: LogContext = {};

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = Object.entries(this.context)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');

    return `[${timestamp}] [${level}] ${message}${contextStr ? ` ${contextStr}` : ''}`;
  }

  info(message: string, context?: LogContext): void {
    if (context) this.setContext(context);
    console.log(this.formatMessage('INFO', message));
  }

  warn(message: string, context?: LogContext): void {
    if (context) this.setContext(context);
    console.warn(this.formatMessage('WARN', message));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (context) this.setContext(context);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(this.formatMessage('ERROR', `${message} - ${errorMsg}`));
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      if (context) this.setContext(context);
      console.log(this.formatMessage('DEBUG', message));
    }
  }
}

export const logger = new Logger();
