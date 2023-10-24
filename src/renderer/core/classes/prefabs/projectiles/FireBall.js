import Global from '@renderer/core/stores/AppStore';
import Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import Direction from '@renderer/core/classes/enums/Direction';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class FireBall extends Projectile {
  /**
   * @constructor
   * @param {EntityScript} shooter
   * @param {EntityScript} target
   * @param {Direction} direction
   */
  constructor(shooter, target, direction) {
    super(shooter, target);
    this.addTag('player', 'fire');
    this.direction = direction;
    this.damages = 3;

    // Locomotor
    this.components.locomotor.speedX = 400;
    this.bindPath(this.getPath());
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_fireball_${this.direction}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/fireball'),
      animation: 'loop',
      rotation: (this.direction === Direction.UP ? 90 : -90),
      animationDelay: 6,
    });

    // Health
    this.components.health.setMaxHealth(5);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => Explosion.EXPLOSION_FIREBALL(this).spawn());
  }

  /**
   * @return {ComplexePath}
   */
  getPath() {
    const module = this.shooter.getAttachedEntity('module') || null;
    let { x } = this.shooter.components.transform.position;

    if (module) {
      x += (module.side === 'back' ? -16 : this.shooter.getSprite().width + 2);
    }

    if (this.direction === Direction.UP) {
      return ComplexePath.fromSvgString('M 0 900 L 0 0').moveTo(new Point(x, this.shooter.getSprite().centerOrigin.y - 8));
    }
    return ComplexePath.fromSvgString('M 0 0 L 0 900').moveTo(new Point(x, this.shooter.getSprite().centerOrigin.y - 8));
  }
}
