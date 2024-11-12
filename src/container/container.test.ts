import { vi } from 'vitest';

import { Container } from './container';

const makeServiceProvider = () => ({
  boot: vi.fn().mockResolvedValue(null),
  get: vi.fn().mockReturnValue(null),
});

describe('Container', () => {
  describe('create', () => {
    it('should return Container instance', () => {
      expect(Container.create()).toBeInstanceOf(Container);
    });
  });

  describe('boot', () => {
    it('should boot all registered ServiceProviders', async () => {
      const fProvider = makeServiceProvider();
      const sProvider = makeServiceProvider();
      const container = new Container();
      container.registerProvider('f', fProvider);
      container.registerProvider('s', sProvider);

      await container.boot();

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
      const container = new Container();
      container.registerProvider('f', fProvider);
      container.registerProvider('s', sProvider);

      await expect(async () => {
        await container.boot();
      }).rejects.toBe(error);
    });
  });

  describe('bootServices', () => {
    it('should return booted services', async () => {
      const expectedService = {};
      const provider = makeServiceProvider();
      provider.boot.mockResolvedValue(expectedService);
      const container = new Container();
      container.registerProvider('f', provider);

      const [service] = await container.bootServices(['f']);

      expect(service).toBe(expectedService);
    });
  });

  describe('getProviders', () => {
    it('should return all registered providers map', () => {
      const fProvider = makeServiceProvider();
      const sProvider = makeServiceProvider();
      const container = new Container();
      container.registerProvider('f', fProvider);
      container.registerProvider('s', sProvider);
      expect(container.getProviders()).toEqual({
        f: fProvider,
        s: sProvider,
      });
    });
  });

  describe('getService', () => {
    it('should return registered service when it is booted', () => {
      const expectedService = {};
      const provider = makeServiceProvider();
      provider.get.mockReturnValue(expectedService);
      const container = new Container();
      container.registerProvider('f', provider);
      expect(container.getService('f')).toBe(expectedService);
    });

    it('should throw error when requested service is not booted', () => {
      const error = new Error('Service is not booted');
      const provider = makeServiceProvider();
      provider.get.mockImplementation(() => {
        throw error;
      });
      const container = new Container();
      container.registerProvider('f', provider);
      expect(() => {
        container.getService('f');
      }).toThrow(error);
    });
  });

  describe('registerProvider', () => {
    it('should register provided providers in container', () => {
      const fProvider = makeServiceProvider();
      const sProvider = makeServiceProvider();
      const container = new Container();
      container.registerProvider('f', fProvider);
      container.registerProvider('s', sProvider);
      expect(container.getProviders()).toEqual({
        f: fProvider,
        s: sProvider,
      });
    });
  });
});
