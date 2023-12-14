import Global from '@renderer/core/stores/AppStore';
import Component from '@renderer/core/classes/components/Component';
import type { Constructor } from '@/renderer/core/@types';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import type Item from '@renderer/core/classes/prefabs/items/Item';

export interface ILoot {
  loot: Constructor<Item>;
  weight: number;
}

export default class LootDropper extends Component {
  declare inst: TEntityScript;

  public lootTable: Array<ILoot> = [];

  public dropAmount: number = 1;

  addLoot(loot: Constructor<Item>, weight = 1.0) {
    this.lootTable.push({ loot, weight });
  }

  pickRandomLootsFromTable(): Array<ILoot> {
    return [...Array(this.dropAmount).keys()]
      .map(() => Global.Random.weighted(this.lootTable))
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
}
