import { mix } from '@renderer/core/@types/Mixable';

import { SpriteMixin } from '@renderer/core/@typescript/components/Sprite/mixin';
import { TransformMixin } from '@renderer/core/@typescript/components/Transform/mixin';
import { LocomotorMixin } from '@renderer/core/@typescript/components/Locomotor/mixin';
import EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export default class Fx<T> extends mix(EntityScript)
  .with(SpriteMixin)
  .with(TransformMixin)
  .with(LocomotorMixin) {
  constructor(public parent: T) {
    super();
    this.addTag('fx', 'staySpawned');
  }

  update() {
    this.show();
  }
}
