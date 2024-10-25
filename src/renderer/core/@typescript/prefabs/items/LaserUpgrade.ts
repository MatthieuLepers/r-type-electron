import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import Module from '@renderer/core/@typescript/prefabs/Module';
import Upgrade from '@renderer/core/@typescript/prefabs/items/Upgrade';
import LaserWeapon from '@renderer/core/@typescript/prefabs/items/weapons/LaserWeapon';

export default class LaserUpgrade extends Upgrade {
  constructor(dropper: PhysicEntityScript) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `laserupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/laser'),
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
    const module: Module = picker.getAttachedEntity<Module>('module') ?? picker.releasedModule ?? Global.Game.findFirstEntityByTags('module', '!bitModule', '!linked', '!attached');
    if (module && module !== newModule) {
      module.increaseTier();
      module.weapon = new LaserWeapon();
    }
  }
}
