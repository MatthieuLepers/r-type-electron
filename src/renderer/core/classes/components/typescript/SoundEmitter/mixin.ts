import Global from '@renderer/core/stores/AppStore';
import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type SoundEmitter from '@/renderer/core/classes/components/typescript/SoundEmitter';
import type { ISoundEmitter } from '@/renderer/core/classes/components/typescript/SoundEmitter/i';

export const SoundEmitterMixin = (superclass: Constructor<Class>) => class extends superclass implements ISoundEmitter {
  declare components: {
    soundemitter: SoundEmitter,
  };

  playSound(soundPath: string) {
    if (!this.components.soundemitter.cooldownActive()) {
      const sound = Global.Sounds.play(soundPath);
      if (sound) {
        this.components.soundemitter.currentSound[soundPath] = sound;
        this.components.soundemitter.startCooldown();
      }
    }
    return this.components.soundemitter.currentSound[soundPath];
  }

  stopCurrentSound(soundPath: string) {
    if (this.components.soundemitter.currentSound[soundPath]) {
      this.components.soundemitter.currentSound[soundPath].pause();
      delete this.components.soundemitter.currentSound[soundPath];
    }
  }

  setSoundCooldown(time: number) {
    this.components.soundemitter.setCooldown(time);
  }
};
