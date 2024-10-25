import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import SoundEmitter from '@renderer/core/@typescript/components/SoundEmitter';
import type { ISoundEmitter } from '@renderer/core/@typescript/components/SoundEmitter/i';

export const SoundEmitterMixin = <T extends AnyConstructor<Class>>(base : T) => class MySoundEmitterMixin extends base implements ISoundEmitter {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(SoundEmitter, MySoundEmitterMixin);
  }

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
