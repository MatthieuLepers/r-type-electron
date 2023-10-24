import Global from '@renderer/core/stores/AppStore';
import Enemy from '@renderer/core/classes/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import Shooter from '@renderer/core/classes/components/Shooter';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';
import PlasmaBall from '@renderer/core/classes/prefabs/projectiles/PlasmaBall';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class PataPata extends Enemy {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.damages = 1;

    this.addComponent(Shooter, PataPata);

    // Locomotor
    this.components.locomotor.speedX = 100;
    this.bindPath(ComplexePath.fromSvgString('M 800 300 C 700 450 700 150 600 300').moveTo(new Point(Global.Game.canvas.width, Global.Random.rnd(0, Global.Game.canvas.height - 32))));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `patapata${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/patapata'),
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
    this.components.shooter.setProjectile(PlasmaBall);
    this.components.shooter.requireTarget = true;
    this.components.shooter.target = this.getNearestPlayer();

    this.on('dead', () => {
      this.playSound('entity/explosion');
      Explosion.EXPLOSION_NORMAL(this).spawn();
    });
  }
}
