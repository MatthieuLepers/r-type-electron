import type { Constructor } from '@renderer/core/@types';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type ChargedShooter from '@renderer/core/classes/components/ChargedShooter';
import type EventEmitter from '@renderer/core/classes/components/EventEmitter';
import type Sprite from '@renderer/core/classes/components/Sprite';
import type { ISprite } from '@/renderer/core/classes/components/typescript/Sprite/i';
import type Shooter from '@/renderer/core/classes/components/typescript/Shooter';
import type { IShooter } from '@/renderer/core/classes/components/typescript/Shooter/i';
import type Transform from '@renderer/core/classes/components/Transform';

export const ShootMixin = (superclass: Constructor<EntityScript & ISprite>) => class extends superclass implements IShooter {
  declare components: {
    shooter: Shooter,
    chargedshooter: ChargedShooter,
    eventemitter: EventEmitter,
    sprite: Sprite,
    transform: Transform,
  };

  shoot() {
    const spriteCond = (this.hasComponent('Sprite') && this.isVisible()) || !this.hasComponent('Sprite');
    const chargedshooterCond = (this.hasComponent('ChargedShooter') && !this.components.chargedshooter.isCharging) || !this.hasComponent('ChargedShooter');

    if (!this.components.shooter.cooldownActive() && !this.hasTag('isDead') && chargedshooterCond && spriteCond) {
      if (typeof this.components.shooter.shootFn === 'function') {
        this.components.shooter.shootFn(this.components.shooter.target ?? null);
        this.components.shooter.startCooldown();
        return;
      }

      // @ts-ignore
      const projectile = this.components.shooter.projectile.new(this.components.shooter.shooter ?? this, this.components.shooter.target ?? null);
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
