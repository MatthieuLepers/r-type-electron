import Weapon from '@renderer/core/classes/prefabs/items/weapons/Weapon';
import DnaBeam from '@renderer/core/classes/prefabs/projectiles/DnaBeam';
import DnaBullet from '@renderer/core/classes/prefabs/projectiles/DnaBullet';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class DnaWeapon extends Weapon {
  /**
   * @constructor
   */
  constructor() {
    super('DNA');
  }

  /**
   * @param {Module} module
   */
  shoot(module) {
    super.shoot(module);
    this.secondaryShoot(module);
  }

  /**
   * @param {Module} module
   */
  secondaryShoot(module) {
    if (module?.tier >= 1) {
      module.owner.getAttachedEntity('bitmodule_top')?.shoot();
      module.owner.getAttachedEntity('bitmodule_bottom')?.shoot();
    }
  }

  /**
   * @param {Module} module
   */
  shootTier1(module) {
    if (!module.cooldownActive()) {
      DnaBullet.new(module.owner, null, DnaBullet.COLOR_RED).spawn();
      DnaBullet.new(module.owner, null, DnaBullet.COLOR_BLUE).spawn();

      module.setCooldown(140);
      module.startCooldown();
    }
  }

  /**
   * @param {Module} module
   */
  shootTier2(module) {
    DnaBeam.new(module.owner).spawn();

    module.setCooldown(90);
    module.owner.setSoundCooldown(140);
    module.startCooldown();
  }
}
