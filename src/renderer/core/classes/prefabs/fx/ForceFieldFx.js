import Global from '@renderer/core/stores/AppStore';
import Component from '@renderer/core/classes/components/Component';
import Fx from '@renderer/core/classes/prefabs/fx/Fx';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ForceFieldFx extends Fx {
  /**
   * @inheritdoc
   */
  constructor(parent) {
    super(parent);
    this.enabled = false;

    // Transform
    this.setTransform(
      this.parent.components.sprite.centerOrigin.x - 32,
      this.parent.components.sprite.centerOrigin.y - 32,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.priority = Component.PRIORITY_HIGH;
    this.components.sprite.init({
      id: `${this.parent.getId()}_forcefield`,
      asset: Global.Assets.get('particles/fx/forcefield'),
      animation: 'off',
      loop: true,
    });

    this.on('animOver', (e) => {
      if (e.details.anim === 'enable') {
        this.playAnimation('idle', true);
      } else if (e.details.anim === 'disable') {
        this.playAnimation('off', true);
      }
    });
  }

  enable() {
    this.enabled = true;
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
    }, { once: true });
  }
}
