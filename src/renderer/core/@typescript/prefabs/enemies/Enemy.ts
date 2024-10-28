import { mix } from '@renderer/core/@types/Mixable';

import type { IEvent } from '@renderer/core/@typescript/Event';
import { AttachedEntitiesMixin } from '@renderer/core/@typescript/components/AttachedEntities/mixin';
import { HealthMixin } from '@renderer/core/@typescript/components/Health/mixin';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';

export default class Enemy extends mix(PhysicEntityScript)
  .with(AttachedEntitiesMixin)
  .with(HealthMixin) {
  public spawnedFrom: EntityScript = null;

  constructor() {
    super();

    this.addTag('enemy');

    this.on('collide', (e: IEvent) => {
      if (!e.details.collisionData.isCollidingHull()) {
        this.getAttacked(e.details.collider);
      }
    });
    this.on('dead', (e: IEvent) => {
      // If is a projectile (player/module/bitmodule)
      // TODO : set owner correctly when player shoot projectile using bitmodule or module
      if (e.details.killer.hasTag('player', 'projectile') && e.details.killer.shooter.hasComponent('ScoreBoard')) {
        e.details.killer.shooter.incrementScore(this);
        e.details.killer.shooter.incrementStat('killed', this);
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
