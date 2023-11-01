import Global from '@renderer/core/stores/AppStore';
import CellularWall from '@renderer/core/classes/prefabs/enemies/CellularWall';
import Enemy from '@renderer/core/classes/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Cytron extends Enemy {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 120;
    this.bindPath(ComplexePath.fromSvgString('M 750 300 C 400 300 700 50 450 50 C 150 50 450 450 150 450').moveTo(new Point(Global.Game.canvas.width, Math.floor(Global.Random.rnd(0, Global.Game.canvas.height - 32) / 8) * 8 - 6)));
    this.components.locomotor.canMove = true;
    this.components.locomotor.followSlope = true;

    // Sprite
    this.components.sprite.init({
      id: `cytron${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/cytron'),
      animation: 'idle',
    });

    // Health
    this.components.health.setMaxHealth(4);
    this.components.health.healthBarVisible = true;

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('player', '!isDead');

    this.on('dead', () => {
      this.playSound('fx/entity/explosion');
      Explosion.EXPLOSION_NORMAL(this).spawn();
    });
    this.on('damaged', () => this.playSound('fx/entity/forcefield_hit'));
    this.on('move', () => this.buildCellularWall());
  }

  buildCellularWall() {
    const pos = this.components.transform.position;
    const gridX = Math.floor(pos.x / 8) * 8;
    const gridY = Math.floor(pos.y / 8) * 8;

    if (!Global.Game.entities[`cellularwall_${gridX}_${gridY}`]) {
      const wall = CellularWall.new(`cellularwall_${gridX}_${gridY}`);
      wall.components.transform.position = this.components.transform.position.clone().add(16, 8);
      wall.spawn();
    }
  }
}
