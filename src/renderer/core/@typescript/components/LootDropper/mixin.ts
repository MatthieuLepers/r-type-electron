import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import LootDropper from '@renderer/core/@typescript/components/LootDropper';
import type { ILootDropper } from '@renderer/core/@typescript/components/LootDropper/i';

export const LootDropperMixin = <T extends AnyConstructor<Class>>(base : T) => class MyLootDropperMixin extends base implements ILootDropper {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(LootDropper, MyLootDropperMixin);
  }

  dropLoots() {
    this.components.lootdropper.drop();
  }
};
