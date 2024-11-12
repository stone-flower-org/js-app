import { vi } from 'vitest';

import { ServiceProvider } from './ServiceProvider';

describe('ServiceProvider', () => {
  describe('createFromFunc', () => {
    it('should return ServiceProvider instance from async func', () => {
      const instance = ServiceProvider.createFromFunc(async () => undefined);
      expect(instance).toBeInstanceOf(ServiceProvider);
    });

    it('should return ServiceProvider instance from sync func', () => {
      const instance = ServiceProvider.createFromFunc(() => undefined);
      expect(instance).toBeInstanceOf(ServiceProvider);
    });
  });

  describe('create', () => {
    it('should return booted provider', () => {
      const service = {};
      const instance = ServiceProvider.create(service);
      expect(instance).toBeInstanceOf(ServiceProvider);
      expect(instance.get()).toBe(service);
    });
  });

  describe('boot', () => {
    it('should return prepared service returned from booting function', async () => {
      const service = {};
      const booFunc = vi.fn().mockResolvedValue(service);
      const instance = new ServiceProvider(booFunc);

      const bootedService = await instance.boot();

      expect(booFunc).toHaveBeenCalledTimes(1);
      expect(bootedService).toBe(service);
    });

    it('should call booting function only once after boot call', async () => {
      const booFunc = vi.fn().mockResolvedValue(undefined);
      const instance = new ServiceProvider(booFunc);

      await instance.boot();
      await instance.boot();

      expect(booFunc).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should throw exception when get called before service was booted', () => {
      const booFunc = vi.fn().mockResolvedValue(undefined);
      const instance = new ServiceProvider(booFunc);

      expect(() => {
        instance.get();
      }).toThrow('Service is not booted');
    });

    it('should return booted service', async () => {
      const service = {};
      const booFunc = vi.fn().mockResolvedValue(service);
      const instance = new ServiceProvider(booFunc);
      await instance.boot();

      const bootedService = instance.get();
      expect(bootedService).toBe(service);
    });
  });
});
