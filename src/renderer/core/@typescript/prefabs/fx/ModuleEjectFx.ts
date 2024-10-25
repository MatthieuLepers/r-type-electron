import Global from '@renderer/core/stores/AppStore';

import { Priority } from '@renderer/core/@typescript/components/Component';
import type Module from '@renderer/core/@typescript/prefabs/Module';
import Fx from '@renderer/core/@typescript/prefabs/fx/Fx';

export default class ModuleEjectFx extends Fx<Module> {
  constructor(parent: Module) {
    super(parent);

    // Transform
    this.setTransform(
      this.parent.components.sprite.centerOrigin.x - (this.parent.side === 'back' ? 8 : 19),
      this.parent.components.sprite.centerOrigin.y - 8,
    );

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.priority = Priority.HIGH;
    this.components.sprite.init({
      id: `${this.parent.getId()}_eject`,
      asset: Global.Assets.get('particles/fx/module_eject'),
      animation: 'idle',
    });
  }

  update() {
    super.update();
    this.setTransform(
      this.parent.components.sprite.centerOrigin.x - (this.parent.side === 'back' ? 8 : 19),
      this.parent.components.sprite.centerOrigin.y - 8,
    );
    this.playAnimation(this.parent.side ?? 'front');
  }
}
