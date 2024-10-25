import type { ICooldown } from '@renderer/core/@typescript/components/Cooldown/i';
import Module from '@renderer/core/@typescript/prefabs/Module';
import type BitModule from '@renderer/core/@typescript/prefabs/BitModule';
import DnaBeam from '@renderer/core/@typescript/prefabs/projectiles/DnaBeam';
import DnaBullet, { Color } from '@renderer/core/@typescript/prefabs/projectiles/DnaBullet';
import Weapon from '@renderer/core/@typescript/prefabs/items/weapons/Weapon';

export default class DnaWeapon extends Weapon {
  constructor() {
    super('DNA');
  }

  shoot(module: Module) {
    super.shoot(module);
    this.secondaryShoot(module);
  }

  secondaryShoot(module: Module) {
    if (module?.tier >= 1) {
      module.owner.getAttachedEntity<BitModule>('bitmodule_top')?.shoot();
      module.owner.getAttachedEntity<BitModule>('bitmodule_bottom')?.shoot();
    }
  }

  shootTier1(module: Module & ICooldown) {
    if (!module.cooldownActive()) {
      new DnaBullet(module.owner, null, Color.RED).spawn();
      new DnaBullet(module.owner, null, Color.BLUE).spawn();

      module.setCooldown(140);
      module.startCooldown();
    }
  }

  shootTier2(module: Module & ICooldown) {
    new DnaBeam(module.owner).spawn();

    module.setCooldown(90);
    module.owner.setSoundCooldown(140);
    module.startCooldown();
  }
}
