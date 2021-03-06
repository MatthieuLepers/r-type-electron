import Global from '../../stores/AppStore';
import Runnable from './Runnable';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class PhysicRunnable extends Runnable {
  /**
   * @constructor
   */
  constructor() {
    super('physicEngine');
  }

  step() {
    Global.Game.quadTree.clear();
    const physicEntities = Object
      .values(Global.Game.entities)
      .filter(entity => entity.hasComponent('Physics') && !entity.hasTag('dead'))
    ;

    Global.Game.quadTree.insertAll(physicEntities);

    // Render QuadTree
    if (Global.Settings.debug.drawCollisionDetectionArea) {
      Global.Game.quadTree.render(Global.Game.ctx);
    }

    physicEntities.forEach((entity) => {
      Global.Game.quadTree.retrieve(entity).forEach(ent => entity.components.physics.checkCollidingWith(ent));
    });
  }
}
