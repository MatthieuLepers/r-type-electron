import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import Looker from '@renderer/core/@typescript/components/Looker';
import type { ILooker } from '@renderer/core/@typescript/components/Looker/i';
import type { ITransform } from '@renderer/core/@typescript/components/Transform/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const LookerMixin = <T extends AnyConstructor<EntityScript & ITransform>>(base : T) => class MyLookerMixin extends base implements ILooker {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Looker, MyLookerMixin);
  }

  setLookAt(target: EntityScript) {
    this.components.looker.target = target;
  }

  isLookingAt(entity: EntityScript): boolean {
    const angle = Math.abs(Math.floor(this.getAngleTo(entity)));
    const rotation = Math.abs(Math.floor(this.components.sprite.options.rotation));
    return rotation === angle || rotation === 360 - angle;
  }
};
