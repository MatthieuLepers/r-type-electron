import Global from '@renderer/core/stores/AppStore';

import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import Upgrade from '@renderer/core/@typescript/prefabs/items/Upgrade';

export default class RocketUpgrade extends Upgrade {
  constructor(dropper: PhysicEntityScript) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `rocketupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/rockets'),
      animation: 'loop',
      loop: true,
    });
  }

  onPicked(picker: PlayerShip) {
    console.log(`[WIP] Picked rocket upgrade by ${picker.getId()}`);
  }
}
