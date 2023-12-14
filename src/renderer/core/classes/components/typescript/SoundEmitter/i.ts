import type SoundEmitter from '@/renderer/core/classes/components/typescript/SoundEmitter';

export interface ISoundEmitter {
  components: {
    soundemitter: SoundEmitter,
  };

  playSound(soundPath: string): void;

  stopCurrentSound(soundPath: string): void;

  setSoundCooldown(time: number): void;
}
