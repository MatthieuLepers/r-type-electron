import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import Debug from '@renderer/core/@typescript/components/Debug';
import type { IDebug } from '@renderer/core/@typescript/components/Debug/i';

export const DebugMixin = <T extends AnyConstructor<Class>>(base : T) => class MyDebugMixin extends base implements IDebug {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Debug, MyDebugMixin);
  }
};
