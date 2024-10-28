import Global from '@renderer/core/stores/AppStore';

import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import RocketTrailFx from '@renderer/core/@typescript/prefabs/fx/RocketTrailFx';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class Rocket extends Projectile {
  declare shooter: PlayerShip;

  constructor(
    shooter: PlayerShip,
    public slot: 'top' | 'bottom',
  ) {
    super(shooter);
    this.addTag('player');
    this.damages = 2;
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
    this.attachEntity(new RocketTrailFx(this));

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.addCollisionTag('enemy', '!projectile');

    this.on('move', this.findTarget.bind(this));
    this.on('dead', () => {
      Explosion.EXPLOSION_ROCKET(this).spawn();
      this.shooter.incrementStat('hit', this);
      this.despawn();
    });
    this.on('spawn', () => {
      this.shooter.incrementStat('shot', this);
    });
  }

  findTarget() {
    if (!this.target) {
      [this.target] = Object
        .values(Global.Game.entities as Record<string, PhysicEntityScript>)
        .filter((ent) => ent.hasTag('enemy', '!projectile', '!isDead') && ((this.slot === 'top' && ent.components.transform.position.y + ent.components.sprite.height <= this.components.transform.position.y) || (this.slot === 'bottom' && ent.components.transform.position.y >= this.components.transform.position.y + this.components.sprite.height)))
      ;
      this.components.locomotor.track(this.target);
    }
  }
}
