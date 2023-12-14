import type Looker from '@/renderer/core/classes/components/typescript/Looker';
import type Sprite from '@renderer/core/classes/components/Sprite';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export interface ILooker {
  components: {
    looker: Looker,
    sprite: Sprite,
  };

  setLookAt(target: TEntityScript): void;

  isLookingAt(entity: TEntityScript): boolean;
}
