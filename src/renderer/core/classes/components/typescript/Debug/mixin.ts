import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type Debug from '@/renderer/core/classes/components/typescript/Debug';
import type { IDebug } from '@/renderer/core/classes/components/typescript/Debug/i';

export const DebugMixin = (superclass: Constructor<Class>) => class extends superclass implements IDebug {
  declare components: {
    debug: Debug,
  };
};
