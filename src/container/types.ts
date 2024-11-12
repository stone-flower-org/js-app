import { IServiceProvider } from '@/src/service-provider/types';

export type IValidContainerServices = object;

export type IDefaultContainerServices = {
  [key: string]: unknown;
};

export type IContainerProvidersMap<S extends IValidContainerServices = IDefaultContainerServices> = {
  [key in keyof S]?: IServiceProvider<S[key]>;
};

export interface IContainer<S extends IValidContainerServices = IDefaultContainerServices> {
  boot(): Promise<void>;
  bootServices<K extends keyof S>(keys: K[]): Promise<S[K][]>;
  getProviders(): IContainerProvidersMap<S>;
  getService<K extends keyof S>(key: K): S[K];
  registerProvider<K extends keyof S>(key: K, provider: IServiceProvider<S[K]>): void;
}
