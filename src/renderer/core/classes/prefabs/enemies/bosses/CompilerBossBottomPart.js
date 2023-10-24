import Global from '@renderer/core/stores/AppStore';
import Enemy from '@renderer/core/classes/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import CompilerBossTurret from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossTurret';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class CompilerBottomPart extends Enemy {
  /**
   * @constructor
   * @param {CompilerBoss} owner
   */
  constructor(owner) {
    super();
    this.owner = owner;

    this.addTag('boss', 'alwaysVisible', 'staySpawned');

    // Locomotor
    this.components.locomotor.speedX = this.owner.components.locomotor.speedX;
    this.components.locomotor.canMove = this.owner.components.locomotor.canMove;

    // Transform
    this.setTransform(this.owner.components.transform.position.x + 30, this.owner.components.transform.position.y + 6);

    // AttachedEntities
    this.attachEntity(CompilerBossTurret.new(this, 'top', new Point(5, 47.5)), 'compilerboss_turrettop');
    this.attachEntity(CompilerBossTurret.new(this, 'bottom', new Point(13, 71.5)), 'compilerboss_turretbottom');

    // Sprite
    this.components.sprite.init({
      id: `compilerbossbottom${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/bosses/compiler_bottom_part'),
      animation: 'loop',
      loop: true,
      animationDelay: 6,
    });

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
        x: this.components.transform.position.x,
        y: this.components.transform.position.y,
        width: 48,
        height: 32,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x,
        y: this.components.transform.position.y + 32,
        width: this.getSprite().width,
        height: this.getSprite().height - 32,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x + 54,
        y: this.components.transform.position.y + 16,
        width: 36,
        height: 16,
      }),
    ];
  }
}
