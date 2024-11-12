import { ILogger } from '@/src/logger/types';

import { IErrorReporter } from './types';

export class LoggerErrorReporter implements IErrorReporter {
  protected _logger: ILogger;

  static createFromLogger(logger: ILogger) {
    return new this(logger);
  }

  constructor(logger: ILogger) {
    this._logger = logger;
  }

  async report(e: Error) {
    this._logger.error(`${e.message}\n${e.stack}`);
  }
}
