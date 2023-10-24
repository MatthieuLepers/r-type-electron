import Component from '@renderer/core/classes/components/Component';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';
import GameWave from '@renderer/core/GameWave';
import PataPata from '@renderer/core/classes/prefabs/enemies/PataPata';
import Mid from '@renderer/core/classes/prefabs/enemies/Mid';
import Cheetah from '@renderer/core/classes/prefabs/enemies/Cheetah';
import PowerArmor from '@renderer/core/classes/prefabs/enemies/PowerArmor';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class WaveGenerator extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    // this.waveList = [];
    this.currentWave = 0;
    this.wave = null;

    this.addComponent(Cooldown, WaveGenerator);
    this.addComponent(EventEmitter, WaveGenerator);

    this.on('waveEnd', () => {
      this.currentWave += 1;
      this.generateNextWave();
    });
  }

  generateNextWave() {
    if (this.waveList[this.currentWave]) {
      this.wave = this.waveList[this.currentWave];
      this.wave.spawn();
      this.wave.on('waveEnd', (wave) => {
        this.emit('waveEnd', { wave });
      }, { once: true });
    }
  }

  /**
   * @return {Array[]}
   */
  get waveList() {
    let nbEntityBase = 4;
    return [...Array(25).keys()].map((index) => {
      nbEntityBase += 1;
      if (index % 5 === 0 && index > 0) {
        return [
          { entity: PowerArmor, amount: 1, delay: 50 },
          { entity: PataPata, amount: nbEntityBase, delay: 50 },
          { entity: Mid, amount: nbEntityBase, delay: 50 },
          { entity: Cheetah, amount: 5 * (index / 5), delay: 50 },
        ];
      }
      if (index === 23) {
        return [
          { entity: PowerArmor, amount: 3, delay: 50 },
          { entity: Cheetah, amount: 15, delay: 50 },
        ];
      }
      if (index === 24) {
        return [
          // { entity: Compiler, amount: 1, delay: 50 },
        ];
      }
      return [
        { entity: PataPata, amount: nbEntityBase, delay: 50 },
        { entity: Mid, amount: nbEntityBase, delay: 50 },
      ];
    }).map((waveData, i) => new GameWave(i, waveData));
  }
}
