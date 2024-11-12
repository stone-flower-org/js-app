import { IBootFunc, IServiceProvider } from './types';

export class ServiceProvider<S = unknown> implements IServiceProvider<S> {
  protected _promise: Promise<S> | undefined;
  protected _service: S | undefined;
  protected _boot: IBootFunc<S>;

  static createFromFunc<S = unknown>(boot: IBootFunc<S>) {
    return new this(boot);
  }

  static create<S = unknown>(service: S) {
    const provider = this.createFromFunc(() => service);
    provider.boot();
    return provider;
  }

  constructor(boot: IBootFunc<S>) {
    this._boot = boot;
  }

  boot() {
    if (this._promise) return this._promise;

    const bootRes = this._boot();

    if (!(bootRes instanceof Promise)) {
      this._service = bootRes;
      this._promise = Promise.resolve(bootRes);
    } else {
      this._promise = bootRes.then((res) => (this._service = res));
    }

    return this._promise;
  }

  get() {
    if (!this._service) throw new Error('Service is not booted');
    return this._service;
  }
}
