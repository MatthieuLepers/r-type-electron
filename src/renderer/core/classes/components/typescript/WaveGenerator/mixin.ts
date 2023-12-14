import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type WaveGenerator from '@/renderer/core/classes/components/typescript/WaveGenerator';
import type { IWaveGenerator } from '@/renderer/core/classes/components/typescript/WaveGenerator/i';

export const WaveGeneratorMixin = (superclass: Constructor<Class>) => class extends superclass implements IWaveGenerator {
  declare components: {
    wavegenerator: WaveGenerator,
  };
};
