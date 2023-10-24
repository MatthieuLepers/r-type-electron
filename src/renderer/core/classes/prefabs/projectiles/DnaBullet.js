import Global from '@renderer/core/stores/AppStore';
import Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import Module from '@renderer/core/classes/prefabs/Module';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class DnaBullet extends Projectile {
  /**
   * @constructor
   * @param {EntityScript} shooter
   * @param {EntityScript} target
   * @param {String} color
   */
  constructor(shooter, target, color) {
    super(shooter, target);
    this.addTag('player', 'dna');
    this.color = color;
    this.damages = 3;

    // Locomotor
    this.components.locomotor.speedX = 800;
    this.bindPath(this.getPath());
    this.components.locomotor.canMove = true;
    if (this.shooter.hasTag('module', 'bitModule')) {
      this.shooter = this.shooter.owner;
    }

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_dnabullet_${this.color}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/dna_bullet'),
      animation: `loop_${this.color}${(this.getModuleSide() === Module.SIDE_FRONT ? '' : '_reverse')}`,
      loop: true,
      animationDelay: 6,
    });

    // Health
    this.components.health.setMaxHealth(3);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => Explosion.EXPLOSION_DNA_BULLET(this).spawn());
  }

  /**
   * @return {String}
   */
  getModuleSide() {
    let { shooter } = this;
    if (this.shooter.hasTag('module', 'bitModule')) {
      shooter = this.shooter.owner;
    }
    return shooter.getAttachedEntity('module').side;
  }

  /**
   * @return {ComplexePath}
   */
  getPath() {
    const pathMX = (this.getModuleSide() === Module.SIDE_FRONT ? '0' : '300');
    const pathLX = (this.getModuleSide() === Module.SIDE_FRONT ? '300' : '0');

    // Shooter is a BitModule
    if (this.shooter.hasTag('module', 'bitModule')) {
      return ComplexePath.fromSvgString(`M ${pathMX} 0 L ${pathLX} 0`).moveTo(new Point(
        this.shooter.components.transform.position.x + (this.getModuleSide() === Module.SIDE_FRONT ? 14 : -32),
        this.shooter.components.transform.position.y + (this.shooter.getSprite().height / 2) - 2,
      ));
    }
    // Shooter is a Player
    return ComplexePath.fromSvgString(`M ${pathMX} 0 L ${pathLX} 0`).moveTo(new Point(
      this.shooter.components.transform.position.x + (this.getModuleSide() === Module.SIDE_FRONT ? this.shooter.getSprite().width + 5 : -this.shooter.getSprite().width),
      this.shooter.components.transform.position.y + (this.color === DnaBullet.COLOR_BLUE ? 16 : -1),
    ));
  }

  /**
   * @return {String}
   */
  static get COLOR_BLUE() {
    return 'blue';
  }

  /**
   * @return {String}
   */
  static get COLOR_RED() {
    return 'red';
  }
}
