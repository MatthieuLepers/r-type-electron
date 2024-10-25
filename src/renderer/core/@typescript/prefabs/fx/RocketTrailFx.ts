import Global from '@renderer/core/stores/AppStore';

import { Priority } from '@renderer/core/@typescript/components/Component';
import type Rocket from '@renderer/core/@typescript/prefabs/projectiles/Rocket';
import Fx from '@renderer/core/@typescript/prefabs/fx/Fx';
import Point from '@renderer/core/@typescript/geometry/Point';

export default class RocketTrailFx extends Fx<Rocket> {
  constructor(parent: Rocket) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.components.transform.position.x - 7,
      this.parent.components.sprite.centerOrigin.y - 6,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.priority = Priority.HIGH;
    this.components.sprite.init({
      id: `${this.parent.getId()}_trail`,
      asset: Global.Assets.get('particles/fx/rocket_trail'),
      animation: 'loop',
      loop: true,
    });

    this.parent.on('move', () => {
      this.components.sprite.options.rotation = this.parent.components.sprite.options.rotation;
      const newPos = new Point(
        this.parent.components.transform.position.x - 7,
        this.parent.components.sprite.centerOrigin.y - 6,
      ).rotate(this.parent.components.sprite.options.rotation, this.parent.components.sprite.centerOrigin);
      this.setTransform(newPos.x, newPos.y);
    });
  }
}
