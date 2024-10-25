import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';

export interface IScoreboardData {
  score: number;
  stats: {
    killed: Record<string, any>;
  };
}

export default class ScoreBoard {
  public boards: Record<string, IScoreboardData> = {};

  registerEntity(entity: PhysicEntityScript) {
    if (!this.boards[entity.getId()]) {
      this.boards[entity.getId()] = {
        score: 0,
        stats: {
          killed: {},
        },
      };
    }
  }
}
