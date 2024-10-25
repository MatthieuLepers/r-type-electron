import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import Controller from '@renderer/core/@typescript/components/Controller';
import type { IController } from '@renderer/core/@typescript/components/Controller/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const ControllerMixin = <T extends AnyConstructor<EntityScript>>(base : T) => class MyControllerMixin extends base implements IController {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Controller, MyControllerMixin);
  }
};
