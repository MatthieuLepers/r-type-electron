import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';
import AbstractMethodNotImplementedError from '@renderer/core/classes/errors/AbstractMethodNotImplementedError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class AbstractRessource {
  /**
   * @constructor
   * @param {Object} data
   */
  constructor(data = {}) {
    if (this.constructor.name === 'AbstractRessource') {
      throw new AbstractClassError(this);
    }
    this.$data = data;

    Object.keys(this.$data).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.$data[key],
        set: (val) => { this.$data[key] = val; },
      });
    });
  }

  /**
   * @return {AbstractRessource}
   */
  clone() {
    if (this.constructor.name === 'AbstractRessource') {
      throw new AbstractMethodNotImplementedError('clone', this);
    }
  }
}
