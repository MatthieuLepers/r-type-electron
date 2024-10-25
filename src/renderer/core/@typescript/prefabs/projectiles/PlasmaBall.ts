import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class PlasmaBall extends Projectile {
  constructor(shooter: PhysicEntityScript & IAttachedEntities, target: PhysicEntityScript) {
    super(shooter, target);
    this.addTag('enemy', 'absorbable');
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 300;
    this.bindPath(ComplexePath.fromSvgString(`M ${this.shooter.components.transform.position.x + 7} ${this.shooter.components.transform.position.y + (this.shooter.components.sprite.height / 2) - 3} L ${this.target.components.sprite.centerOrigin.x} ${this.target.components.sprite.centerOrigin.y}`));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_plasmaball${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/plasma_ball'),
      animation: 'loop',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.addCollisionTag('player', '!projectile');

    this.on('dead', () => Explosion.EXPLOSION_TINY(this).spawn());
  }
}
