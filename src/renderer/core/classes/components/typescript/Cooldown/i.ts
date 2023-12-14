import type Cooldown from '@/renderer/core/classes/components/typescript/Cooldown';

export interface ICooldown {
  components: {
    cooldown: Cooldown,
  };

  cooldownActive(): boolean;

  startCooldown(): void;

  resetCooldown(): void;

  setCooldown(time: number): void;
}
