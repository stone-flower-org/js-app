import { IContainer, IDefaultContainerServices, IValidContainerServices } from '@/src/container/types';
import { IErrorReporter } from '@/src/error-reporter/types';
import { ILogger } from '@/src/logger/types';
import { IServiceProvider } from '@/src/service-provider/types';

export type IAppCoreServices = {
  'error-reporter': IErrorReporter;
  logger: ILogger;
};

export type IAppCoreProviders = {
  [key in keyof IAppCoreServices]: IServiceProvider<IAppCoreServices[key]>;
};

export type IAppServices<S extends IValidContainerServices> = S & IAppCoreServices;

export interface IAppOptions {
  coreProviders?: Partial<IAppCoreProviders>;
}

export type IAppStarter<S extends IValidContainerServices> =
  | ((options: IAppOptions, app: IApp<S>) => Promise<void>)
  | ((options: IAppOptions, app: IApp<S>) => void);

export interface IApp<
  S extends IValidContainerServices = IDefaultContainerServices,
  AS extends IAppServices<S> = IAppServices<S>,
> extends IContainer<AS> {
  start: () => Promise<void>;
}
