import { AnyConstructor } from '@/renderer/core/@types/Mixin';

import Class from '@renderer/core/@typescript/Class';
import Synchronizer from '@renderer/core/@typescript/components/Synchronizer';
import type { ISynchronizer } from '@renderer/core/@typescript/components/Synchronizer/i';

export const SynchronizerMixin = <T extends AnyConstructor<Class>>(base : T) => class MySynchronizerMixin extends base implements ISynchronizer {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Synchronizer, MySynchronizerMixin);
  }
};
