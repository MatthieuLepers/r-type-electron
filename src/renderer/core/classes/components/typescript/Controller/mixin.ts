import type { Constructor } from '@/renderer/core/@types';
import type Class from '@/renderer/core/classes/Class';
import type Controller from '@/renderer/core/classes/components/typescript/Controller';
import type { IController } from '@/renderer/core/classes/components/typescript/Controller/i';

export const ControllerMixin = (superclass: Constructor<Class>) => class extends superclass implements IController {
  declare components: {
    controller: Controller,
  };
};
