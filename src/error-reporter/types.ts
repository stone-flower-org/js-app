export interface IErrorReporter {
  report(error: Error): Promise<void>;
}
