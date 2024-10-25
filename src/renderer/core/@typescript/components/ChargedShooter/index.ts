import Global from '@renderer/core/stores/AppStore';
import { AnyConstructor } from '@/renderer/core/@types/Mixin';

import Component from '@renderer/core/@typescript/components/Component';
import type { IChargedShooter } from '@renderer/core/@typescript/components/ChargedShooter/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';

export default class ChargedShooter extends Component<EntityScript & IChargedShooter> {
  public projectile: AnyConstructor<Projectile> | null = null;

  public initProjectileFn: Function | null = null;

  public shootProbability: number = 0.02;

  public automatic: boolean = true;

  public requireTarget: boolean = false;

  public retargetFn: (() => EntityScript | null) | null = null;

  public chargeTime: number = 1500;

  public isCharging: boolean = false;

  public startTime: number = 0;

  #target: EntityScript | null = null;

  get target(): EntityScript | null {
    if ((!this.#target || (this.#target?.hasTag('isDead'))) && typeof this.retargetFn === 'function') {
      this.#target = this.retargetFn();
    }
    return this.#target ?? null;
  }

  set target(target: EntityScript) {
    this.#target = target;
  }

  setProjectile(projectile: AnyConstructor<Projectile>) {
    this.projectile = projectile;
  }

  setChargeTime(chargeTime: number) {
    this.chargeTime = chargeTime;
  }

  toDebugObject() {
    return {
      projectile: this.projectile?.name ?? null,
      shootProbability: this.shootProbability,
      automatic: this.automatic,
      requireTarget: this.requireTarget,
      chargeTime: this.chargeTime,
      target: this.target?.components?.sprite?.id ?? null,
    };
  }

  task() {
    if (!this.inst.hasTag('isDead') && this.isCharging && this.inst.hasComponent('EventEmitter') && !Global.Engine.paused) {
      const percent = Math.min(100, ((Date.now() - this.startTime) * 100) / this.chargeTime);
      this.inst.emit('chargeProgress', { percent });
    }
    if (this.automatic && Math.random() <= this.shootProbability && ((this.requireTarget && this.target && !this.target.hasTag('isDead')) || !this.requireTarget)) {
      this.inst.shootCharged();
    }
  }
}
