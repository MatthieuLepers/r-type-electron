import type { ICooldown } from '@renderer/core/@typescript/components/Cooldown/i';
import type Module from '@renderer/core/@typescript/prefabs/Module';
import Weapon from '@renderer/core/@typescript/prefabs/items/weapons/Weapon';
import BlueLaser from '@renderer/core/@typescript/prefabs/projectiles/BlueLaser';

export default class LaserWeapon extends Weapon {
  constructor() {
    super('LASER');
  }

  secondaryShoot() {}

  shootTier1(module: Module & ICooldown) {
    if (!module.cooldownActive()) {
      const blueLaser0 = new BlueLaser(module.owner, null, 45);
      const blueLaser1 = new BlueLaser(module.owner, null, 0);
      const blueLaser2 = new BlueLaser(module.owner, null, -45);
      blueLaser0.spawn();
      blueLaser1.spawn();
      blueLaser2.spawn();

      module.setCooldown((module.tier === 1 ? 1000 : 850));
      module.startCooldown();
    }
  }

  shootTier2(module: Module & ICooldown) {
    this.shootTier1(module);
  }
}
