import EntityScript from './EntityScript';
import Locomotor from '../components/Locomotor';
import Physics from '../components/Physics';
import Sprite from '../components/Sprite';
import Transform from '../components/Transform';
import RectangleHitbox from '../hitboxes/RectangleHitbox';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class PhysicEntityScript extends EntityScript {
  /**
   * @constructor
   * @param {Function} initCallback
   */
  constructor(initCallback = null) {
    super(initCallback);

    this.addComponent(Locomotor, PhysicEntityScript);
    this.addComponent(Physics, PhysicEntityScript);
    this.addComponent(Sprite, PhysicEntityScript);
    this.addComponent(Transform, PhysicEntityScript);
  }

  /**
   * @return {Object}
   */
  getHitboxBounds() {
    return {
      x: this.components.transform.position.x,
      y: this.components.transform.position.y,
      width: this.getSprite().width,
      height: this.getSprite().height,
      rotation: this.getSprite().options.rotation,
    };
  }

  /**
   * @return {Hitbox[]}
   */
  getHitbox() {
    return [new RectangleHitbox(this.getHitboxBounds())];
  }
}
