import { Constructor } from '@renderer/core/@types';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import type Looker from '@/renderer/core/classes/components/typescript/Looker';
import type { ILooker } from '@/renderer/core/classes/components/typescript/Looker/i';
import type Sprite from '@renderer/core/classes/components/Sprite';
import type Transform from '@renderer/core/classes/components/Transform';
import type { ITransform } from '@/renderer/core/classes/components/typescript/Transform/i';

export const LookerMixin = (superclass: Constructor<EntityScript & ITransform>) => class extends superclass implements ILooker {
  declare components: {
    looker: Looker,
    sprite: Sprite,
    transform: Transform,
  };

  setLookAt(target: TEntityScript) {
    this.components.looker.target = target;
  }

  isLookingAt(entity: TEntityScript): boolean {
    const angle = Math.abs(Math.floor(this.getAngleTo(entity)));
    const rotation = Math.abs(Math.floor(this.components.sprite.options.rotation));
    return rotation === angle || rotation === 360 - angle;
  }
};
