import Global from '@renderer/core/stores/AppStore';
import type { Constructor } from '@/renderer/core/@types';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type ChargedShooter from '@/renderer/core/classes/components/typescript/ChargedShooter';
import type { IChargedShooter } from '@/renderer/core/classes/components/typescript/ChargedShooter/i';

export const ChargedShooterMixin = (superclass: Constructor<EntityScript>) => class extends superclass implements IChargedShooter {
  declare components: {
    chargedshooter: ChargedShooter,
  };

  chargeStart() {
    if (!this.hasTag('isDead') && !Global.Engine.paused && !this.components.chargedshooter.isCharging) {
      if (this.hasComponent('EventEmitter')) {
        this.emit('chargeStart');
      }
      this.components.chargedshooter.isCharging = true;
      this.components.chargedshooter.startTime = Date.now();
    }
  }

  chargeStop() {
    if (!this.hasTag('isDead') && !Global.Engine.paused && this.components.chargedshooter.isCharging) {
      const percent = Math.min(100, ((Date.now() - this.components.chargedshooter.startTime) * 100) / this.components.chargedshooter.chargeTime);

      if (this.hasComponent('EventEmitter')) {
        this.emit('chargeStop', { percent });
      }
      this.components.chargedshooter.isCharging = false;
      this.components.chargedshooter.startTime = 0;
      this.shootCharged(percent);
    }
  }

  shootCharged(percent?: number) {
    const p = percent ?? 100;
    if (!this.hasTag('isDead') && !Global.Engine.paused && this.isVisible() && p >= 15) {
      if (this.components.chargedshooter.projectile) {
        const projectile = new this.components.chargedshooter.projectile(this, this.components.chargedshooter.target ?? null, p);
        if (typeof this.components.chargedshooter.initProjectileFn === 'function') {
          this.components.chargedshooter.initProjectileFn(projectile, this.components.chargedshooter.target ?? null);
        }
        if (this.hasComponent('EventEmitter')) {
          this.emit('shootCharged', { projectile });
        }
        projectile.spawn();
      }
    }
  }
};
