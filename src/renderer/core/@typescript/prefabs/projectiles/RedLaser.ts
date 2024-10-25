import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class RedLaser extends Projectile {
  constructor(shooter: PhysicEntityScript & IAttachedEntities) {
    super(shooter);
    this.addTag('enemy', 'piercing');
    this.damages = 2;

    // Locomotor
    this.components.locomotor.speedX = 600;
    this.bindPath(ComplexePath.fromSvgString('M 700 300 L 550 300').moveTo(new Point(this.shooter.components.transform.position.x, this.shooter.components.sprite.centerOrigin.y - 2)));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_redlaser${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/red_laser'),
      animation: 'loop',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(2);

    // Physics
    this.addCollisionTag('player', '!module', '!projectile');

    this.on('dead', () => this.despawn());
  }
}
