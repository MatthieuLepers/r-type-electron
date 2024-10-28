import Global from '@renderer/core/stores/AppStore';

import Enemy from '@renderer/core/@typescript/prefabs/enemies/Enemy';

export default class CellularWall extends Enemy {
  constructor(id: string) {
    super();
    this.damages = 1;
    this.score = 10;

    this.addTag('wall', 'immobile');

    // Locomotor
    this.removeComponent('Locomotor');

    // Sprite
    this.components.sprite.init({
      id,
      asset: Global.Assets.get('entities/enemies/cellular_wall'),
      animation: 'idle',
    });

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.addCollisionTag('player', '!isDead');

    this.on('dead', () => this.despawn());
    this.on('spawn', () => {
      this.components.transform.position = this.components.transform.position.clone().placeOnGrid(8, 8);
    });
  }
}
