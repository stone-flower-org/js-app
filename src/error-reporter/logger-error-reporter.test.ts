import { vi } from 'vitest';

import { ILogger } from '@/src/logger/types';

import { LoggerErrorReporter } from './logger-error-reporter';

const defaultError = new Error('Some Error');

const defaultLogger = {
  error: vi.fn(),
} as unknown as ILogger;

describe('createLoggerErrorReporter', () => {
  describe('createFromLogger', () => {
    it('should return instance of defaultLogger', () => {
      expect(LoggerErrorReporter.createFromLogger(defaultLogger)).toBeInstanceOf(LoggerErrorReporter);
    });
  });

  describe('report', () => {
    it('should call logger.error with given error', () => {
      const errorReporter = new LoggerErrorReporter(defaultLogger);
      errorReporter.report(defaultError);
      expect(defaultLogger.error).toHaveBeenCalledWith(`${defaultError.message}\n${defaultError.stack}`);
    });
  });
});
