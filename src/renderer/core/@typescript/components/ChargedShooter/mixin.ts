import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import ChargedShooter from '@renderer/core/@typescript/components/ChargedShooter';
import type { IChargedShooter } from '@renderer/core/@typescript/components/ChargedShooter/i';
import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const ChargedShooterMixin = <T extends AnyConstructor<EntityScript & ISprite>>(base : T) => class MyChargedShooterMixin extends base implements IChargedShooter {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(ChargedShooter, MyChargedShooterMixin);
  }

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
