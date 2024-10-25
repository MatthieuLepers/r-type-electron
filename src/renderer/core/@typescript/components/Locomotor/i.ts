import type ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export interface ILocomotor {
  move(): void;

  bindPath(path: ComplexePath, loop: boolean): void;

  unBindPath(): void;
}
