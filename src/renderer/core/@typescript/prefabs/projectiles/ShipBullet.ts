import Global from '@renderer/core/stores/AppStore';

import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class ShipBullet extends Projectile {
  constructor(shooter: PhysicEntityScript) {
    super(shooter);
    this.addTag('player');
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 650;
    this.bindPath(ComplexePath.fromSvgString('M 300 300 L 500 300').moveTo(new Point(
      this.shooter.components.transform.position.x + this.shooter.components.sprite.width - 16,
      this.shooter.components.sprite.centerOrigin.y - 2,
    )));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_bullet${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/bullet'),
      animation: 'idle',
    });

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => this.despawn());
  }
}
