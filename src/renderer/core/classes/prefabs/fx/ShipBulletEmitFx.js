import Global from '@renderer/core/stores/AppStore';
import Fx from '@renderer/core/classes/prefabs/fx/Fx';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ShipBulletEmitFx extends Fx {
  /**
   * @inheritdoc
   */
  constructor(parent) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.components.transform.position.x + this.parent.getSprite().width + this.getAttachedModuleOffset(),
      this.parent.getSprite().centerOrigin.y - 6,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.parent.getId()}_emit`,
      asset: Global.Assets.get('particles/fx/bullet_emit'),
      animation: 'idle',
    });
  }

  /**
   * @return {Number}
   */
  getAttachedModuleOffset() {
    if (this.parent.isEntityAttached('module') && this.parent.getAttachedEntity('module').side === 'front') {
      return this.parent.getAttachedEntity('module').getSprite().width;
    }
    return 0;
  }

  update() {
    super.update();
    this.setTransform(
      this.parent.components.transform.position.x + this.parent.getSprite().width + this.getAttachedModuleOffset(),
      this.parent.getSprite().centerOrigin.y - 6,
    );
  }
}
