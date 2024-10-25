import Global from '@renderer/core/stores/AppStore';

import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Fx from '@renderer/core/@typescript/prefabs/fx/Fx';
import { Priority } from '@renderer/core/@typescript/components/Component';

export default class ShipBoosterFx extends Fx<PhysicEntityScript> {
  constructor(parent: PhysicEntityScript) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.components.transform.position.x - 32,
      this.parent.components.sprite.centerOrigin.y - 16,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.priority = Priority.HIGH;
    this.components.sprite.init({
      id: `${this.parent.getId()}_booster`,
      asset: Global.Assets.get('particles/fx/booster'),
      animation: 'loop',
      loop: true,
    });
  }

  accelerate() {
    this.on('animLoop', () => {
      this.playAnimation('boost');
      this.on('animOver', () => {
        this.playAnimation('loop', true);
      }, { once: true });
    }, { once: true });
  }
}
