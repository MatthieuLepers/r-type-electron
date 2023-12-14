import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type Health from '@/renderer/core/classes/components/typescript/Health';
import type { IHealth } from '@/renderer/core/classes/components/typescript/Health/i';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export const HealthMixin = (superclass: Constructor<Class>) => class extends superclass implements IHealth {
  declare components: {
    health: Health,
  };

  getAttacked(attacker: TEntityScript) {
    this.components.health.getAttacked(attacker);
  }

  getTotalHealth() {
    return this.components.health.getTotalHealth();
  }
};
