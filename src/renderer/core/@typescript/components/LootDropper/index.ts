import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import Component from '@renderer/core/@typescript/components/Component';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type Item from '@renderer/core/@typescript/prefabs/items/Item';

export interface ILoot {
  loot: AnyConstructor<Item>;
  weight: number;
}

export default class LootDropper extends Component<EntityScript> {
  public lootTable: Array<ILoot> = [];

  public dropAmount: number = 1;

  addLoot(loot: AnyConstructor<Item>, weight = 1.0) {
    this.lootTable.push({ loot, weight });
  }

  pickRandomLootsFromTable(): Array<ILoot> {
    return [...Array(this.dropAmount).keys()]
      .map(() => Global.Random.weighted(this.lootTable)) as Array<ILoot>
    ;
  }

  drop(): Array<Item> {
    return this.pickRandomLootsFromTable().map(({ loot }) => {
      const lootObj = new loot(this.inst);
      lootObj.spawn();
      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit('lootDropped', { loot: lootObj });
      }
      return lootObj;
    });
  }

  toDebugObject() {
    return {
      lootTable: this.lootTable.map(({ loot, weight }) => ({ loot: loot.name, weight })),
      dropAmount: this.dropAmount,
    };
  }
}
