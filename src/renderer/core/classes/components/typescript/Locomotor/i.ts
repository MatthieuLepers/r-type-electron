import type Locomotor from '@/renderer/core/classes/components/typescript/Locomotor';
import type Transform from '@renderer/core/classes/components/Transform';
import type Sprite from '@renderer/core/classes/components/Sprite';
import type ComplexePath from '@renderer/core/classes/paths/ComplexePath';

export interface ILocomotor {
  components: {
    locomotor: Locomotor,
    transform: Transform,
    sprite: Sprite,
  };

  move(): void;

  bindPath(path: ComplexePath, loop: boolean): void;

  unBindPath(): void;
}
