import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@renderer/core/@types/Mixin';

import ScoreBoard from '@renderer/core/@typescript/components/ScoreBoard';
import type { IScoreBoard } from '@renderer/core/@typescript/components/ScoreBoard/i';
import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const ScoreBoardMixin = <T extends AnyConstructor<EntityScript & ISprite>>(base : T) => class MyScoreBoardMixin extends base implements IScoreBoard {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(ScoreBoard, MyScoreBoardMixin);
  }

  incrementScore(entity: EntityScript) {
    Global.Game.scoreboard.boards[this.getId()].score += entity?.score ?? 0;
    Global.Game.emit('scoreUpdate', {
      board: Global.Game.scoreboard.boards[this.getId()],
    });
  }

  incrementStat(statName: string, entity: EntityScript) {
    if (!Global.Game.scoreboard.boards[this.getId()].stats[statName][entity.getClass()]) {
      Global.Game.scoreboard.boards[this.getId()].stats[statName][entity.getClass()] = 0;
    }
    Global.Game.scoreboard.boards[this.getId()].stats[statName][entity.getClass()] += 1;
  }
};
