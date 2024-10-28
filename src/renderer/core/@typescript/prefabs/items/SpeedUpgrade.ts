import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import type ShipBoosterFx from '@renderer/core/@typescript/prefabs/fx/ShipBoosterFx';
import Upgrade from '@renderer/core/@typescript/prefabs/items/Upgrade';

export default class SpeedUpgrade extends Upgrade {
  public speedMult: number = 1.25; // +25% speed

  constructor(dropper: PhysicEntityScript) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `speedupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/speed'),
      animation: 'loop',
      loop: true,
    });
  }

  onPicked(picker: PlayerShip & IAttachedEntities) {
    picker.speed = Math.min(picker.maxSpeed, picker.speed * this.speedMult);
    picker.getAttachedEntity<ShipBoosterFx>(`${picker.getId()}_booster`).accelerate();
  }
}
