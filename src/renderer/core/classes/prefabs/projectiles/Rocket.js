import Global from '@renderer/core/stores/AppStore';
import Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';
import RocketTrailFx from '@renderer/core/classes/prefabs/fx/RocketTrailFx';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Rocket extends Projectile {
  /**
   * @constructor
   * @param {EntityScript} shooter
   * @param {String} slot top|bottom
   */
  constructor(shooter, slot) {
    super(shooter);
    this.addTag('player');
    this.damages = 2;
    this.slot = slot;
    this.target = null;

    // Locomotor
    this.components.locomotor.speedX = 650;
    this.bindPath(ComplexePath.fromSvgString('M 0 0 L 100 0').moveTo(new Point(
      shooter.components.transform.position.x + 8,
      shooter.components.transform.position.y + (slot === 'top' ? -10 : 19),
    )));
    this.components.locomotor.followSlope = true;
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_rocket${slot}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/rocket'),
      animation: 'loop',
    });

    // AttachedEntities
    this.attachEntity(RocketTrailFx.new(this));

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('enemy', '!projectile');

    this.on('move', this.findTarget.bind(this));
    this.on('dead', () => this.despawn());
  }

  findTarget() {
    if (!this.target) {
      [this.target] = Object
        .values(Global.Game.entities)
        .filter((ent) => ent.hasTag('enemy', '!projectile', '!isDead') && ((this.slot === 'top' && ent.components.transform.position.y + ent.getSprite().height <= this.components.transform.position.y) || (this.slot === 'bottom' && ent.components.transform.position.y >= this.components.transform.position.y + this.getSprite().height)))
      ;
      this.components.locomotor.track(this.target);
    }
  }
}
