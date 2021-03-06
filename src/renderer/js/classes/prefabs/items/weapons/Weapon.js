import EntityScript from '../../EntityScript';
import Module from '../../Module';
import Cooldown from '../../../components/Cooldown';
import AbstractClassError from '../../../errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Weapon extends EntityScript {
  /**
   * @constructor
   * @param {String} type
   */
  constructor(type) {
    super();
    if (this.constructor.name === 'Weapon') {
      throw new AbstractClassError(this);
    }
    this.type = type.toUpperCase();

    this.addComponent(Cooldown, Weapon);
  }

  /**
   * @param {Module} module
   */
  shoot(module) {
    this.primaryShoot(module);
  }

  /**
   * @param {Module} module
   */
  primaryShoot(module) {
    if (module && (module.side === Module.SIDE_FRONT || module.side === Module.SIDE_BACK)) {
      if (module.tier === 1) {
        this.shootTier1(module);
      } else {
        this.shootTier2(module);
      }
    }
  }

  /**
   * @param {Module} module
   */
  secondaryShoot() {}

  /**
   * @param {Module} module
   */
  shootTier1() {}

  /**
   * @param {Module} module
   */
  shootTier2() {}
}
