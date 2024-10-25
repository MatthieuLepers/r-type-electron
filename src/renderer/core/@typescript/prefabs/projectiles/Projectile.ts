import { mix } from '@renderer/core/@types/Mixable';

import type { IEvent } from '@renderer/core/@typescript/Event';
import { Priority } from '@renderer/core/@typescript/components/Component';
import { AttachedEntitiesMixin } from '@renderer/core/@typescript/components/AttachedEntities/mixin';
import { HealthMixin } from '@renderer/core/@typescript/components/Health/mixin';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import AbstractClassError from '@renderer/core/@typescript/errors/AbstractClassError';

export default class Projectile extends mix(PhysicEntityScript)
  .with(AttachedEntitiesMixin)
  .with(HealthMixin) {
  constructor(
    public shooter: PhysicEntityScript,
    public target: PhysicEntityScript = null,
  ) {
    super();
    if (this.constructor.name === 'Projectile') {
      throw new AbstractClassError(this.constructor);
    }
    this.addTag('projectile');

    // Sprite
    this.components.sprite.priority = Priority.HIGH;

    this.on('collide', (e: IEvent) => {
      this.getAttacked(e.details.collider);
    });
  }
}
