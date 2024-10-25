import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import { ShooterMixin } from '@renderer/core/@typescript/components/Shooter/mixin';
import Enemy from '@renderer/core/@typescript/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import RedLaser from '@renderer/core/@typescript/prefabs/projectiles/RedLaser';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class Mid extends mix(Enemy).with(ShooterMixin) {
  constructor() {
    super();
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 110;
    this.bindPath(ComplexePath.fromSvgString('M 700 300 L 550 300').moveTo(new Point(Global.Game.canvas.width, Global.Random.rnd(0, Global.Game.canvas.height - 32))));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `mid${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/mid'),
      animation: 'loop',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(1);
    this.components.health.healthBarVisible = true;

    // Physics
    this.addCollisionTag('player', '!isDead');

    // Shooter
    this.components.shooter.setProjectile(RedLaser);

    this.on('dead', () => {
      this.playSound('fx/entity/explosion');
      Explosion.EXPLOSION_NORMAL(this).spawn();
    });
  }
}
