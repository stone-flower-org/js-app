import { vi } from 'vitest';

import { App } from './app';

const makeServiceProvider = () => ({
  boot: vi.fn().mockResolvedValue(null),
  get: vi.fn().mockReturnValue(null),
});

const defaultStarter = vi.fn();

afterEach(() => {
  defaultStarter.mockReset();
});

// TODO: update unit tests
describe('App', () => {
  describe('boot', () => {
    it('should boot all registered ServiceProviders', async () => {
      const fProvider = makeServiceProvider();
      const sProvider = makeServiceProvider();
      const app = new App();
      app.registerProvider('f', fProvider);
      app.registerProvider('s', sProvider);

      await app.boot();

      expect(fProvider.boot).toHaveBeenCalled();
      expect(sProvider.boot).toHaveBeenCalled();
    });

    it('should throw an error when any registered provider throw an exception', async () => {
      const error = new Error('Some Error');
      const fProvider = makeServiceProvider();
      const sProvider = makeServiceProvider();
      sProvider.boot.mockImplementation(() => {
        throw error;
      });
      const app = new App();
      app.registerProvider('f', fProvider);
      app.registerProvider('s', sProvider);

      await expect(async () => {
        await app.boot();
      }).rejects.toBe(error);
    });
  });

  describe('bootService', () => {
    it('should return booted service', async () => {
      const expectedService = {};
      const provider = makeServiceProvider();
      provider.boot.mockResolvedValue(expectedService);
      const app = new App();
      app.registerProvider('f', provider);

      const [service] = await app.bootServices(['f']);

      expect(service).toBe(expectedService);
    });
  });

  describe('getProviders', () => {
    it('should return all registered providers map', () => {
      const fProvider = makeServiceProvider();
      const sProvider = makeServiceProvider();
      const app = new App();
      app.registerProvider('f', fProvider);
      app.registerProvider('s', sProvider);
      expect(app.getProviders()).toEqual(
        expect.objectContaining({
          f: fProvider,
          s: sProvider,
        }),
      );
    });

    it('should return core providers map provided via options', () => {
      const loggerProvider = makeServiceProvider();
      const errorReporterProvider = makeServiceProvider();
      const app = new App(undefined, {
        coreProviders: {
          errorReporter: errorReporterProvider,
          logger: loggerProvider,
        },
      });
      expect(app.getProviders()).toEqual(
        expect.objectContaining({
          errorReporter: errorReporterProvider,
          logger: loggerProvider,
        }),
      );
    });

    it('should return default core providers', () => {
      const app = new App();
      expect(app.getProviders()['errorReporter']).toBeInstanceOf(Object);
      expect(app.getProviders()['logger']).toBeInstanceOf(Object);
    });
  });

  describe('getService', () => {
    it('should return registered service when it is booted', () => {
      const expectedService = {};
      const provider = makeServiceProvider();
      provider.get.mockReturnValue(expectedService);
      const app = new App();
      app.registerProvider('f', provider);
      expect(app.getService('f')).toBe(expectedService);
    });

    it('should throw error when requested service is not booted', () => {
      const error = new Error('Service is not booted');
      const provider = makeServiceProvider();
      provider.get.mockImplementation(() => {
        throw error;
      });
      const app = new App();
      app.registerProvider('f', provider);
      expect(() => {
        app.getService('f');
      }).toThrow(error);
    });
  });

  describe('registerProvider', () => {
    it('should register provided providers in app', () => {
      const fProvider = makeServiceProvider();
      const sProvider = makeServiceProvider();
      const app = new App();
      app.registerProvider('f', fProvider);
      app.registerProvider('s', sProvider);
      expect(app.getProviders()).toEqual(
        expect.objectContaining({
          f: fProvider,
          s: sProvider,
        }),
      );
    });
  });

  describe('start', () => {
    it('should call provided starter with provided options and app instance', async () => {
      const options = {};
      const app = new App(defaultStarter, options);
      await app.start();
      expect(defaultStarter).toHaveBeenCalledWith(app);
    });
  });
});
