import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type LootDropper from '@/renderer/core/classes/components/typescript/LootDropper';
import type { ILootDropper } from '@/renderer/core/classes/components/typescript/LootDropper/i';

export const LootDropperMixin = (superclass: Constructor<Class>) => class extends superclass implements ILootDropper {
  declare components: {
    lootdropper: LootDropper,
  };

  dropLoots() {
    this.components.lootdropper.drop();
  }
};
