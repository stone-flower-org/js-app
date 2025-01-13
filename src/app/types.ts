import { IContainer, IDefaultContainerServices, IValidContainerServices } from '@/src/container/types';
import { IServiceProvider } from '@/src/service-provider/types';

export type IAppServices<S extends IValidContainerServices> = S;

export interface IAppOptions<S extends IValidContainerServices> {
  coreProviders?: Partial<{
    [key in keyof S]: IServiceProvider<S[key]>;
  }>;
}

export type IAppStarter<S extends IValidContainerServices> =
  | ((app: IApp<S>) => Promise<void>)
  | ((app: IApp<S>) => void);

export interface IApp<
  S extends IValidContainerServices = IDefaultContainerServices,
  AS extends IAppServices<S> = IAppServices<S>,
> extends IContainer<AS> {
  start: () => Promise<void>;
}
