import PhysicEntityScript from '@renderer/core/classes/prefabs/PhysicEntityScript';
import AttachedEntities from '@renderer/core/classes/components/AttachedEntities';
import Health from '@renderer/core/classes/components/Health';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Enemy extends PhysicEntityScript {
  /**
   * @constructor
   */
  constructor() {
    super();
    if (this.constructor.name === 'Enemy') {
      throw new AbstractClassError(this);
    }
    this.spawnedFrom = null;

    this.addTag('enemy');

    this.addComponent(AttachedEntities, Enemy);
    this.addComponent(Health, Enemy);

    this.on('collide', (e) => {
      if (!e.details.collisionData.isCollidingHull()) {
        this.getAttacked(e.details.collider, e.details.collisionData);
      }
    });
    this.on('dead', (e) => {
      console.log(`Killed by ${e.details.killer.getId()}, owner : ${e.details.killer.owner?.getId() ?? e.details.killer.shooter?.getId()}`);

      // If is a projectile (player/module/bitmodule)
      // TODO : set owner correctly when player shoot projectile using bitmodule or module
      if (e.details.killer.hasTag('player', 'projectile') && e.details.killer.shooter.hasComponent('ScoreBoard')) {
        e.details.killer.shooter.addScore(this);
      }
      // If is module hull (detached)
      // if (e.details.killer.hasTag('module', '!bitModule', '!attached')) {}
      // If is module hull (attached)
      // if (e.details.killer.hasTag('module', '!bitModule', 'attached')) {}
      // If is bit module hull
      // if (e.details.killer.hasTag('module', 'bitModule', 'attached')) {}
    });
  }

  despawn() {
    if (this.spawnedFrom) {
      this.spawnedFrom.despawn();
    }
    super.despawn();
  }
}
