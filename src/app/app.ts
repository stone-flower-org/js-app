import { Container } from '@/src/container';
import { IDefaultContainerServices, IValidContainerServices } from '@/src/container/types';
import { LoggerErrorReporter } from '@/src/error-reporter';
import { ConsoleLogger } from '@/src/logger';
import { ServiceProvider } from '@/src/service-provider';
import { IServiceProvider } from '@/src/service-provider/types';

import { IApp, IAppOptions, IAppServices, IAppStarter } from './types';

export class App<
    S extends IValidContainerServices = IDefaultContainerServices,
    AS extends IAppServices<S> = IAppServices<S>,
  >
  extends Container<AS>
  implements IApp<S, AS>
{
  protected _starter: IAppStarter<S> | undefined;
  protected _options: IAppOptions;

  static createFromFunc<S extends IValidContainerServices = IDefaultContainerServices>(
    starter: IAppStarter<S>,
    options: IAppOptions = {},
  ) {
    return new this(starter, options);
  }

  constructor(starter?: IAppStarter<S>, options: IAppOptions = {}) {
    super();
    this._starter = starter;
    this._options = options;
    this._initProviders();
  }

  async start(): Promise<void> {
    const startRes: Promise<void> | void = this._starter ? this._starter(this._options, this) : undefined;
    return startRes instanceof Promise ? startRes : Promise.resolve(startRes);
  }

  protected _createCoreProviders() {
    const loggerProvider =
      this._options.coreProviders?.logger ?? ServiceProvider.createFromFunc(async () => ConsoleLogger.create());
    return {
      'error-reporter':
        this._options.coreProviders?.['error-reporter'] ??
        ServiceProvider.createFromFunc(async () => LoggerErrorReporter.createFromLogger(await loggerProvider.boot())),
      logger: loggerProvider,
    } as const;
  }

  protected _initProviders() {
    const coreProviders = this._createCoreProviders();

    let key: keyof typeof coreProviders;
    for (key in coreProviders) {
      this.registerProvider(key, coreProviders[key] as IServiceProvider<AS[typeof key]>);
    }
  }
}
