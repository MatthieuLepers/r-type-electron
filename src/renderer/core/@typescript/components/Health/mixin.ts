import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import Health from '@renderer/core/@typescript/components/Health';
import type { IHealth } from '@renderer/core/@typescript/components/Health/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const HealthMixin = <T extends AnyConstructor<Class>>(base : T) => class MyHealthMixin extends base implements IHealth {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Health, MyHealthMixin);
  }

  getAttacked(attacker: EntityScript) {
    this.components.health.getAttacked(attacker);
  }

  getTotalHealth() {
    return this.components.health.getTotalHealth();
  }
};
