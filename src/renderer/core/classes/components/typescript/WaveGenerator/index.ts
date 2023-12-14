import { mix } from '@/renderer/core/mixins/Mixable';
import Component from '@renderer/core/classes/components/Component';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import { CooldownMixin } from '@/renderer/core/classes/components/typescript/Cooldown/mixin';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';
import { EventEmitterMixin } from '@/renderer/core/classes/components/typescript/EventEmitter/mixin';
import GameWave from '@renderer/core/GameWave';
import PataPata from '@renderer/core/classes/prefabs/enemies/PataPata';
import Mid from '@renderer/core/classes/prefabs/enemies/Mid';
import Cheetah from '@renderer/core/classes/prefabs/enemies/Cheetah';
import PowerArmor from '@renderer/core/classes/prefabs/enemies/PowerArmor';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export default class WaveGenerator extends mix(Component).with(CooldownMixin).with(EventEmitterMixin) {
  declare inst: TEntityScript;

  public currentWave: number = 0;

  public wave: GameWave | null = null;

  constructor(inst: TEntityScript, clazz: Function) {
    super(inst, clazz);

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

  get waveList(): Array<GameWave> {
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
