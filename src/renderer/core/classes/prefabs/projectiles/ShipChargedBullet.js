import Global from '@renderer/core/stores/AppStore';
import Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

export default class ShipChargedBullet extends Projectile {
  /**
   * @constructor
   * @param {EntityScript} shooter
   * @param {EntityScript} target
   * @param {Number} percent
   */
  constructor(shooter, target, percent) {
    super(shooter, target);
    this.addTag('player', 'piercing');
    this.data = this.getData(percent);
    this.asset = Global.Assets.get(`entities/projectiles/chargedbullet_${ShipChargedBullet.parsePercent(percent)}`);
    this.damages = this.data.damages;

    // Locomotor
    this.components.locomotor.speedX = this.data.speed;
    this.bindPath(ComplexePath.fromSvgString('M 300 300 L 500 300').moveTo(new Point(
      this.shooter.components.transform.position.x + this.shooter.components.sprite.width + 5,
      this.shooter.components.sprite.centerOrigin.y - (this.asset.height / 2),
    )));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_chargedbullet${Global.Game.uniqid()}`,
      asset: this.asset,
      animation: 'loop',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(this.data.health);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => this.despawn());
  }

  /**
   * @param {Number} percent
   * @return {Number}
   */
  static parsePercent(percent) {
    if (percent >= 15 && percent < 25) {
      return 15;
    }
    if (percent >= 25 && percent < 50) {
      return 25;
    }
    if (percent >= 50 && percent < 75) {
      return 50;
    }
    if (percent >= 75 && percent < 90) {
      return 75;
    }
    if (percent >= 90 && percent <= 100) {
      return 90;
    }
    return 0;
  }

  /**
   * @param {Number} percent
   * @return {Number}
   */
  getData(percent) {
    const data = {
      15: { health: 8, speed: 600, damages: 8 },
      25: { health: 8.5, speed: 700, damages: 8.5 },
      50: { health: 9, speed: 800, damages: 9 },
      75: { health: 9.5, speed: 900, damages: 9.5 },
      90: { health: 10, speed: 1000, damages: 10 },
    };
    return data[ShipChargedBullet.parsePercent(percent)];
  }
}
