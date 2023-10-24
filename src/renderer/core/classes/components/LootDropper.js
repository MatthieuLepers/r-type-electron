import Global from '@renderer/core/stores/AppStore';
import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class LootDropper extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.lootTable = [];
    this.dropAmount = 1;

    AddClassMethod(this.clazz, 'dropLoots', function () {
      this.components.lootdropper.drop();
    });
  }

  /**
   * @param {EntityScript} loot
   * @param {Float} weight [0, 1]
   */
  addLoot(loot, weight = 1.0) {
    this.lootTable.push({ loot, weight });
  }

  /**
   * @return {EntityScript[]}
   */
  pickRandomLootsFromTable() {
    return [...Array(this.dropAmount).keys()]
      .map(() => Global.Random.weighted(this.lootTable))
    ;
  }

  /**
   * @return {EntityScript[]}
   */
  drop() {
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
