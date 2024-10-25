import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import BitModule, { Slot } from '@renderer/core/@typescript/prefabs/BitModule';
import Upgrade from '@renderer/core/@typescript/prefabs/items/Upgrade';

export default class BitModuleUpgrade extends Upgrade {
  constructor(dropper: PhysicEntityScript) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `bitmoduleupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/module/bit_module'),
      animation: 'loop',
      loop: true,
    });
  }

  onPicked(picker: PlayerShip & IAttachedEntities) {
    if (!picker.isEntityAttached('bitmodule_top')) {
      const bitModuleTop = new BitModule(picker, Slot.TOP);
      bitModuleTop.on('detached', () => {
        new BitModuleUpgrade(bitModuleTop).spawn();
      });
      bitModuleTop.spawn();
    } else if (!picker.isEntityAttached('bitmodule_bottom')) {
      const bitModuleBottom = new BitModule(picker, Slot.BOTTOM);
      bitModuleBottom.on('detached', () => {
        new BitModuleUpgrade(bitModuleBottom).spawn();
      });
      bitModuleBottom.spawn();
    }
  }
}
