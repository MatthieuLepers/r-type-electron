import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import Component from '@renderer/core/@typescript/components/Component';
import Cooldown from '@renderer/core/@typescript/components/Cooldown';
import { CooldownMixin } from '@renderer/core/@typescript/components/Cooldown/mixin';
import type { IShooter } from '@renderer/core/@typescript/components/Shooter/i';
import EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';

export interface ISpreadConfig {
  minAngle: number;
  maxAngle: number;
  stepAngle: number;
  currentAngle: number;
}

export default class Shooter extends CooldownMixin(Component<EntityScript & IShooter>) {
  public projectile: AnyConstructor<Projectile> | null = null;

  public initProjectileFn: Function | null = null;

  public shootProbability: number = 0.02;

  public automatic: boolean = true;

  public shootFn: Function | null = null;

  public shooter: EntityScript | null = null;

  public requireTarget: boolean = false;

  public useSpread: boolean = false;

  public spread: ISpreadConfig = {
    minAngle: 0,
    maxAngle: 0,
    stepAngle: 0,
    currentAngle: 0,
  };

  public retargetFn: (() => EntityScript | null) | null = null;

  #target: EntityScript | null = null;

  constructor(inst: EntityScript & IShooter, clazz: Function) {
    super(inst, clazz);

    this.addComponent(Cooldown<EntityScript>, Shooter);
    this.components.cooldown.time = 300;
  }

  setProjectile(projectile: AnyConstructor<Projectile>) {
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

  get target(): EntityScript | null {
    if ((!this.#target || (this.#target && this.#target.hasTag('isDead'))) && typeof this.retargetFn === 'function') {
      this.#target = this.retargetFn();
    }
    return this.#target ?? null;
  }

  set target(target: EntityScript) {
    this.#target = target;
  }

  toDebugObject() {
    return {
      projectile: this.projectile?.name ?? null,
      shootProbability: this.shootProbability,
      automatic: this.automatic,
      shooter: this.shooter?.components?.sprite?.id ?? null,
      requireTarget: this.requireTarget,
      useSpread: this.useSpread,
      spread: this.spread,
      target: this.target?.components?.sprite?.id ?? null,
    };
  }

  task() {
    if (this.automatic && Math.random() <= this.shootProbability && ((this.requireTarget && this.target && !this.target.hasTag('isDead')) || !this.requireTarget) && (!this.inst.hasComponent('ChargedShooter') || (this.inst.hasComponent('ChargedShooter') && !this.inst.components.chargedshooter.isCharging))) {
      this.inst.shoot();
    }
  }
}
