import Global from '@renderer/core/stores/AppStore';

import Runnable from '@renderer/core/@typescript/runnable/Runnable';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';

export default class PhysicRunnable extends Runnable {
  constructor() {
    super('physicEngine', null, false);
  }

  step() {
    Global.Game.quadTree.clear();
    const physicEntities = Object
      .values(Global.Game.entities)
      .filter((entity: EntityScript) => entity.hasComponent('Physics') && !entity.hasTag('dead'))
    ;

    Global.Game.quadTree.insertAll(physicEntities);

    // Render QuadTree
    if (Global.Settings.debug.drawCollisionDetectionArea) {
      Global.Game.quadTree.render(Global.Game.ctx);
    }

    physicEntities.forEach((entity: PhysicEntityScript) => {
      Global.Game.quadTree
        .retrieve(entity)
        .forEach((ent: PhysicEntityScript) => entity.components.physics.checkCollidingWith(ent))
      ;
    });
  }
}
