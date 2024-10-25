import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import { LookerMixin } from '@renderer/core/@typescript/components/Looker/mixin';
import { ShooterMixin } from '@renderer/core/@typescript/components/Shooter/mixin';
import { AttachedEntitiesMixin } from '@renderer/core/@typescript/components/AttachedEntities/mixin';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import PlasmaBall from '@renderer/core/@typescript/prefabs/projectiles/PlasmaBall';
import type Enemy from '@renderer/core/@typescript/prefabs/enemies/Enemy';
import Point from '@renderer/core/@typescript/geometry/Point';

export default class CompilerBossTurret extends mix(PhysicEntityScript)
  .with(ShooterMixin)
  .with(LookerMixin)
  .with(AttachedEntitiesMixin) {
  constructor(parent: Enemy, slot: string, deltaPos: Point) {
    super();

    this.addTag('boss', 'alwaysVisible', 'staySpawned');

    // Locomotor
    this.components.locomotor.canMove = true;

    // Transform
    this.setTransform(parent.components.transform.position.x + deltaPos.x, parent.components.transform.position.y + deltaPos.y);

    // Sprite
    this.components.sprite.init({
      id: `${parent.getId()}_turret${slot}`,
      asset: Global.Assets.get('entities/enemies/bosses/compiler_turret'),
      animation: 'idle',
      origin: new Point(19, 8),
    });

    // Shooter
    this.components.shooter.shootFn = this.shootFn.bind(this);
    this.components.shooter.shootProbalility = 0.05;
    this.components.shooter.requireTarget = true;
    this.components.shooter.target = this.getNearestPlayer();
    this.components.shooter.retargetFn = this.retargetFn.bind(this);

    // Looker
    this.components.looker.minAngle = 45;
    this.components.looker.maxAngle = 315;
    this.components.looker.sweepCheck = true;
    this.setLookAt(this.components.shooter.target);
  }

  shootFn(target: PhysicEntityScript) {
    if (this.isLookingAt(target)) {
      const projectile = new PlasmaBall(this, target);
      projectile.spawn();
      this.emit('shoot', { projectile });
    }
  }

  retargetFn(): PlayerShip {
    const target = this.getNearestPlayer();
    this.setLookAt(target);
    return target;
  }
}
