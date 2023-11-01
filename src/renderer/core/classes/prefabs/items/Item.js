import PhysicEntityScript from '@renderer/core/classes/prefabs/PhysicEntityScript';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Item extends PhysicEntityScript {
  /**
   * @constructor
   * @param {EntityScript} dropper
   */
  constructor(dropper = null) {
    super();
    if (this.constructor.name === 'Item') {
      throw new AbstractClassError(this);
    }
    this.dropper = dropper;
    this.addTag('item', 'pickable');

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('!isDead');

    this.on('picked', () => {
      this.playSound('fx/player/pick_upgrade');
    });
    this.on('collide', this.pick.bind(this));
  }

  /**
   * @param {EntityScript} picker
   */
  pick(e) {
    this.emit('picked', { picker: e.details.collider });
    this.despawn();
  }
}
