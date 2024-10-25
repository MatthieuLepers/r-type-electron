import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export interface IHealth {
  getAttacked(attacker: EntityScript): void;

  getTotalHealth(): number;
}
