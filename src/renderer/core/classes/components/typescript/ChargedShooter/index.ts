import Global from '@renderer/core/stores/AppStore';
import Component from '@renderer/core/classes/components/Component';
import type { Constructor } from '@/renderer/core/@types';
import type Projectile from '@/renderer/core/classes/prefabs/projectiles/Projectile';
import type { TEntityScript } from '@/renderer/core/classes/prefabs/TEntityScript';

export default class ChargedShooter extends Component {
  declare inst: TEntityScript;

  public projectile: Constructor<Projectile> | null = null;

  public initProjectileFn: Function | null = null;

  public shootProbability: number = 0.02;

  public automatic: boolean = true;

  public requireTarget: boolean = false;

  public retargetFn: (() => TEntityScript | null) | null = null;

  public chargeTime: number = 1500;

  public isCharging: boolean = false;

  public startTime: number = 0;

  #target: TEntityScript | null = null;

  get target(): TEntityScript | null {
    if ((!this.#target || (this.#target?.hasTag('isDead'))) && typeof this.retargetFn === 'function') {
      this.#target = this.retargetFn();
    }
    return this.#target ?? null;
  }

  set target(target: TEntityScript) {
    this.#target = target;
  }

  setProjectile(projectile: Constructor<Projectile>) {
    this.projectile = projectile;
  }

  setChargeTime(chargeTime: number) {
    this.chargeTime = chargeTime;
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
