import Global from '@renderer/core/stores/AppStore';
import Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ShipBullet extends Projectile {
  /**
   * @constructor
   * @param {EntityScript} shooter
   */
  constructor(shooter) {
    super(shooter);
    this.addTag('player');
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 650;
    this.bindPath(ComplexePath.fromSvgString('M 300 300 L 500 300').moveTo(new Point(
      this.shooter.components.transform.position.x + this.shooter.getSprite().width - 16,
      this.shooter.getSprite().centerOrigin.y - 2,
    )));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_bullet${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/bullet'),
      animation: 'idle',
    });

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => this.despawn());
  }
}
