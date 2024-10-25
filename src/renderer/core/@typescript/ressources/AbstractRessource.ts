import AbstractClassError from '@renderer/core/@typescript/errors/AbstractClassError';

export default abstract class AbstractRessource<T extends Object> {
  protected data: T;

  constructor(data: T) {
    if (this.constructor.name === 'AbstractRessource') {
      throw new AbstractClassError(this.constructor);
    }
    this.data = data;

    Object.keys(this.data).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.data[key],
        set: (val) => { this.data[key] = val; },
      });
    });
  }

  abstract clone(): AbstractRessource<T>;
}
