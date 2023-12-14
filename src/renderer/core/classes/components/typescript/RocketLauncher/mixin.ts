import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type RocketLauncher from '@/renderer/core/classes/components/typescript/RocketLauncher';
import type { IRocketLauncher } from '@/renderer/core/classes/components/typescript/RocketLauncher/i';

export const RocketLauncherMixin = (superclass: Constructor<Class>) => class extends superclass implements IRocketLauncher {
  declare components: {
    rocketlauncher: RocketLauncher,
  };
};
