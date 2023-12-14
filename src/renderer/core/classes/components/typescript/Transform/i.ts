import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import type PlayerShip from '@renderer/core/classes/prefabs/PlayerShip';
import type Transform from '@/renderer/core/classes/components/typescript/Transform';

export interface ITransform {
  components: {
    transform: Transform,
  };

  getDistanceTo(entity: TEntityScript): number;

  getHorizontaleDistanceTo(entity: TEntityScript): number;

  getVerticaleDistanceTo(entity: TEntityScript): number;

  getAngleTo(entity: TEntityScript): number;

  getNearestPlayer(): PlayerShip | null;

  setTransform(x: number, y: number): void;

  setTransformX(x: number): void;

  setTransformY(y: number): void;
}
