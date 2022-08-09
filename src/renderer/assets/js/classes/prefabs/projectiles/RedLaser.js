import Global from '../../../stores/AppStore';
import Projectile from './Projectile';
import Point from '../../geometry/Point';
import RectangleHitbox from '../../hitboxes/RectangleHitbox';
import ComplexePath from '../../paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class RedLaser extends Projectile {
  /**
   * @constructor
   * @param {EntityScript} shooter
   */
  constructor(shooter) {
    super(shooter);
    this.addTag('enemy', 'piercing');
    this.damages = 2;

    // Locomotor
    this.components.locomotor.speedX = 600;
    this.bindPath(ComplexePath.fromSvgString('M 700 300 L 550 300').moveTo(new Point(this.shooter.components.transform.position.x, this.shooter.getSprite().centerOrigin.y - 2)));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_redlaser${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/red_laser'),
      animation: 'loop',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(2);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('player', '!module', '!projectile');

    this.on('dead', () => this.despawn());
  }
}
