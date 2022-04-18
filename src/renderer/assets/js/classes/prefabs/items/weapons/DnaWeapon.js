import Weapon from './Weapon';
import DnaBeam from '../../projectiles/DnaBeam';
import DnaBullet from '../../projectiles/DnaBullet';

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
    if (module && module.tier >= 1) {
      const bitModuleTop = module.owner.getAttachedEntity('bitmodule_top') || null;
      const bitModuleBottom = module.owner.getAttachedEntity('bitmodule_bottom') || null;

      if (bitModuleTop) {
        const dnaRed = DnaBullet.new(bitModuleTop, null, DnaBullet.COLOR_RED);
        dnaRed.spawn();
      }
      if (bitModuleBottom) {
        const dnaBlue = DnaBullet.new(bitModuleBottom, null, DnaBullet.COLOR_BLUE);
        dnaBlue.spawn();
      }
    }
  }

  /**
   * @param {Module} module
   */
  shootTier1(module) {
    if (!module.cooldownActive()) {
      const dnaRed = DnaBullet.new(module.owner, null, DnaBullet.COLOR_RED);
      const dnaBlue = DnaBullet.new(module.owner, null, DnaBullet.COLOR_BLUE);
      dnaRed.spawn();
      dnaBlue.spawn();

      module.setCooldown(140);
      module.startCooldown();
    }
  }

  /**
   * @param {Module} module
   */
  shootTier2(module) {
    const dnaBeam = DnaBeam.new(module.owner);
    dnaBeam.spawn();

    module.setCooldown(90);
    module.owner.setSoundCooldown(140);
    module.startCooldown();
  }
}
