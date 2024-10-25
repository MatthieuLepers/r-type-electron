import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import type ForceFieldFx from '@renderer/core/@typescript/prefabs/fx/ForceFieldFx';
import Upgrade from '@renderer/core/@typescript/prefabs/items/Upgrade';

export default class ForcefieldUpgrade extends Upgrade {
  constructor(dropper: PhysicEntityScript) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `forcefieldupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/forcefield'),
      animation: 'loop',
      loop: true,
    });
  }

  onPicked(picker: PlayerShip & IAttachedEntities) {
    const forcefield = picker.getAttachedEntity<ForceFieldFx>(`${picker.getId()}_forcefield`);
    picker.components.health.addShield(3);
    if (!forcefield.enabled) {
      forcefield.enable();
    }
  }
}
