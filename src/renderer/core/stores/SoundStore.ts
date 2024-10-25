import AbstractRessourceStore from '@renderer/core/stores/AbstractRessourceStore';

import type Sound from '@renderer/core/@typescript/ressources/Sound';

class SoundStore extends AbstractRessourceStore<Sound> {
  play(soundPath: string): Sound | null {
    const sound = this.get(soundPath);
    sound?.play();
    return sound;
  }

  exists(soundPath: string): boolean {
    return this.get(soundPath) !== null;
  }
}

export default new SoundStore();
