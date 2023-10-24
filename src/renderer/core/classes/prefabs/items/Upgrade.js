import Item from '@renderer/core/classes/prefabs/items/Item';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';
import AbstractMethodNotImplementedError from '@renderer/core/classes/errors/AbstractMethodNotImplementedError';
import Point from '@renderer/core/classes/geometry/Point';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Upgrade extends Item {
  /**
   * @constructor
   * @param {EntityScript} dropper
   */
  constructor(dropper) {
    super(dropper);
    if (this.constructor.name === 'Upgrade') {
      throw new AbstractClassError(this);
    }

    // Physics
    this.addCollisionTag('player', '!module', '!projectile');
    this.removeCollisionTag('!invinsible');

    // Locomotor
    this.components.locomotor.speedX = 75;
    this.bindPath(ComplexePath.fromSvgString('M 100 0 L 0 0').moveTo(new Point(this.dropper.getSprite().centerOrigin.x - 10, this.dropper.getSprite().centerOrigin.y - 9)));
    this.components.locomotor.canMove = true;

    this.on('picked', (e) => {
      this.onPicked(e.details.picker);
    });
  }

  /**
   * @param {EntityScript} picker
   */
  onPicked() {
    throw new AbstractMethodNotImplementedError('onPicked', this);
  }
}
