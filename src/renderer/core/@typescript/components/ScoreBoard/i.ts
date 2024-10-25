import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export interface IScoreBoard {
  score: number;

  addScore(entity: EntityScript & IScoreBoard): void
}
