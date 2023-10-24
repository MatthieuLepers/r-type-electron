import Weapon from '@renderer/core/classes/prefabs/items/weapons/Weapon';
import Direction from '@renderer/core/classes/enums/Direction';
import FireBall from '@renderer/core/classes/prefabs/projectiles/FireBall';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class FireWeapon extends Weapon {
  /**
   * @constructor
   */
  constructor() {
    super('FIRE');
  }

  /**
   * @param {Module} module
   */
  shootTier1(module) {
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

  /**
   * @param {Module} module
   */
  shootTier2(module) {
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

  /**
   * @param {Entity} owner
   * @param {Direction} direction
   */
  spawnFireball(owner, direction) {
    const fireball = FireBall.new(owner, null, direction);
    fireball.spawn();
    if (owner.hasComponent('EventEmitter')) {
      owner.emit('shoot', { projectile: fireball });
    }
  }
}
