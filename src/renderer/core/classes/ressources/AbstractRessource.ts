import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default abstract class AbstractRessource<T extends {}> {
  protected data: T;

  constructor(data: T) {
    if (this.constructor.name === 'AbstractRessource') {
      throw new AbstractClassError(this);
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
