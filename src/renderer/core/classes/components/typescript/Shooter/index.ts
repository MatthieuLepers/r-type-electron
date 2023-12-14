import Component from '@renderer/core/classes/components/Component';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import { mix } from '@renderer/core/mixins/Mixable';
import { CooldownMixin } from '@/renderer/core/classes/components/typescript/Cooldown/mixin';
import type { Constructor } from '@renderer/core/@types';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import type Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';

export interface ISpreadConfig {
  minAngle: number;
  maxAngle: number;
  stepAngle: number;
  currentAngle: number;
}

export default class Shooter extends mix(Component).with(CooldownMixin) {
  declare inst: TEntityScript;

  public projectile: Constructor<Projectile> | null = null;

  public initProjectileFn: Function | null = null;

  public shootProbalility: number = 0.02;

  public automatic: boolean = true;

  public shootFn: Function | null = null;

  public shooter: TEntityScript | null = null;

  public requireTarget: boolean = false;

  public useSpread: boolean = false;

  public spread: ISpreadConfig = {
    minAngle: 0,
    maxAngle: 0,
    stepAngle: 0,
    currentAngle: 0,
  };

  public retargetFn: (() => TEntityScript | null) | null = null;

  #target: TEntityScript | null = null;

  constructor(inst: TEntityScript, clazz: Function) {
    super(inst, clazz);

    this.addComponent(Cooldown, Shooter);
    this.components.cooldown.time = 300;
  }

  setProjectile(projectile: Constructor<Projectile>) {
    this.projectile = projectile;
  }

  configureSpread(minAngle: number, maxAngle: number, stepAngle: number, currentAngle: number) {
    this.useSpread = true;
    this.spread.minAngle = minAngle;
    this.spread.maxAngle = maxAngle;
    this.spread.stepAngle = stepAngle;
    this.spread.currentAngle = currentAngle;
  }

  updateSpread() {
    if (this.spread.stepAngle > 0) { // Direction max
      if (this.spread.currentAngle + this.spread.stepAngle < this.spread.maxAngle) {
        this.spread.currentAngle += this.spread.stepAngle;
      } else {
        this.spread.stepAngle = -this.spread.stepAngle;
      }
    } else if (this.spread.currentAngle + this.spread.stepAngle > this.spread.minAngle) {
      this.spread.currentAngle += this.spread.stepAngle;
    } else {
      this.spread.stepAngle = -this.spread.stepAngle;
    }
  }

  get target(): TEntityScript | null {
    if ((!this.#target || (this.#target && this.#target.hasTag('isDead'))) && typeof this.retargetFn === 'function') {
      this.#target = this.retargetFn();
    }
    return this.#target ?? null;
  }

  /**
   * @param {EntityScript}
   */
  set target(target: TEntityScript) {
    this.#target = target;
  }

  task() {
    if (this.automatic && Math.random() <= this.shootProbalility && ((this.requireTarget && this.target && !this.target.hasTag('isDead')) || !this.requireTarget) && (!this.inst.hasComponent('ChargedShooter') || (this.inst.hasComponent('ChargedShooter') && !this.inst.components.chargedshooter.isCharging))) {
      this.inst.shoot();
    }
  }
}
