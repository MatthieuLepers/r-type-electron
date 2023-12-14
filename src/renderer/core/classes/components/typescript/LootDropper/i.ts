import type LootDropper from '@/renderer/core/classes/components/typescript/LootDropper';

export interface ILootDropper {
  components: {
    lootdropper: LootDropper,
  };

  dropLoots(): void;
}
