import Global from '../../../../stores/AppStore';
import Enemy from '../Enemy';
import Explosion from '../../Explosion';
import Shooter from '../../../components/Shooter';
import Point from '../../../geometry/Point';
import RectangleHitbox from '../../../hitboxes/RectangleHitbox';
import ComplexePath from '../../../paths/ComplexePath';
import RedLaser from '../../projectiles/RedLaser';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class CompilerBossRightPart extends Enemy {
  /**
   * @param {CompilerBoss} owner
   * @constructor
   */
  constructor(owner) {
    super();
    this.owner = owner;

    this.addTag('boss', 'alwaysVisible', 'staySpawned');
    this.addComponent(Shooter, CompilerBossRightPart);

    // Locomotor
    this.components.locomotor.speedX = this.owner.components.locomotor.speedX;
    this.components.locomotor.canMove = this.owner.components.locomotor.canMove;

    // Transform
    this.setTransform(this.owner.components.transform.position.x + 84, this.owner.components.transform.position.y - 39);

    // Sprite
    this.components.sprite.init({
      id: `compilerbossright${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/bosses/compiler_right_part'),
      animation: 'loop',
      loop: true,
      animationDelay: 6,
    });

    // Shooter
    this.components.shooter.components.cooldown.time = 100;
    this.components.shooter.shootFn = this.shootFn.bind(this);
    this.components.shooter.shootProbability = 0.1;
    this.components.shooter.requireTarget = true;
    this.components.shooter.target = this.getNearestPlayer();
    this.components.shooter.retargetFn = () => this.getNearestPlayer();

    // Health
    this.components.health.setMaxHealth(150);
    this.components.health.healthBarVisible = true;

    // Physics
    this.addCollisionTag('player', '!isDead');

    this.on('dead', () => {
      this.playSound('entity/explosion_big');
      Explosion.EXPLOSION_BIG(this).spawn();
    });
    this.on('damaged', () => this.playSound('entity/hull_hit'));
  }

  /**
   * @inheritdoc
   */
  getHitbox() {
    return [
      new RectangleHitbox({
        x: this.components.transform.position.x + 14,
        y: this.components.transform.position.y,
        width: 82,
        height: 80,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x,
        y: this.components.transform.position.y,
        width: 14,
        height: 22,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x,
        y: this.components.transform.position.y + 22,
        width: 14,
        height: 29,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x + 54,
        y: this.components.transform.position.y + 16,
        width: 14,
        height: 28,
      }),
    ];
  }

  /**
   * @param {EntityScript} target
   */
  shootFn(target) {
    const playerIsOnRight = target.components.transform.position.x - this.components.transform.position.x >= 0;
    if (playerIsOnRight) {
      const projectile = RedLaser.new(this, target);
      projectile.bindPath(ComplexePath.fromSvgString('M 0 0 L 100 0').moveTo(new Point(this.components.transform.position.x + this.getSprite().width - 48, this.components.transform.position.y + 18 + Global.Random.rnd(40))));
      projectile.spawn();
      this.emit('shoot', { projectile });
    }
  }
}
