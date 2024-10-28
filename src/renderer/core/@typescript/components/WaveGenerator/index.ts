import GameWave from '@renderer/core/GameWave';
import { mix } from '@renderer/core/@types/Mixable';

import type Game from '@renderer/core/Game';
import Component from '@renderer/core/@typescript/components/Component';
import Cooldown from '@renderer/core/@typescript/components/Cooldown';
import EventEmitter from '@renderer/core/@typescript/components/EventEmitter';
import { EventEmitterMixin } from '@renderer/core/@typescript/components/EventEmitter/mixin';
import PataPata from '@/renderer/core/@typescript/prefabs/enemies/PataPata';
import Mid from '@renderer/core/@typescript/prefabs/enemies/Mid';
import Cheetah from '@renderer/core/@typescript/prefabs/enemies/Cheetah';
import PowerArmor from '@renderer/core/@typescript/prefabs/enemies/PowerArmor';

export default class WaveGenerator extends mix(Component<Game>).with(EventEmitterMixin) {
  public currentWave: number = 0;

  public wave: GameWave | null = null;

  constructor(inst: Game, clazz: Function) {
    super(inst, clazz);

    this.addComponent(Cooldown<Game>, WaveGenerator);
    this.addComponent(EventEmitter<Game>, WaveGenerator);

    this.on('waveEnd', () => {
      this.currentWave += 1;
      this.generateNextWave();
    });
  }

  generateNextWave() {
    if (!this.inst.over && this.waveList[this.currentWave]) {
      this.wave = this.waveList[this.currentWave];
      this.wave.spawn();
      this.wave.on('waveEnd', (wave: GameWave) => {
        this.emit('waveEnd', { wave });
      }, { once: true });
    }
  }

  get waveList(): Array<GameWave> {
    let nbEntityBase = 4;
    return [...Array(15).keys()].map((index) => {
      nbEntityBase += 1;
      if (index % 5 === 0 && index > 0) {
        return [
          { entity: PowerArmor, amount: 1, delay: 50 },
          { entity: PataPata, amount: nbEntityBase, delay: 50 },
          { entity: Mid, amount: nbEntityBase, delay: 50 },
          { entity: Cheetah, amount: 5 * (index / 5), delay: 50 },
        ];
      }
      if (index === 13) {
        return [
          { entity: PowerArmor, amount: 3, delay: 50 },
          { entity: Cheetah, amount: 15, delay: 50 },
        ];
      }
      if (index === 14) {
        return [
          // { entity: CompilerBoss, amount: 1, delay: 50 },
        ];
      }
      return [
        { entity: PataPata, amount: nbEntityBase, delay: 50 },
        { entity: Mid, amount: nbEntityBase, delay: 50 },
      ];
    }).map((waveData, i) => new GameWave(i, waveData));
  }
}
