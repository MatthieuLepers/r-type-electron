import Global from '@renderer/core/stores/AppStore';
import Fx from '@renderer/core/classes/prefabs/fx/Fx';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ShipBulletChargeShootFx extends Fx {
  /**
   * @inheritdoc
   */
  constructor(parent) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.components.transform.position.x + this.parent.components.sprite.width + this.getAttachedModuleOffset(),
      this.parent.components.sprite.centerOrigin.y - 10,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.parent.getId()}_chargeshoot`,
      asset: Global.Assets.get('particles/fx/charge_shoot'),
      animation: 'idle',
    });
  }

  /**
   * @return {Number}
   */
  getAttachedModuleOffset() {
    if (this.parent.isEntityAttached('module') && this.parent.getAttachedEntity('module').side === 'front') {
      return this.parent.getAttachedEntity('module').components.sprite.width;
    }
    return 0;
  }

  update() {
    super.update();
    this.setTransform(
      this.parent.components.transform.position.x + this.parent.components.sprite.width + this.getAttachedModuleOffset(),
      this.parent.components.sprite.centerOrigin.y - 10,
    );
  }
}
