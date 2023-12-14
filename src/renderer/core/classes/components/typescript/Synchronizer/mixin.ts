import { Constructor } from '@renderer/core/@types';
import Class from '@renderer/core/classes/Class';
import Synchronizer from '@/renderer/core/classes/components/typescript/Synchronizer';
import { ISynchronizer } from '@/renderer/core/classes/components/typescript/Synchronizer/i';

export const SynchronizerMixin = (superclass: Constructor<Class>) => class extends superclass implements ISynchronizer {
  declare components: {
    synchronizer: Synchronizer,
  };
};
