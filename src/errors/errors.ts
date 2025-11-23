interface Constructor<P extends unknown[] = unknown[], T = object> {
  new (...args: P): T;
}

export interface ErrorParams {
  cause?: Error;
}

export class AppError extends Error {
  public static setType(errorInstance: object, constructorFn: Constructor) {
    const actualProto = constructorFn.prototype;
    if (Object.setPrototypeOf) Object.setPrototypeOf(errorInstance, actualProto);
    else (errorInstance as unknown as Record<string, unknown>).__proto__ = actualProto;
  }

  constructor(message?: string, params: ErrorParams = {}) {
    super(message, params);
    this.name = new.target.name;
    AppError.setType(this, new.target as unknown as Constructor);
  }
}
