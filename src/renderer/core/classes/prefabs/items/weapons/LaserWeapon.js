import Weapon from '@renderer/core/classes/prefabs/items/weapons/Weapon';
import BlueLaser from '@renderer/core/classes/prefabs/projectiles/BlueLaser';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class LaserWeapon extends Weapon {
  /**
   * @constructor
   */
  constructor() {
    super('LASER');
  }

  /**
   * @param {Module} module
   */
  shootTier1(module) {
    if (!module.cooldownActive()) {
      const blueLaser0 = BlueLaser.new(module.owner, null, 45);
      const blueLaser1 = BlueLaser.new(module.owner, null, 0);
      const blueLaser2 = BlueLaser.new(module.owner, null, -45);
      blueLaser0.spawn();
      blueLaser1.spawn();
      blueLaser2.spawn();

      module.setCooldown((module.tier === 1 ? 1000 : 850));
      module.startCooldown();
    }
  }

  /**
   * @param {Module} module
   */
  shootTier2(module) {
    this.shootTier1(module);
  }
}
