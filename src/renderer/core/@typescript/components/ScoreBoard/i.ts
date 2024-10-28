import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export interface IScoreBoard {
  incrementScore(entity: EntityScript): void;

  incrementStat(statName: string, entity: EntityScript): void;
}
