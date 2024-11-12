import { ILogger, LOG_LEVEL } from './types';

export abstract class AbstractLogger implements ILogger {
  debug(...message: string[]) {
    this.write(LOG_LEVEL.DEBUG, ...message);
  }

  info(...message: string[]) {
    this.write(LOG_LEVEL.INFO, ...message);
  }

  warn(...message: string[]) {
    this.write(LOG_LEVEL.WARN, ...message);
  }

  error(...message: string[]) {
    this.write(LOG_LEVEL.ERROR, ...message);
  }

  abstract write(level: LOG_LEVEL, ...message: string[]): void;
}
