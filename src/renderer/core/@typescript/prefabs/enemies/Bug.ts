import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import { ShooterMixin } from '@renderer/core/@typescript/components/Shooter/mixin';
import Enemy from '@renderer/core/@typescript/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import PlasmaBall from '@renderer/core/@typescript/prefabs/projectiles/PlasmaBall';

export default class Bug extends mix(Enemy).with(ShooterMixin) {
  constructor() {
    super();
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 150;
    this.components.locomotor.canMove = true;
    this.components.locomotor.followSlope = true;

    // Sprite
    this.components.sprite.init({
      id: `bug${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/bug'),
      animation: 'idle',
    });

    // Health
    this.components.health.setMaxHealth(1);
    this.components.health.healthBarVisible = true;

    // Physics
    this.addCollisionTag('player', '!isDead');

    // Shooter
    this.components.shooter.setProjectile(PlasmaBall);
    this.components.shooter.shootProbalility = 0.002;
    this.components.shooter.requireTarget = true;
    this.components.shooter.target = this.getNearestPlayer();
    this.components.shooter.retargetFn = () => this.getNearestPlayer();

    this.on('dead', () => {
      this.playSound('fx/entity/explosion');
      Explosion.EXPLOSION_NORMAL(this).spawn();
    });
  }
}
