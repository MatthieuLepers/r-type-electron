import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import Cooldown from '@renderer/core/@typescript/components/Cooldown';
import type { ICooldown } from '@renderer/core/@typescript/components/Cooldown/i';

export const CooldownMixin = <T extends AnyConstructor<Class>>(base : T) => class MyCooldownMixin extends base implements ICooldown {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Cooldown<T>, MyCooldownMixin);
  }

  cooldownActive(): boolean {
    return this.components.cooldown.time > 0 && this.components.cooldown.active;
  }

  startCooldown() {
    this.components.cooldown.start();
  }

  resetCooldown() {
    this.components.cooldown.reset();
  }

  setCooldown(time: number) {
    this.components.cooldown.time = time;
  }
};
