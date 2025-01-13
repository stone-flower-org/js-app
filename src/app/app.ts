import { Container } from '@/src/container';
import { IDefaultContainerServices, IValidContainerServices } from '@/src/container/types';

import { IApp, IAppOptions, IAppServices, IAppStarter } from './types';

export class App<
    S extends IValidContainerServices = IDefaultContainerServices,
    AS extends IAppServices<S> = IAppServices<S>,
  >
  extends Container<AS>
  implements IApp<S, AS>
{
  protected _starter: IAppStarter<S> | undefined;

  constructor(starter?: IAppStarter<S>, options: IAppOptions<AS> = {}) {
    super();
    this._starter = starter;
    this._initProviders(options);
  }

  async start(): Promise<void> {
    const startRes: Promise<void> | void = this._starter ? this._starter(this) : undefined;
    return startRes instanceof Promise ? startRes : Promise.resolve(startRes);
  }

  protected _initProviders(options?: IAppOptions<AS>) {
    const coreProviders = options?.coreProviders ?? {};

    let key: string;
    for (key in coreProviders) {
      this.registerProvider(key as never, coreProviders[key as never]);
    }
  }
}
