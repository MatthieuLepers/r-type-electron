import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/classes/prefabs/PhysicEntityScript';
import type Module from '@renderer/core/@typescript/prefabs/Module';
import Fx from '@renderer/core/@typescript/prefabs/fx/Fx';

export default class ShipBulletChargeShootFx extends Fx<PhysicEntityScript & IAttachedEntities> {
  constructor(parent: PhysicEntityScript & IAttachedEntities) {
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

  getAttachedModuleOffset(): number {
    if (this.parent.isEntityAttached('module') && this.parent.getAttachedEntity<Module>('module').side === 'front') {
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
