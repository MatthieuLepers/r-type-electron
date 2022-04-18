import PhysicEntityScript from '../PhysicEntityScript';
import RectangleHitbox from '../../hitboxes/RectangleHitbox';
import AbstractClassError from '../../errors/AbstractClassError';

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
      this.playSound('player/pick_upgrade');
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
