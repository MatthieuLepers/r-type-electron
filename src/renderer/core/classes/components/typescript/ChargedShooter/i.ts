import type ChargedShooter from '@/renderer/core/classes/components/typescript/ChargedShooter';

export interface IChargedShooter {
  components: {
    chargedshooter: ChargedShooter,
  };

  chargeStart(): void;

  chargeStop(): void;

  shootCharged(percent?: number): void;
}
