import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import WaveGenerator from '@renderer/core/@typescript/components/WaveGenerator';
import type { IWaveGenerator } from '@renderer/core/@typescript/components/WaveGenerator/i';

export const WaveGeneratorMixin = <T extends AnyConstructor<Class>>(base : T) => class MyWaveGeneratorMixin extends base implements IWaveGenerator {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(WaveGenerator, MyWaveGeneratorMixin);
  }
};
