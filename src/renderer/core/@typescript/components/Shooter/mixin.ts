import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import Shooter from '@renderer/core/@typescript/components/Shooter';
import type { IShooter } from '@renderer/core/@typescript/components/Shooter/i';
import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const ShooterMixin = <T extends AnyConstructor<EntityScript & ISprite>>(base : T) => class MyShooterMixin extends base implements IShooter {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Shooter, MyShooterMixin);
  }

  shoot() {
    const spriteCond = (this.hasComponent('Sprite') && this.isVisible()) || !this.hasComponent('Sprite');
    const chargedshooterCond = (this.hasComponent('ChargedShooter') && !this.components.chargedshooter.isCharging) || !this.hasComponent('ChargedShooter');

    if (!this.components.shooter.cooldownActive() && !this.hasTag('isDead') && chargedshooterCond && spriteCond) {
      if (typeof this.components.shooter.shootFn === 'function') {
        this.components.shooter.shootFn(this.components.shooter.target ?? null);
        this.components.shooter.startCooldown();
        return;
      }

      const projectile = new this.components.shooter.projectile(this.components.shooter.shooter ?? this, this.components.shooter.target ?? null);
      if (this.components.shooter.useSpread) {
        projectile.components.sprite.options.rotation = this.components.shooter.spread.currentAngle;
        projectile.components.locomotor.path.rotate(this.components.shooter.spread.currentAngle, projectile.components.locomotor.path.startPoint);
        this.components.shooter.updateSpread();
      }
      if (typeof this.components.shooter.initProjectileFn === 'function') {
        this.components.shooter.initProjectileFn(projectile, this.components.shooter.target ?? null);
      }
      if (this.hasComponent('EventEmitter')) {
        this.emit('shoot', { projectile });
      }
      projectile.spawn();

      this.components.shooter.startCooldown();
    }
  }
};
