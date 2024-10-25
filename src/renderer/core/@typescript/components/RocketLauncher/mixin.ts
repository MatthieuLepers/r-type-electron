import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import RocketLauncher from '@renderer/core/@typescript/components/RocketLauncher';
import type { IRocketLauncher } from '@renderer/core/@typescript/components/RocketLauncher/i';

export const RocketLauncherMixin = <T extends AnyConstructor<Class>>(base : T) => class MyRocketLauncherMixin extends base implements IRocketLauncher {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(RocketLauncher, MyRocketLauncherMixin);
  }
};
