import Global from '@renderer/core/stores/AppStore';
import Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class PlasmaBall extends Projectile {
  /**
   * @@constructor
   * @param {EntityScript} shooter
   * @param {EntityScript} target
   */
  constructor(shooter, target) {
    super(shooter, target);
    this.addTag('enemy', 'absorbable');
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 300;
    this.bindPath(ComplexePath.fromSvgString(`M ${this.shooter.components.transform.position.x + 7} ${this.shooter.components.transform.position.y + (this.shooter.getSprite().height / 2) - 3} L ${this.target.getSprite().centerOrigin.x} ${this.target.getSprite().centerOrigin.y}`));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_plasmaball${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/plasma_ball'),
      animation: 'loop',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('player', '!projectile');

    this.on('dead', () => Explosion.EXPLOSION_TINY(this).spawn());
  }
}
