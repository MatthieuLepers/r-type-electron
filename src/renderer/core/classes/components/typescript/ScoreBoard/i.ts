import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import type ScoreBoard from '@/renderer/core/classes/components/typescript/ScoreBoard';
import type Sprite from '@renderer/core/classes/components/Sprite';
import type Transform from '@renderer/core/classes/components/Transform';
import type EventEmitter from '@renderer/core/classes/components/EventEmitter';

export interface IScoreBoard {
  components: {
    scoreboard: ScoreBoard,
    eventemitter: EventEmitter,
    sprite: Sprite,
    transform: Transform,
  };

  score: number;

  addScore(entity: TEntityScript): void
}
