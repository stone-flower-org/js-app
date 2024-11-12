import { AppError } from '@/src/errors';
import { IServiceProvider } from '@/src/service-provider/types';

import { IContainer, IValidContainerServices, IDefaultContainerServices, IContainerProvidersMap } from './types';

export class Container<S extends IValidContainerServices = IDefaultContainerServices> implements IContainer<S> {
  protected _providers: IContainerProvidersMap<S> = {};

  static create() {
    return new this();
  }

  getProviders() {
    return { ...this._providers };
  }

  getProvider<K extends keyof S>(key: K) {
    const provider = this._providers[key];
    if (!provider) throw new AppError(`Provider ${String(key)} is not registered`);
    return provider;
  }

  async boot() {
    await this.bootServices(Object.keys(this._providers) as (keyof S)[]);
  }

  bootServices<K extends keyof S>(keys: K[]) {
    return Promise.all(keys.map((key) => this.getProvider(key).boot()));
  }

  getService<K extends keyof S>(key: K) {
    return this.getProvider(key).get();
  }

  registerProvider<K extends keyof S>(key: K, provider: IServiceProvider<S[K]>) {
    this._providers[key] = provider;
  }
}
