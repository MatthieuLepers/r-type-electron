import Global from '@renderer/core/stores/AppStore';
import Enemy from '@renderer/core/classes/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import Shooter from '@renderer/core/classes/components/Shooter';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';
import RedLaser from '@renderer/core/classes/prefabs/projectiles/RedLaser';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Mid extends Enemy {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.damages = 1;

    this.addComponent(Shooter, Mid);

    // Locomotor
    this.components.locomotor.speedX = 110;
    this.bindPath(ComplexePath.fromSvgString('M 700 300 L 550 300').moveTo(new Point(Global.Game.canvas.width, Global.Random.rnd(0, Global.Game.canvas.height - 32))));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `mid${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/mid'),
      animation: 'loop',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(1);
    this.components.health.healthBarVisible = true;

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('player', '!isDead');

    // Shooter
    this.components.shooter.setProjectile(RedLaser);

    this.on('dead', () => {
      this.playSound('fx/entity/explosion');
      Explosion.EXPLOSION_NORMAL(this).spawn();
    });
  }
}
