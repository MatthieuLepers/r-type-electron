import type { ICooldown } from '@renderer/core/@typescript/components/Cooldown/i';
import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type Module from '@renderer/core/@typescript/prefabs/Module';
import FireBall from '@renderer/core/@typescript/prefabs/projectiles/FireBall';
import Weapon from '@renderer/core/@typescript/prefabs/items/weapons/Weapon';
import { Direction } from '@renderer/core/@typescript/enums/Direction';

export default class FireWeapon extends Weapon {
  constructor() {
    super('FIRE');
  }

  secondaryShoot() {}

  shootTier1(module: Module & ICooldown) {
    if (!module.cooldownActive()) {
      this.spawnFireball(module.owner, Direction.UP);
      this.spawnFireball(module.owner, Direction.DOWN);
      window.setTimeout(this.spawnFireball, 140, module.owner, Direction.UP);
      window.setTimeout(this.spawnFireball, 140, module.owner, Direction.DOWN);
      window.setTimeout(this.spawnFireball, 280, module.owner, Direction.UP);
      window.setTimeout(this.spawnFireball, 280, module.owner, Direction.DOWN);
      window.setTimeout(this.spawnFireball, 420, module.owner, Direction.UP);
      window.setTimeout(this.spawnFireball, 420, module.owner, Direction.DOWN);

      module.setCooldown(850);
      module.startCooldown();
    }
  }

  shootTier2(module: Module & ICooldown) {
    if (!module.cooldownActive()) {
      this.spawnFireball(module.owner, Direction.UP);
      this.spawnFireball(module.owner, Direction.DOWN);
      window.setTimeout(this.spawnFireball, 140, module.owner, Direction.UP);
      window.setTimeout(this.spawnFireball, 140, module.owner, Direction.DOWN);
      window.setTimeout(this.spawnFireball, 280, module.owner, Direction.UP);
      window.setTimeout(this.spawnFireball, 280, module.owner, Direction.DOWN);
      window.setTimeout(this.spawnFireball, 420, module.owner, Direction.UP);
      window.setTimeout(this.spawnFireball, 420, module.owner, Direction.DOWN);
      window.setTimeout(this.spawnFireball, 560, module.owner, Direction.UP);
      window.setTimeout(this.spawnFireball, 560, module.owner, Direction.DOWN);
      window.setTimeout(this.spawnFireball, 700, module.owner, Direction.UP);
      window.setTimeout(this.spawnFireball, 700, module.owner, Direction.DOWN);

      module.setCooldown(1200);
      module.startCooldown();
    }
  }

  spawnFireball(owner: PhysicEntityScript & IAttachedEntities, direction: `${Direction}`) {
    const fireball = new FireBall(owner, null, direction);
    fireball.spawn();
    if (owner.hasComponent('EventEmitter')) {
      owner.emit('shoot', { projectile: fireball });
    }
  }
}
