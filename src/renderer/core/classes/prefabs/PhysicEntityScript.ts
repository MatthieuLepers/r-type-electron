import EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import Locomotor from '@renderer/core/classes/components/Locomotor';
import Physics from '@renderer/core/classes/components/Physics';
import Sprite from '@renderer/core/classes/components/Sprite';
import Transform from '@renderer/core/classes/components/Transform';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import Rectangle from '@renderer/core/classes/geometry/Rectangle';
import type Hitbox from '@renderer/core/classes/hitboxes/Hitbox';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class PhysicEntityScript extends EntityScript {
  declare components: {
    locomotor: Locomotor,
    physics: Physics,
    sprite: Sprite,
    transform: Transform,
  };

  constructor(initCallback: Function | null) {
    super(initCallback);

    this.addComponent(Locomotor, PhysicEntityScript);
    this.addComponent(Physics, PhysicEntityScript);
    this.addComponent(Sprite, PhysicEntityScript);
    this.addComponent(Transform, PhysicEntityScript);
  }

  getHitboxBounds(): Rectangle {
    return new Rectangle(
      this.components.transform.position.x,
      this.components.transform.position.y,
      this.components.sprite.width,
      this.components.sprite.height,
      this.components.sprite.options.rotation,
    );
  }

  getHitbox(): Array<Hitbox> {
    return [new RectangleHitbox(this.getHitboxBounds())];
  }
}
