import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';

export interface ITransform {
  getDistanceTo(entity: EntityScript): number;

  getHorizontaleDistanceTo(entity: EntityScript): number;

  getVerticaleDistanceTo(entity: EntityScript): number;

  getAngleTo(entity: EntityScript): number;

  getNearestPlayer(): PlayerShip | null;

  setTransform(x: number, y: number): void;

  setTransformX(x: number): void;

  setTransformY(y: number): void;
}
