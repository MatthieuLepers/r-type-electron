import { mix } from '@renderer/core/@types/Mixable';

import { LocomotorMixin } from '@renderer/core/@typescript/components/Locomotor/mixin';
import { PhysicsMixin } from '@renderer/core/@typescript/components/Physics/mixin';
import { SpriteMixin } from '@renderer/core/@typescript/components/Sprite/mixin';
import { TransformMixin } from '@renderer/core/@typescript/components/Transform/mixin';
import EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import RectangleHitbox from '@renderer/core/@typescript/hitboxes/RectangleHitbox';
import type { IRectangle } from '@renderer/core/@typescript/geometry/Rectangle';
import type Hitbox from '@renderer/core/@typescript/hitboxes/Hitbox';

export default class PhysicEntityScript extends mix(EntityScript)
  .with(SpriteMixin)
  .with(LocomotorMixin)
  .with(PhysicsMixin)
  .with(TransformMixin) {
  getHitboxBounds(): IRectangle {
    return {
      x: this.components.transform.position.x,
      y: this.components.transform.position.y,
      width: this.components.sprite.width,
      height: this.components.sprite.height,
      rotation: this.components.sprite.options.rotation,
    };
  }

  getHitbox(): Array<Hitbox> {
    return [new RectangleHitbox(this.getHitboxBounds())];
  }
}
