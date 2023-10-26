import Global from '@renderer/core/stores/AppStore';
import Fx from '@renderer/core/classes/prefabs/fx/Fx';
import Component from '@renderer/core/classes/components/Component';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class RocketTrailFx extends Fx {
  /**
   * @inheritdoc
   */
  constructor(parent) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.components.transform.position.x - 7,
      this.parent.getSprite().centerOrigin.y - 6,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.priority = Component.PRIORITY_HIGH;
    this.components.sprite.init({
      id: `${this.getId()}_trail`,
      asset: Global.Assets.get('particles/fx/rocket_trail'),
      animation: 'loop',
      loop: true,
    });

    this.parent.on('move', () => {
      this.getSprite().options.rotation = this.parent.getSprite().options.rotation;
      const newPos = new Point(
        this.parent.components.transform.position.x - 7,
        this.parent.getSprite().centerOrigin.y - 6,
      ).rotate(this.parent.getSprite().options.rotation, this.parent.getSprite().centerOrigin);
      this.setTransform(newPos.x, newPos.y);
    });
  }
}