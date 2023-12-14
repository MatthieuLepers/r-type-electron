import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type Cooldown from '@/renderer/core/classes/components/typescript/Cooldown';
import type { ICooldown } from '@/renderer/core/classes/components/typescript/Cooldown/i';

export const CooldownMixin = (superclass: Constructor<Class>) => class extends superclass implements ICooldown {
  declare components: {
    cooldown: Cooldown,
  };

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
