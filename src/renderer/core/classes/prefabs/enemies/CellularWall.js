import Global from '@renderer/core/stores/AppStore';
import Enemy from '@renderer/core/classes/prefabs/enemies/Enemy';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class CellularWall extends Enemy {
  /**
   * @constructor
   * @param {String} id
   */
  constructor(id) {
    super();
    this.damages = 1;

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
    this.components.physics.hitboxType = RectangleHitbox;
    this.components.physics.collisionCheckRange = 8;
    this.addCollisionTag('player', '!isDead');

    this.on('dead', () => this.despawn());
    this.on('spawn', () => {
      this.components.transform.position = this.components.transform.position.clone().placeOnGrid(8, 8);
    });
  }
}
