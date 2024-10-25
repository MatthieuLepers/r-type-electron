import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class ModuleBullet extends Projectile {
  constructor(
    shooter: PhysicEntityScript & IAttachedEntities,
    target = null,
    public angle: number = 0,
  ) {
    super(shooter, target);
    this.addTag('player');
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 650;
    this.bindPath(ComplexePath.fromSvgString('M 0 0 L 200 0').rotate(this.angle, new Point(0, 0)).moveTo(new Point(
      this.shooter.components.sprite.centerOrigin.x - 8,
      this.shooter.components.sprite.centerOrigin.y - 1,
    )));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_bullet_${this.angle}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/module_shot_0'),
      animation: 'idle',
      rotation: this.angle,
    });

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => this.despawn());
  }
}
