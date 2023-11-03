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
export default class Cheetah extends Enemy {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.damages = 1;

    this.addComponent(Shooter, Cheetah);

    // Locomotor
    this.components.locomotor.speedX = 90;

    this.bindPath(ComplexePath.fromSvgString('M 700 300 L 550 300').moveTo(new Point(Global.Game.canvas.width, Global.Random.rnd(0, Global.Game.canvas.height - 42))));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `cheetah${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/cheetah'),
      animation: 'loop',
      loop: true,
      animationDelay: 6,
    });

    // Health
    this.components.health.setMaxHealth(20);
    this.components.health.healthBarVisible = true;

    // Physics
    this.addCollisionTag('player', '!isDead');

    // Shooter
    this.components.shooter.setProjectile(RedLaser);
    this.components.shooter.initProjectileFn = (proj) => {
      proj.setTransformY(this.components.transform.position.y + Global.Random.rnd(0, 42) + 3);
      proj.bindPath(proj.components.locomotor.path.moveTo(proj.components.transform.position));
    };

    this.on('dead', () => {
      this.playSound('fx/entity/explosion_big');
      Explosion.EXPLOSION_BIG(this).spawn();
    });
    this.on('damaged', () => this.playSound('fx/entity/hull_hit'));
  }

  /**
   * @inheritdoc
   */
  getHitbox() {
    return [
      new RectangleHitbox({
        x: this.components.transform.position.x,
        y: this.components.transform.position.y,
        width: this.components.sprite.width - 9,
        height: this.components.sprite.height,
      }),
      new RectangleHitbox({
        x: this.components.transform.position.x + this.components.sprite.width - 9,
        y: this.components.transform.position.y + 17,
        width: 9,
        height: 16,
      }, { weak: true }),
    ];
  }
}
