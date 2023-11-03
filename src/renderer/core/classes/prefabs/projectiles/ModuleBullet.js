import Global from '@renderer/core/stores/AppStore';
import Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

export default class ModuleBullet extends Projectile {
  /**
   * @param {EntityScript} shooter
   * @param {EntityScript} target
   * @param {Number} angle
   */
  constructor(shooter, target = null, angle = 0) {
    super(shooter, target);
    this.addTag('player');
    this.damages = 1;
    this.angle = angle;

    // Locomotor
    this.components.locomotor.speedX = 650;
    this.bindPath(ComplexePath.fromSvgString('M 0 0 L 200 0').rotate(this.angle, new Point(0, 0)).moveTo(new Point(
      this.shooter.components.sprite.centerOrigin.x - 8,
      this.shooter.components.sprite.centerOrigin.y - 1,
    )));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_bullet_${this.angle}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/module_shot_0'),
      animation: 'idle',
      rotation: this.angle,
    });

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => this.despawn());
  }
}
