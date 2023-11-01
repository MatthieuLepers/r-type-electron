import Global from '@renderer/core/stores/AppStore';
import Enemy from '@renderer/core/classes/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import Shooter from '@renderer/core/classes/components/Shooter';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import PlasmaBall from '@renderer/core/classes/prefabs/projectiles/PlasmaBall';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Bug extends Enemy {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.damages = 1;

    this.addComponent(Shooter, Bug);

    // Locomotor
    this.components.locomotor.speedX = 150;
    this.components.locomotor.canMove = true;
    this.components.locomotor.followSlope = true;

    // Sprite
    this.components.sprite.init({
      id: `bug${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/bug'),
      animation: 'idle',
    });

    // Health
    this.components.health.setMaxHealth(1);
    this.components.health.healthBarVisible = true;

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('player', '!isDead');

    // Shooter
    this.components.shooter.setProjectile(PlasmaBall);
    this.components.shooter.shootProbalility = 0.002;
    this.components.shooter.requireTarget = true;
    this.components.shooter.target = this.getNearestPlayer();
    this.components.shooter.retargetFn = () => this.getNearestPlayer();

    this.on('dead', () => {
      this.playSound('fx/entity/explosion');
      Explosion.EXPLOSION_NORMAL(this).spawn();
    });
  }
}
