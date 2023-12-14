import Global from '@renderer/core/stores/AppStore';
import type { Constructor } from '@renderer/core/@types';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type ScoreBoard from '@/renderer/core/classes/components/typescript/ScoreBoard';
import type { IScoreBoard } from '@/renderer/core/classes/components/typescript/ScoreBoard/i';
import type Sprite from '@renderer/core/classes/components/Sprite';
import type { ISprite } from '@/renderer/core/classes/components/typescript/Sprite/i';
import type Transform from '@renderer/core/classes/components/Transform';
import type EventEmitter from '@renderer/core/classes/components/EventEmitter';

export const ScoreBoardMixin = (superclass: Constructor<EntityScript & ISprite>) => class extends superclass implements IScoreBoard {
  declare components: {
    scoreboard: ScoreBoard,
    eventemitter: EventEmitter,
    sprite: Sprite,
    transform: Transform,
  };

  public score: number = 0;

  addScore(entity: TEntityScript) {
    Global.Game.scoreboard.boards[this.getId()].score += entity.score;
    Global.Game.scoreboard.boards[this.getId()].stats.killed[entity.constructor.name] += 1;
  }
};
