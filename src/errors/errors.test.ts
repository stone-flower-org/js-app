import { AppError } from './errors';

describe('AppError', () => {
  it('should preserve prototype chaining', () => {
    class BaseErrorChild extends AppError {}
    class Leaf extends BaseErrorChild {}

    const instance = new Leaf();

    expect(instance).toBeInstanceOf(Error);
    expect(instance).toBeInstanceOf(AppError);
    expect(instance).toBeInstanceOf(BaseErrorChild);
    expect(instance).toBeInstanceOf(Leaf);
  });
});
