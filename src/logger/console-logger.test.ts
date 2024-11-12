/* eslint-disable prettier/prettier */
import { vi } from 'vitest';

import { ConsoleLogger } from './console-logger';

const defaultMessage = 'Some message';

afterAll(() => {
  vi.restoreAllMocks();
});

describe('ConsoleLogger', () => {
  describe('create', () => {
    it('should return instance of ConsoleWriter', () => {
      expect(ConsoleLogger.create()).toBeInstanceOf(ConsoleLogger);
    });
  });

  describe('debug', () => {
    it('should call console.debug when debug called', () => {
      const spy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
      const logger = new ConsoleLogger();

      logger.debug(defaultMessage);

      expect(spy).toHaveBeenCalledWith(defaultMessage);
    });
  });

  describe('info', () => {
    it('should call console.debug when info called', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
      const logger = new ConsoleLogger();

      logger.info(defaultMessage);

      expect(spy).toHaveBeenCalledWith(defaultMessage);
    });
  });

  describe('warn', () => {
    it('should call console.debug when warn called', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const logger = new ConsoleLogger();

      logger.warn(defaultMessage);

      expect(spy).toHaveBeenCalledWith(defaultMessage);
    });
  });

  describe('error', () => {
    it('should call console.error when error called', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const logger = new ConsoleLogger();

      logger.error(defaultMessage);

      expect(spy).toHaveBeenCalledWith(defaultMessage);
    });
  });
});
