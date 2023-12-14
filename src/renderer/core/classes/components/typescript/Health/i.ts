import type Health from '@/renderer/core/classes/components/typescript/Health';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export interface IHealth {
  components: {
    health: Health,
  };

  damages?: number;

  getAttacked(attacker: TEntityScript): void;

  getTotalHealth(): number;
}
