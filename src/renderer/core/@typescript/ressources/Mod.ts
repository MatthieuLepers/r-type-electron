import AbstractClassError from '@renderer/core/@typescript/errors/AbstractClassError';
import InvalidModConfigError from '@renderer/core/@typescript/errors/InvalidModConfigError';

function $hasConfigFields(env: Record<string, any>): boolean {
  const requiredFields = ['name', 'desc', 'author', 'version'];
  return requiredFields.reduce((acc, val) => env[val] && acc, true);
}

export default abstract class Mod {
  public $crashed: Error;

  public $env: Record<string, any> = {};

  public $enabled: boolean = false;

  constructor(env = {}) {
    if (this.constructor.name === 'Mod') {
      throw new AbstractClassError(this.constructor);
    }
    if (!$hasConfigFields(env)) {
      this.$crashed = new InvalidModConfigError(this.constructor);
    }
    this.$env = env;

    Object.keys(this.$env).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.$env[key],
        set(val) { this.$env[key] = val; },
      });
    });
  }

  abstract init(): void;
}
