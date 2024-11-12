/* eslint-disable no-console */
import { AbstractLogger } from './abstract-logger';
import { LOG_LEVEL, ILogger } from './types';

export class ConsoleLogger extends AbstractLogger implements ILogger {
  static create() {
    return new this();
  }

  write(level: LOG_LEVEL, ...message: string[]) {
    switch (level) {
      case LOG_LEVEL.DEBUG:
        console.debug(...message);
        break;
      case LOG_LEVEL.INFO:
        console.info(...message);
        break;
      case LOG_LEVEL.WARN:
        console.warn(...message);
        break;
      case LOG_LEVEL.ERROR:
        console.error(...message);
        break;
    }
  }
}
