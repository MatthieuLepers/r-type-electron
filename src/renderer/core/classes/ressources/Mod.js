import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';
import AbstractMethodNotImplementedError from '@renderer/core/classes/errors/AbstractMethodNotImplementedError';
import InvalidModConfigError from '@renderer/core/classes/errors/InvalidModConfigError';

/**
 * @param {Object} env
 * @return {Boolean}
 */
function $hasConfigFields(env) {
  const requiredFields = ['name', 'desc', 'author', 'version'];
  return requiredFields.reduce((acc, val) => env[val] && acc, true);
}

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Mod {
  /**
   * @constructor
   * @param {Object} env
   * @throws {AbstractClassError}
   */
  constructor(env = {}) {
    if (this.constructor.name === 'Mod') {
      throw new AbstractClassError(this);
    }
    if (!$hasConfigFields(env)) {
      this.$crashed = new InvalidModConfigError(this);
    }
    this.$env = env;
    this.$enabled = false;

    Object.keys(this.$env).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.$env[key],
        set(val) { this.$env[key] = val; },
      });
    });
  }

  /**
   * @throws {AbstractMethodNotImplementedError}
   */
  init() {
    if (this.constructor.name === 'Mod') {
      throw new AbstractMethodNotImplementedError('init', this);
    }
  }
}
