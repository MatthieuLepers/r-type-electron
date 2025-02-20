import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Module, { Side } from '@renderer/core/@typescript/prefabs/Module';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import { Direction } from '@renderer/core/@typescript/enums/Direction';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class FireBall extends Projectile {
  declare shooter: PhysicEntityScript & IAttachedEntities;

  constructor(
    shooter: PhysicEntityScript & IAttachedEntities,
    target: PhysicEntityScript,
    public direction: `${Direction}`,
  ) {
    super(shooter, target);
    this.addTag('player', 'fire');
    this.damages = 3;

    // Locomotor
    this.components.locomotor.speedX = 400;
    this.bindPath(this.getPath());
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_fireball_${this.direction}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/fireball'),
      animation: 'loop',
      rotation: (this.direction === Direction.UP ? 90 : -90),
      animationDelay: 6,
    });

    // Health
    this.components.health.setMaxHealth(5);

    // Physics
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => Explosion.EXPLOSION_FIREBALL(this).spawn());
  }

  getPath(): ComplexePath {
    const module = this.shooter.getAttachedEntity<Module>('module') || null;
    let { x } = this.shooter.components.transform.position;

    if (module) {
      x += (module.side === Side.BACK ? -16 : this.shooter.components.sprite.width + 2);
    }

    if (this.direction === Direction.UP) {
      return ComplexePath.fromSvgString('M 0 900 L 0 0').moveTo(new Point(x, this.shooter.components.sprite.centerOrigin.y - 8));
    }
    return ComplexePath.fromSvgString('M 0 0 L 0 900').moveTo(new Point(x, this.shooter.components.sprite.centerOrigin.y - 8));
  }
}
