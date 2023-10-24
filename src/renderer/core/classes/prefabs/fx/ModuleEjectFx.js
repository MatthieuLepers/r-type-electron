import Global from '@renderer/core/stores/AppStore';
import Fx from '@renderer/core/classes/prefabs/fx/Fx';
import Component from '@renderer/core/classes/components/Component';

export default class ModuleEjectFx extends Fx {
  /**
   * @inheritdoc
   */
  constructor(parent) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.getSprite().centerOrigin.x - (this.parent.side === 'back' ? 8 : 19),
      this.parent.getSprite().centerOrigin.y - 8,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.priority = Component.PRIORITY_HIGH;
    this.components.sprite.init({
      id: `${this.parent.getId()}_eject`,
      asset: Global.Assets.get('particles/fx/module_eject'),
      animation: 'idle',
    });
  }

  update() {
    super.update();
    this.setTransform(
      this.parent.getSprite().centerOrigin.x - (this.parent.side === 'back' ? 8 : 19),
      this.parent.getSprite().centerOrigin.y - 8,
    );
    this.playAnimation(this.parent.side ?? 'front');
  }
}
