import Global from '@renderer/core/stores/AppStore';

import type { IEvent } from '@renderer/core/@typescript/Event';
import { Priority } from '@renderer/core/@typescript/components/Component';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Fx from '@renderer/core/@typescript/prefabs/fx/Fx';

export default class ForceFieldFx extends Fx<PhysicEntityScript> {
  public enabled: boolean = false;

  constructor(parent: PhysicEntityScript) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.components.sprite.centerOrigin.x - 32,
      this.parent.components.sprite.centerOrigin.y - 32,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.priority = Priority.HIGH;
    this.components.sprite.init({
      id: `${this.parent.getId()}_forcefield`,
      asset: Global.Assets.get('particles/fx/forcefield'),
      animation: 'off',
      loop: true,
    });

    this.on('animOver', (e: IEvent) => {
      if (e.details.anim === 'enable') {
        this.playAnimation('idle', true);
      } else if (e.details.anim === 'disable') {
        this.playAnimation('off', true);
      }
    });
    this.parent.on('shieldBroke', () => {
      this.disable();
    });
  }

  enable() {
    this.enabled = true;
    this.parent.damages = Infinity;
    this.playAnimation('enable');
    this.on('animOver', () => {
      this.playAnimation('idle', true);
    }, { once: true });
  }

  disable() {
    this.playAnimation('disable');
    this.on('animOver', () => {
      this.playAnimation('off', true);
      this.enabled = false;
      this.parent.damages = 1;
    }, { once: true });
  }
}
