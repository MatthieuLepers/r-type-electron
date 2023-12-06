import Global from '@renderer/core/stores/AppStore';
import CompilerBossTurret from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossTurret';
import CompilerBossCannon from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossCannon';
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
export default class CompilerTopPart extends Enemy {
  /**
   * @constructor
   * @param {CompilerBoss} owner
   */
  constructor(owner) {
    super();
    this.owner = owner;

    this.addTag('boss', 'alwaysVisible', 'staySpawned');
    this.addComponent(Shooter, CompilerTopPart);

    // Locomotor
    this.components.locomotor.speedX = this.owner.components.locomotor.speed.x;
    this.components.locomotor.canMove = this.owner.components.locomotor.canMove;

    // Transform
    this.setTransform(this.owner.components.transform.position.x, this.owner.components.transform.position.y - 32);

    // AttachedEntities
    this.attachEntity(CompilerBossTurret.new(this, 'top', new Point(-3, 24)), 'compilerboss_turrettop');
    this.attachEntity(CompilerBossCannon.new(this, 'left', new Point(48, 8)), 'compilerboss_cannonleft');
    this.attachEntity(CompilerBossCannon.new(this, 'right', new Point(80, 8)), 'compilerboss_cannonright');

    // Sprite
    this.components.sprite.init({
      id: `compilerbosstop${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/bosses/compiler_top_part'),
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
        width: this.components.sprite.width,
        height: 53,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x,
        y: this.components.transform.position.y + 53,
        width: 36,
        height: 11,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x + 84,
        y: this.components.transform.position.y + 53,
        width: 14,
        height: 7,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x + 40,
        y: this.components.transform.position.y + 53,
        width: 32,
        height: 11,
      }),
    ];
  }

  /**
   * @param {EntityScript} target
   */
  shootFn(target) {
    const playerIsOnX = target.components.transform.position.x - this.components.transform.position.x >= 0;
    const playerIsOnY = target.components.transform.position.y + target.components.sprite.height >= this.components.transform.position.y && target.components.transform.position.y <= this.components.transform.position.y + this.components.sprite.height;
    if (playerIsOnX && playerIsOnY) {
      const projectile = RedLaser.new(this, target);
      projectile.bindPath(ComplexePath.fromSvgString('M 0 0 L 100 0').moveTo(new Point(this.components.transform.position.x + this.components.sprite.width - 48, this.components.transform.position.y + 18 + Global.Random.rnd(40))));
      projectile.spawn();
      this.emit('shoot', { projectile });
    }
  }
}
