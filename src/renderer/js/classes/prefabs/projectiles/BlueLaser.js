import Global from '../../../stores/AppStore';
import Projectile from './Projectile';
import Explosion from '../Explosion';
import Module from '../Module';
import Point from '../../geometry/Point';
import RectangleHitbox from '../../hitboxes/RectangleHitbox';
import ComplexePath from '../../paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class BlueLaser extends Projectile {
  /**
   * @constructor
   * @param {EntityScript} shooter
   * @param {EntityScript} target
   * @param {Number} angle
   */
  constructor(shooter, target, angle = 0) {
    super(shooter, target);
    this.addTag('player', 'laser');
    this.angle = angle;
    this.damages = 2;

    // Locomotor
    this.components.locomotor.speedX = 500;
    this.bindPath(this.getPath());
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_laser_${this.angle}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/blue_laser'),
      animation: `launch_t${this.getModuleTier()}`,
      rotation: this.angle + (this.getModuleSide() === Module.SIDE_BACK && this.angle !== 0 ? 90 : 0),
      animationDelay: 1,
    });

    // Health
    this.components.health.setMaxHealth(2);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('enemy', '!isDead', '!projectile');

    this.on('dead', () => {
      this.playAnimation(`absorb_t${this.getModuleTier()}`);
      this.on('animOver', () => Explosion.EXPLOSION_BLUE_LASER(this).spawn());
    });
  }

  /**
   * @return {Number}
   */
  getModuleTier() {
    return this.shooter.getAttachedEntity('module').tier;
  }

  /**
   * @return {String}
   */
  getModuleSide() {
    return this.shooter.getAttachedEntity('module').side;
  }

  /**
   * @return {ComplexePath}
   */
  getPath() {
    const pathMX = (this.getModuleSide() === Module.SIDE_FRONT ? '0' : '200');
    const pathMY = (this.angle < 0 ? '200' : '0');
    const pathLX = (this.getModuleSide() === Module.SIDE_BACK ? '0' : '200');
    const pathLY = (this.angle > 0 ? '200' : '0');

    return ComplexePath.fromSvgString(`M ${pathMX} ${pathMY} L ${pathLX} ${pathLY}`).moveTo(new Point(
      this.shooter.components.transform.position.x + (this.getModuleSide() === Module.SIDE_FRONT ? this.shooter.getSprite().width : -this.shooter.getAttachedEntity('module').getSprite().width),
      this.shooter.getSprite().centerOrigin.y - 1.5,
    ));
  }
}
