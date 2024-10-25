import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export interface ILooker {
  setLookAt(target: EntityScript): void;

  isLookingAt(entity: EntityScript): boolean;
}
