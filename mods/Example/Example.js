import Mod from '@/assets/js/classes/ressources/Mod';
import Config from './Config';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Example extends Mod {
  /**
   * @constructor
   * @param {Object} env
   */
  constructor(env) {
    super({ ...env, ...Config });
  }
}
