import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import Module from '@renderer/core/@typescript/prefabs/Module';
import Upgrade from '@renderer/core/@typescript/prefabs/items/Upgrade';
import DnaWeapon from '@renderer/core/@typescript/prefabs/items/weapons/DnaWeapon';

export default class DnaUpgrade extends Upgrade {
  constructor(dropper: PhysicEntityScript) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `dnaupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/dna'),
      animation: 'loop',
      loop: true,
    });
  }

  onPicked(picker: PlayerShip & IAttachedEntities) {
    let newModule = null;
    const moduleList = Global.Game.findEntitiesByTags('module', '!bitModule');
    if (moduleList.length < Global.Game.getPlayerList().length) {
      newModule = new Module();
      newModule.spawn();
    }
    const module = picker.getAttachedEntity('module') ?? picker.releasedModule ?? Global.Game.findFirstEntityByTags('module', '!bitModule', '!linked', '!attached');
    if (module && module !== newModule) {
      module.increaseTier();
      module.weapon = new DnaWeapon();
    }
  }
}
