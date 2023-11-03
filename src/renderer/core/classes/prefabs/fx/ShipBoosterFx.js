import Global from '@renderer/core/stores/AppStore';
import Fx from '@renderer/core/classes/prefabs/fx/Fx';
import Component from '@renderer/core/classes/components/Component';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ShipBoosterFx extends Fx {
  /**
   * @inheritdoc
   */
  constructor(parent) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.components.transform.position.x - 32,
      this.parent.components.sprite.centerOrigin.y - 16,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.priority = Component.PRIORITY_HIGH;
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
