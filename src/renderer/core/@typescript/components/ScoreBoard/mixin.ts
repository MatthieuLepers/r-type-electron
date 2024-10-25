import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import ScoreBoard from '@renderer/core/@typescript/components/ScoreBoard';
import type { IScoreBoard } from '@renderer/core/@typescript/components/ScoreBoard/i';
import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const ScoreBoardMixin = <T extends AnyConstructor<EntityScript & ISprite>>(base : T) => class MyScoreBoardMixin extends base implements IScoreBoard {
  public score: number = 0;

  constructor(...args: any[]) {
    super(...args);

    this.addComponent(ScoreBoard, MyScoreBoardMixin);
  }

  addScore(entity: EntityScript & IScoreBoard) {
    Global.Game.scoreboard.boards[this.getId()].score += entity.score;
    Global.Game.scoreboard.boards[this.getId()].stats.killed[entity.constructor.name] += 1;
  }
};
