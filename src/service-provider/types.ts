export interface IServiceProvider<S = unknown> {
  boot(): Promise<S>;
  get(): S;
}

export type IBootFunc<S = unknown> = (() => Promise<S>) | (() => S);
